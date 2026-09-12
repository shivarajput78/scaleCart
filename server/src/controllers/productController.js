const pool = require("../config/db");
const { redisClient } = require("../config/redis");

// ==========================================
// CREATE PRODUCT
// ==========================================

const createProduct = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      categoryId,
      name,
      slug,
      description,
      price,
      quantity,
      imageUrl,
    } = req.body;

    if (
      !categoryId ||
      !name ||
      !slug ||
      price === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    if (Number(price) < 0 || Number(quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price and quantity cannot be negative",
      });
    }

    await client.query("BEGIN");

    // Check category
    const category = await client.query(
      "SELECT id FROM categories WHERE id = $1",
      [categoryId]
    );

    if (category.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Create product
    const productResult = await client.query(
      `INSERT INTO products
       (category_id, name, slug, description, price, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        categoryId,
        name.trim(),
        slug.trim().toLowerCase(),
        description || null,
        price,
        imageUrl?.trim() || null,
      ]
    );

    const product = productResult.rows[0];

    // Create inventory
    await client.query(
      `INSERT INTO inventory
       (product_id, quantity)
       VALUES ($1, $2)`,
      [product.id, quantity]
    );

    await client.query("COMMIT");

    // Product list cache invalidate
    await clearProductListCache();

    return res.status(201).json({
      success: true,
      product,
      inventory: {
        quantity: Number(quantity),
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Product slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
};

// ==========================================
// GET PRODUCTS
// ==========================================

const getProducts = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 100,
      search = "",
      category,
      minPrice,
      maxPrice,
      sort = "newest",
    } = req.query;

    // Normalize pagination
    page = Math.max(Number(page), 1);
    limit = Math.min(Math.max(Number(limit), 1), 200);

    const offset = (page - 1) * limit;

    // ==========================================
    // REDIS CACHE
    // ==========================================

    const cacheKey = `products:${JSON.stringify(req.query)}`;

    try {
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        console.log("Product cache HIT:", cacheKey);

        return res.status(200).json({
          ...JSON.parse(cachedData),
          source: "cache",
        });
      }

      console.log("Product cache MISS:", cacheKey);
    } catch (redisError) {
      // Redis fail hone par application PostgreSQL se continue karega
      console.error(
        "Redis GET error:",
        redisError.message
      );
    }

    // ==========================================
    // BUILD QUERY
    // ==========================================

    const values = [];
    const conditions = [];

    // Search
    if (search.trim()) {
      values.push(`%${search.trim()}%`);

      conditions.push(`
        (
          p.name ILIKE $${values.length}
          OR p.description ILIKE $${values.length}
        )
      `);
    }

    // Category
    if (category) {
      values.push(category);

      conditions.push(
       `c.slug = $${values.length}`
      );
    }

    // Minimum price
    if (minPrice !== undefined) {
      values.push(Number(minPrice));

      conditions.push(
       `p.price >= $${values.length}`
      );
    }

    // Maximum price
    if (maxPrice !== undefined) {
      values.push(Number(maxPrice));

      conditions.push(
       `p.price <= $${values.length}`
      );
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    // ==========================================
    // SORTING
    // ==========================================

    let orderBy = "p.created_at DESC";

    if (sort === "price_asc") {
      orderBy = "p.price ASC";
    }

    if (sort === "price_desc") {
      orderBy = "p.price DESC";
    }

    if (sort === "name_asc") {
      orderBy = "p.name ASC";
    }

    // ==========================================
    // MAIN PRODUCT QUERY
    // ==========================================

    const productQuery = `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.image_url,
        p.status,
        p.created_at,

        c.id AS category_id,
        c.name AS category_name,
        c.slug AS category_slug,

        i.quantity AS stock_quantity

      FROM products p

      JOIN categories c
        ON c.id = p.category_id

      JOIN inventory i
        ON i.product_id = p.id

      ${whereClause}

      ORDER BY ${orderBy}

      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    const productValues = [
      ...values,
      limit,
      offset,
    ];

    const result = await pool.query(
      productQuery,
      productValues
    );

    // ==========================================
    // COUNT QUERY
    // ==========================================

    const countQuery = `
      SELECT COUNT(*)

      FROM products p

      JOIN categories c
        ON c.id = p.category_id

      JOIN inventory i
        ON i.product_id = p.id

      ${whereClause}
    `;

    const countResult = await pool.query(
      countQuery,
      values
    );

    const totalProducts = Number(
      countResult.rows[0].count
    );

    const totalPages = Math.ceil(
      totalProducts / limit
    );

    // ==========================================
    // RESPONSE DATA
    // ==========================================

    const responseData = {
      success: true,

      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },

      products: result.rows,
    };

    // ==========================================
    // SAVE TO REDIS
    // ==========================================

    try {
      await redisClient.setEx(
        cacheKey,
        60,
        JSON.stringify(responseData)
      );

      console.log(
        "Product cache SET:",
        cacheKey
      );
    } catch (redisError) {
      console.error(
        "Redis SET error:",
        redisError.message
      );
    }

    return res.status(200).json({
      ...responseData,
      source: "database",
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==========================================
// GET PRODUCT BY ID
// ==========================================

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const cacheKey = `product:${id}`;

    // Check Redis
    try {
      const cachedProduct =
        await redisClient.get(cacheKey);

      if (cachedProduct) {
        console.log(
          "Product detail cache HIT:",
          cacheKey
        );

        return res.status(200).json({
          success: true,
          product: JSON.parse(cachedProduct),
          source: "cache",
        });
      }

      console.log(
        "Product detail cache MISS:",
        cacheKey
      );
    } catch (redisError) {
      console.error(
        "Redis GET error:",
        redisError.message
      );
    }

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.image_url,
        p.status,
        p.created_at,
        p.updated_at,

        c.id AS category_id,
        c.name AS category_name,
        c.slug AS category_slug,

        i.quantity AS stock_quantity

      FROM products p

      JOIN categories c
        ON c.id = p.category_id

      JOIN inventory i
        ON i.product_id = p.id

      WHERE p.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = result.rows[0];

    // Save product detail in Redis
    try {
      await redisClient.setEx(
        cacheKey,
        60,
        JSON.stringify(product)
      );

      console.log(
        "Product detail cache SET:",
        cacheKey
      );
    } catch (redisError) {
      console.error(
        "Redis SET error:",
        redisError.message
      );
    }

    return res.status(200).json({
      success: true,
      product,
      source: "database",
    });
  } catch (error) {
    console.error(
      "Get product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// ==========================================
// UPDATE PRODUCT
// ==========================================

const updateProduct = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const {
      name,
      slug,
      description,
      price,
      categoryId,
      status,
      imageUrl,
    } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    if (
      name === undefined &&
      slug === undefined &&
      description === undefined &&
      price === undefined &&
      categoryId === undefined &&
      status === undefined &&
      imageUrl === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required",
      });
    }

    if (price !== undefined) {
      if (
        Number.isNaN(Number(price)) ||
        Number(price) < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Price must be a valid non-negative number",
        });
      }
    }

    const allowedStatuses = [
      "active",
      "inactive",
    ];

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product status",
      });
    }

    await client.query("BEGIN");

    // Check product
    const existingProduct =
      await client.query(
        `SELECT * FROM products WHERE id = $1 FOR UPDATE`,
        [id]
      );

    if (existingProduct.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check category
    if (categoryId !== undefined) {
      const category = await client.query(
        `SELECT id FROM categories WHERE id = $1`,
        [categoryId]
      );

      if (category.rows.length === 0) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    const result = await client.query(
      `
      UPDATE products
      SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        price = COALESCE($4, price),
        category_id = COALESCE($5, category_id),
        status = COALESCE($6, status),
        image_url = COALESCE($7, image_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
      `,
      [
        name,
        slug,
        description,
        price,
        categoryId,
        status,
        imageUrl?.trim() || null,
        id,
      ]
    );

    await client.query("COMMIT");

    // Invalidate caches
    await clearProductListCache();
    await clearProductDetailCache(id);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Update product error:",
      error
    );

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Product slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  } finally {
    client.release();
  }
};

// ==========================================
// DELETE / DEACTIVATE PRODUCT
// ==========================================

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const result = await pool.query(
      `
      UPDATE products
      SET
        status = 'inactive',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, status
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Invalidate caches
    await clearProductListCache();
    await clearProductDetailCache(id);

    return res.status(200).json({
      success: true,
      message:
        "Product deactivated successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

// ==========================================
// UPDATE INVENTORY
// ==========================================

const updateInventory = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    if (
      quantity === undefined ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be a non-negative integer",
      });
    }

    await client.query("BEGIN");

    const product = await client.query(
      `SELECT id FROM products WHERE id = $1`,
      [id]
    );

    if (product.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const inventory = await client.query(
      `
      UPDATE inventory
      SET
        quantity = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $2
      RETURNING product_id, quantity, updated_at
      `,
      [quantity, id]
    );

    if (inventory.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message:
          "Inventory record not found",
      });
    }

    await client.query("COMMIT");

    // Inventory changed, so product cache must be cleared
    await clearProductListCache();
    await clearProductDetailCache(id);

    return res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      inventory: inventory.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Update inventory error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update inventory",
    });
  } finally {
    client.release();
  }
};

// ==========================================
// CACHE HELPERS
// ==========================================

async function clearProductListCache() {
  try {
    const keys = await redisClient.keys(
      "products:*"
    );

    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(
        `Cleared ${keys.length} product list cache(s)`
      );
    }
  } catch (error) {
    console.error(
      "Failed to clear product list cache:",
      error.message
    );
  }
}

async function clearProductDetailCache(
  productId
) {
  try {
    await redisClient.del(
      `product:${productId}`
    );

    console.log(
      `Cleared product detail cache: product:${productId}`
    );
  } catch (error) {
    console.error(
      "Failed to clear product detail cache:",
      error.message
    );
  }
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateInventory,
};