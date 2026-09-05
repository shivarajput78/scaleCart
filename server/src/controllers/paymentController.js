const pool = require("../config/db");
const razorpay = require("../config/razorpay");

const crypto = require("crypto");

const createPayment = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.userId;
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    await client.query("BEGIN");

    const orderResult = await client.query(
      `
      SELECT id, user_id, status, total_amount
      FROM orders
      WHERE id = $1
        AND user_id = $2
      FOR UPDATE
      `,
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orderResult.rows[0];

    if (order.status !== "PENDING") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Payment cannot be created for this order",
      });
    }

    const existingPayment = await client.query(
      `
      SELECT id, status, amount, currency, provider_order_id
      FROM payments
      WHERE order_id = $1
      `,
      [orderId]
    );

    if (existingPayment.rows.length > 0) {
      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        message: "Payment already exists",
        payment: existingPayment.rows[0],
      });
    }

    /*
     * Razorpay amount is in the smallest
     * currency unit.
     *
     * Example:
     * ₹499.00 -> 49900 paise
     */
    const amountInPaise = Math.round(
      Number(order.total_amount) * 100
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `scalecart_order_${orderId}`,
      notes: {
        scalecart_order_id: String(orderId),
        user_id: String(userId),
      },
    });

    const paymentResult = await client.query(
      `
      INSERT INTO payments (
        order_id,
        user_id,
        provider,
        provider_order_id,
        amount,
        currency,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        order_id,
        provider,
        provider_order_id,
        amount,
        currency,
        status,
        created_at
      `,
      [
        orderId,
        userId,
        "razorpay",
        razorpayOrder.id,
        order.total_amount,
        "INR",
        "CREATED",
      ]
    );

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Payment order created",
      payment: {
        id: paymentResult.rows[0].id,
        orderId: order.id,
        provider: "razorpay",

        // Frontend needs this
        razorpayOrderId: razorpayOrder.id,

        amount: paymentResult.rows[0].amount,
        currency: "INR",

        keyId: process.env.RAZORPAY_KEY_ID,

        status: "CREATED",
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Create payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create payment",
    });
  } finally {
    client.release();
  }
};











const verifyPayment = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.userId;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete payment response",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    await client.query("BEGIN");

    const paymentResult = await client.query(
  `
  SELECT
    p.*,
    o.total_amount AS order_total
  FROM payments p
  JOIN orders o
    ON o.id = p.order_id
  WHERE p.provider_order_id = $1
    AND p.user_id = $2
  FOR UPDATE
  `,
  [razorpay_order_id, userId]
);

    if (paymentResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    const payment = paymentResult.rows[0];

    // Idempotency
    if (payment.status === "PAID") {
      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      });
    }


    const expectedAmount = Math.round(
  Number(payment.order_total) * 100
);


const razorpayPayment =
  await razorpay.payments.fetch(
    razorpay_payment_id
  );




  if (
  razorpayPayment.order_id !== razorpay_order_id
) {
  await client.query("ROLLBACK");

  return res.status(400).json({
    success: false,
    message: "Payment order mismatch",
  });
}


if (
  razorpayPayment.amount !== expectedAmount
) {
  await client.query("ROLLBACK");

  return res.status(400).json({
    success: false,
    message: "Payment amount mismatch",
  });
}




if (razorpayPayment.currency !== "INR") {
  await client.query("ROLLBACK");

  return res.status(400).json({
    success: false,
    message: "Invalid payment currency",
  });
}


if (razorpayPayment.status !== "captured") {
  await client.query("ROLLBACK");

  return res.status(400).json({
    success: false,
    message: "Payment has not been captured",
  });
}

    

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
        razorpay_payment_id,
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

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Verify payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  } finally {
    client.release();
  }
};

module.exports = {
  createPayment,
  verifyPayment,
};