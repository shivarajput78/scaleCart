const request = require("supertest");
const app = require("../src/server");

describe("Wishlist API", () => {
  let accessToken;
  let productId;

  const email = `wishlist_test_${Date.now()}@example.com`;
  const password = "Test@12345";

  beforeAll(async () => {
    // Create test user
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Wishlist Test User",
        email,
        password,
      });

    expect(registerResponse.statusCode).toBe(201);

    // Login
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password,
      });

    expect(loginResponse.statusCode).toBe(200);

    accessToken = loginResponse.body.accessToken;

    // Get an existing product
    const productResponse = await request(app)
      .get("/api/products")
      .query({
        limit: 1,
      });

    expect(productResponse.statusCode).toBe(200);
    expect(productResponse.body.products.length).toBeGreaterThan(0);

    // PostgreSQL BIGSERIAL IDs are returned as strings
    productId = productResponse.body.products[0].id;
  });

  test("GET /api/wishlist should require authentication", async () => {
    const response = await request(app).get("/api/wishlist");

    expect(response.statusCode).toBe(401);
  });

  test("GET /api/wishlist should return user's wishlist", async () => {
    const response = await request(app)
      .get("/api/wishlist")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty("wishlist");
    expect(Array.isArray(response.body.wishlist)).toBe(true);
  });

  test("POST /api/wishlist should add product", async () => {
    const response = await request(app)
      .post("/api/wishlist")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId: Number(productId),
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Product added to wishlist"
    );
    expect(response.body).toHaveProperty("wishlistId");
  });

  test("POST /api/wishlist should not duplicate product", async () => {
    const response = await request(app)
      .post("/api/wishlist")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId: Number(productId),
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Product already in wishlist"
    );
  });

  test("GET /api/wishlist should contain added product", async () => {
    const response = await request(app)
      .get("/api/wishlist")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.wishlist).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          product_id: productId,
        }),
      ])
    );
  });

  test("POST /api/wishlist should reject invalid productId", async () => {
    const response = await request(app)
      .post("/api/wishlist")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId: 0,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid productId");
  });

  test("POST /api/wishlist should reject non-existing product", async () => {
    const response = await request(app)
      .post("/api/wishlist")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId: 999999999,
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Product not found");
  });

  test("DELETE /api/wishlist/:productId should remove product", async () => {
    const response = await request(app)
      .delete(`/api/wishlist/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Product removed from wishlist"
    );
  });

  test("DELETE /api/wishlist/:productId should return 404 after removal", async () => {
    const response = await request(app)
      .delete(`/api/wishlist/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Product not found in wishlist"
    );
  });
});