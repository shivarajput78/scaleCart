const pool = require("../config/db");
const { getIO } = require("../socket");

const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.userId;
    const { addressId } = req.body;

    if (
      !Number.isInteger(addressId) ||
      addressId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid addressId",
      });
    }

    await client.query("BEGIN");

    // 1. Verify address belongs to user
 const addressResult = await client.query(
  `
  SELECT
    id,
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country
  FROM addresses
  WHERE id = $1
    AND user_id = $2
  `,
  [addressId, userId]
);

    if (addressResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Invalid delivery address",
      });
    }
    const address = addressResult.rows[0];

    // 2. Get user's cart
    const cartResult = await client.query(
      `
      SELECT id
      FROM carts
      WHERE user_id = $1
      `,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const cartId = cartResult.rows[0].id;


        // 3. Get cart items
    const cartItemsResult = await client.query(
      `
      SELECT
        ci.product_id,
        ci.quantity,
        p.name,
        p.price,
        p.status,
        i.quantity AS stock

      FROM cart_items ci

      JOIN products p
        ON p.id = ci.product_id

      JOIN inventory i
        ON i.product_id = ci.product_id

      WHERE ci.cart_id = $1

      FOR UPDATE OF i
      `,
      [cartId]
    );

    if (cartItemsResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const cartItems = cartItemsResult.rows;

        // 4. Validate stock
    for (const item of cartItems) {
      if (item.status !== "active") {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: `${item.name} is no longer available`,
        });
      }

      if (item.quantity > item.stock) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}`,
          availableStock: item.stock,
          requestedQuantity: item.quantity,
        });
      }
    }





        const subtotal = cartItems.reduce(
      (sum, item) =>
        sum + Number(item.price) * item.quantity,
      0
    );

    const shippingFee = subtotal >= 500 ? 0 : 50;

    const totalAmount = subtotal + shippingFee;








        // 5. Create order
    const orderResult = await client.query(
  `
  INSERT INTO orders (
    user_id,
    address_id,
    status,
    subtotal,
    shipping_fee,
    total_amount
  )
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *
  `,
  [
    userId,
    address.id,
    "PENDING",
    subtotal,
    shippingFee,
    totalAmount,
  ]
);

const order = orderResult.rows[0];





await client.query(
  `
  INSERT INTO order_addresses (
    order_id,
    full_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `,
  [
    order.id,
    address.full_name,
    address.phone,
    address.address_line1,
    address.address_line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ]
);




      // 6. Create order items and reduce stock
for (const item of cartItems) {
  const itemSubtotal =
    Number(item.price) * item.quantity;

  await client.query(
    `
    INSERT INTO order_items (
      order_id,
      product_id,
      product_name,
      unit_price,
      quantity,
      subtotal
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      order.id,
      item.product_id,
      item.name,
      item.price,
      item.quantity,
      itemSubtotal,
    ]
  );

  const stockUpdate = await client.query(
    `
    UPDATE inventory
    SET
      quantity = quantity - $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE product_id = $2
      AND quantity >= $1
    RETURNING product_id, quantity
    `,
    [
      item.quantity,
      item.product_id,
    ]
  );

  if (stockUpdate.rows.length === 0) {
    throw new Error(
      `Stock changed for product ${item.product_id}`
    );
  }
}








        // 7. Clear cart
    await client.query(
      `
      DELETE FROM cart_items
      WHERE cart_id = $1
      `,
      [cartId]
    );

    await client.query(
      `
      UPDATE carts
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [cartId]
    );



        await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        id: order.id,
        status: order.status,
        subtotal: order.subtotal,
        shippingFee: order.shipping_fee,
        totalAmount: order.total_amount,
      },
    });







      } catch (error) {
    await client.query("ROLLBACK");

    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  } finally {
    client.release();
  }
};












const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT
        o.id,
        o.status,
        o.subtotal,
        o.shipping_fee,
        o.total_amount,
        o.created_at,
        o.updated_at,

        COUNT(oi.id)::INTEGER AS item_count

      FROM orders o

      LEFT JOIN order_items oi
        ON oi.order_id = o.id

      WHERE o.user_id = $1

      GROUP BY o.id

      ORDER BY o.created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

















const getOrderById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

   const orderResult = await pool.query(
  `
  SELECT
    o.id,
    o.status,
    o.subtotal,
    o.shipping_fee,
    o.total_amount,
    o.created_at,
    o.updated_at,

    oa.full_name,
    oa.phone,
    oa.address_line1,
    oa.address_line2,
    oa.city,
    oa.state,
    oa.postal_code,
    oa.country

  FROM orders o

  LEFT JOIN order_addresses oa
    ON oa.order_id = o.id

  WHERE o.id = $1
    AND o.user_id = $2
  `,
  [id, userId]
);


    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const itemsResult = await pool.query(
      `
      SELECT
        id,
        product_id,
        product_name,
        unit_price,
        quantity,
        subtotal

      FROM order_items

      WHERE order_id = $1

      ORDER BY id ASC
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      order: {
        ...orderResult.rows[0],
        items: itemsResult.rows,
      },
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};
















const cancelOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.userId;
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    await client.query("BEGIN");

    const orderResult = await client.query(
      `
      SELECT id, status
      FROM orders
      WHERE id = $1
        AND user_id = $2
      FOR UPDATE
      `,
      [id, userId]
    );

    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orderResult.rows[0];

    const cancellableStatuses = [
      "PENDING",
      "CONFIRMED",
    ];

    if (!cancellableStatuses.includes(order.status)) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in ${order.status} state`,
      });
    }

    const itemsResult = await client.query(
      `
      SELECT product_id, quantity
      FROM order_items
      WHERE order_id = $1
      `,
      [id]
    );

    // Restore stock
    for (const item of itemsResult.rows) {
      await client.query(
        `
        UPDATE inventory
        SET
          quantity = quantity + $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE product_id = $2
        `,
        [item.quantity, item.product_id]
      );
    }

    const updatedOrder = await client.query(
      `
      UPDATE orders
      SET
        status = 'CANCELLED',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, status, updated_at
      `,
      [id]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: updatedOrder.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Cancel order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  } finally {
    client.release();
  }
};









const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        o.id,
        o.user_id,
        u.name AS customer_name,
        u.email AS customer_email,
        o.status,
        o.subtotal,
        o.shipping_fee,
        o.total_amount,
        o.created_at,
        o.updated_at

      FROM orders o

      JOIN users u
        ON u.id = o.user_id

      ORDER BY o.created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};








const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedTransitions = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["PACKED", "CANCELLED"],
      PACKED: ["SHIPPED"],
      SHIPPED: ["OUT_FOR_DELIVERY"],
      OUT_FOR_DELIVERY: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    if (!allowedTransitions[status]) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const currentResult = await pool.query(
      `
      SELECT id, status
      FROM orders
      WHERE id = $1
      `,
      [id]
    );

    if (currentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const currentStatus = currentResult.rows[0].status;

    if (
      !allowedTransitions[currentStatus].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Cannot move order from ${currentStatus} to ${status}`,
      });
    }

    const result = await pool.query(
      `
      UPDATE orders
      SET
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, status, updated_at
      `,
      [status, id]
    );

    // Real-time notification
    const io = getIO();

    io.to(`order:${id}`).emit(
      "order-status-updated",
      {
        orderId: Number(id),
        status,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};