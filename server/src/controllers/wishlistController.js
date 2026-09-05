const pool = require("../config/db");

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT
        w.id,
        p.id AS product_id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.status,
        i.quantity AS stock_quantity

      FROM wishlists w

      JOIN products p
        ON p.id = w.product_id

      JOIN inventory i
        ON i.product_id = p.id

      WHERE w.user_id = $1

      ORDER BY w.created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      wishlist: result.rows,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId",
      });
    }

    const product = await pool.query(
      `
      SELECT id, status
      FROM products
      WHERE id = $1
      `,
      [productId]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO wishlists (user_id, product_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, product_id)
      DO NOTHING
      RETURNING id
      `,
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Product already in wishlist",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlistId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
    });
  }
};

const removeFromWishlist = async (req, res) => {
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
      DELETE FROM wishlists
      WHERE user_id = $1
        AND product_id = $2
      RETURNING id
      `,
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove product",
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};