const pool = require("../config/db");

const getOrCreateCart = async (client, userId) => {
  const existingCart = await client.query(
    `
    SELECT id
    FROM carts
    WHERE user_id = $1
    `,
    [userId]
  );

  if (existingCart.rows.length > 0) {
    return existingCart.rows[0].id;
  }

  const newCart = await client.query(
    `
    INSERT INTO carts (user_id)
    VALUES ($1)
    RETURNING id
    `,
    [userId]
  );

  return newCart.rows[0].id;
};









const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT
        ci.id,
        ci.product_id,
        p.name,
        p.slug,
        p.price,
        ci.quantity,

        (p.price * ci.quantity) AS subtotal,

        i.quantity AS available_stock

      FROM carts c

      JOIN cart_items ci
        ON ci.cart_id = c.id

      JOIN products p
        ON p.id = ci.product_id

      JOIN inventory i
        ON i.product_id = p.id

      WHERE c.user_id = $1
        AND p.status = 'active'

      ORDER BY ci.created_at DESC
      `,
      [userId]
    );

    const total = result.rows.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0
    );

    return res.status(200).json({
      success: true,
      cart: {
        items: result.rows,
        total: total.toFixed(2),
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};










const addToCart = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.userId;

    const { productId, quantity } = req.body;

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId",
      });
    }

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    await client.query("BEGIN");

    // Product + stock check
    const productResult = await client.query(
      `
      SELECT
        p.id,
        p.name,
        p.price,
        p.status,
        i.quantity AS stock

      FROM products p

      JOIN inventory i
        ON i.product_id = p.id

      WHERE p.id = $1

      FOR UPDATE OF i
      `,
      [productId]
    );

    if (productResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = productResult.rows[0];

    if (product.status !== "active") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    if (product.stock < quantity) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
        availableStock: product.stock,
      });
    }

    const cartId = await getOrCreateCart(client, userId);

    const existingItem = await client.query(
      `
      SELECT quantity
      FROM cart_items
      WHERE cart_id = $1
        AND product_id = $2
      `,
      [cartId, productId]
    );

    let newQuantity;

    if (existingItem.rows.length > 0) {
      newQuantity =
        existingItem.rows[0].quantity + quantity;

      if (newQuantity > product.stock) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "Requested quantity exceeds stock",
          availableStock: product.stock,
        });
      }

      await client.query(
        `
        UPDATE cart_items
        SET
          quantity = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE cart_id = $2
          AND product_id = $3
        `,
        [newQuantity, cartId, productId]
      );
    } else {
      newQuantity = quantity;

      await client.query(
        `
        INSERT INTO cart_items
          (cart_id, product_id, quantity)
        VALUES
          ($1, $2, $3)
        `,
        [cartId, productId, quantity]
      );
    }

    await client.query(
      `
      UPDATE carts
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `,
      [cartId]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      productId,
      quantity: newQuantity,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Add to cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  } finally {
    client.release();
  }
};




















const updateCartItem = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!/^\d+$/.test(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    await client.query("BEGIN");

    const result = await client.query(
      `
      SELECT
        ci.id,
        i.quantity AS stock

      FROM cart_items ci

      JOIN carts c
        ON c.id = ci.cart_id

      JOIN inventory i
        ON i.product_id = ci.product_id

      WHERE c.user_id = $1
        AND ci.product_id = $2

      FOR UPDATE OF i
      `,
      [userId, productId]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const stock = result.rows[0].stock;

    if (quantity > stock) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        success: false,
        message: "Quantity exceeds available stock",
        availableStock: stock,
      });
    }

    await client.query(
      `
      UPDATE cart_items
      SET
        quantity = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [quantity, result.rows[0].id]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      quantity,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Update cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  } finally {
    client.release();
  }
};















const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    if (!/^\d+$/.test(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM cart_items ci
      USING carts c
      WHERE ci.cart_id = c.id
        AND c.user_id = $1
        AND ci.product_id = $2
      RETURNING ci.id
      `,
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove product",
    });
  }
};








module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};



// getOrCreateCart ko route se directly call nahi karna hai. Ye ek helper function hai jo addToCart ke andar use ho raha hai.