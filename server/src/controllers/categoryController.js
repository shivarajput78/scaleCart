const pool = require("../config/db");

const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO categories (name, slug)
       VALUES ($1, $2)
       RETURNING *`,
      [name.trim(), slug.trim().toLowerCase()]
    );

    res.status(201).json({
      success: true,
      category: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, slug, created_at
       FROM categories
       ORDER BY name ASC`
    );

    res.json({
      success: true,
      categories: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
};