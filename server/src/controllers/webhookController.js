const crypto = require("crypto");

const pool = require("../config/db");

const handleRazorpayWebhook = async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const eventId = req.headers["x-razorpay-event-id"];

  if (!signature || !eventId) {
    return res.status(400).json({
      success: false,
      message: "Missing webhook headers",
    });
  }

  try {
    /*
     * IMPORTANT:
     * Use raw request body for signature verification.
     */
    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_WEBHOOK_SECRET
      )
      .update(req.body)
      .digest("hex");

    const signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );

    if (!signaturesMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const payload = JSON.parse(req.body.toString());

    const eventType = payload.event;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      /*
       * Store webhook event.
       *
       * If the same event arrives again,
       * UNIQUE(provider, event_id) protects us.
       */
      const eventResult = await client.query(
        `
        INSERT INTO webhook_events (
          provider,
          event_id,
          event_type,
          payload
        )
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (provider, event_id)
        DO NOTHING
        RETURNING id
        `,
        [
          "razorpay",
          eventId,
          eventType,
          payload,
        ]
      );

      /*
       * Duplicate webhook.
       */
      if (eventResult.rows.length === 0) {
        await client.query("ROLLBACK");

        return res.status(200).json({
          success: true,
          message: "Webhook already processed",
        });
      }

      /*
       * We currently care about payment captured.
       */
      if (eventType === "payment.captured") {
        const paymentEntity =
          payload.payload?.payment?.entity;

        if (!paymentEntity) {
          throw new Error(
            "Payment entity missing from webhook"
          );
        }

        const providerPaymentId = paymentEntity.id;
        const providerOrderId = paymentEntity.order_id;

        const paymentResult = await client.query(
          `
          SELECT *
          FROM payments
          WHERE provider_order_id = $1
          FOR UPDATE
          `,
          [providerOrderId]
        );

        if (paymentResult.rows.length === 0) {
          throw new Error(
            "Payment record not found"
          );
        }

        const payment = paymentResult.rows[0];

        /*
         * Idempotency:
         * If already PAID, don't perform the
         * business operation again.
         */
        if (payment.status !== "PAID") {
          await client.query(
            `
            UPDATE payments
            SET
              provider_payment_id = $1,
              status = 'PAID',
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            `,
            [
              providerPaymentId,
              payment.id,
            ]
          );

          await client.query(
            `
            UPDATE orders
            SET
              status = 'CONFIRMED',
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
              AND status = 'PENDING'
            `,
            [payment.order_id]
          );
        }
      }

      await client.query(
        `
        UPDATE webhook_events
        SET
          processed = TRUE,
          processed_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [eventResult.rows[0].id]
      );

      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        message: "Webhook processed",
      });
    } catch (error) {
      await client.query("ROLLBACK");

      console.error(
        "Webhook processing error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Webhook processing failed",
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(
      "Webhook signature error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: "Invalid webhook payload",
    });
  }
};

module.exports = {
  handleRazorpayWebhook,
};