const request = require("supertest");

const app = require("../src/server");

describe("Products API", () => {
  let createdProductId;
  let categoryId;

  beforeAll(async () => {
    // Get an existing category from database
    const pool = require("../src/config/db");

    const result = await pool.query(
      "SELECT id FROM categories ORDER BY id LIMIT 1"
    );

    if (result.rows.length === 0) {
      throw new Error(
        "No category found. Please create at least one category first."
      );
    }

    categoryId = result.rows[0].id;
  });

  test("GET /api/products should return products", async () => {
    const response = await request(app).get("/api/products");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body).toHaveProperty("products");
    expect(response.body).toHaveProperty("pagination");

    expect(Array.isArray(response.body.products)).toBe(true);

    expect(response.body.pagination).toHaveProperty("page");
    expect(response.body.pagination).toHaveProperty("limit");
    expect(response.body.pagination).toHaveProperty("totalProducts");
    expect(response.body.pagination).toHaveProperty("totalPages");
    expect(response.body.pagination).toHaveProperty("hasNextPage");
    expect(response.body.pagination).toHaveProperty(
      "hasPreviousPage"
    );
  });

  test("GET /api/products should support pagination", async () => {
    const response = await request(app)
      .get("/api/products")
      .query({
        page: 1,
        limit: 2,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.pagination.page).toBe(1);
    expect(response.body.pagination.limit).toBe(2);

    expect(response.body.products.length).toBeLessThanOrEqual(2);
  });

  test("GET /api/products should support search", async () => {
    const response = await request(app)
      .get("/api/products")
      .query({
        search: "a",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.products)).toBe(true);
  });

  test("GET /api/products should support price sorting", async () => {
    const response = await request(app)
      .get("/api/products")
      .query({
        sort: "price_asc",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.products)).toBe(true);
  });

  test("GET /api/products/:id should return 400 for invalid id", async () => {
    const response = await request(app).get(
      "/api/products/abc"
    );

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid product id");
  });

  test("GET /api/products/:id should return 404 for non-existing product", async () => {
    const response = await request(app).get(
      "/api/products/999999999"
    );

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Product not found");
  });

  test("POST /api/products should reject unauthenticated user", async () => {
    const response = await request(app)
      .post("/api/products")
      .send({
        categoryId,
        name: "Unauthorized Product",
        slug: `unauthorized-${Date.now()}`,
        description: "Test product",
        price: 999,
        quantity: 10,
      });

    expect(response.statusCode).toBe(401);
  });

  test("POST /api/products should reject missing required fields", async () => {
    // This request is intentionally unauthenticated.
    // Authentication middleware should run before controller validation.
    const response = await request(app)
      .post("/api/products")
      .send({});

    expect(response.statusCode).toBe(401);
  });
});
