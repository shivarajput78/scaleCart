const request = require("supertest");
const app = require("../src/server");

describe("Cart API", () => {
  let accessToken;
  let productId;

  const email = `cart_test_${Date.now()}@example.com`;
  const password = "Test@12345";

  beforeAll(async () => {
    // Create test user
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Cart Test User",
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

    // PostgreSQL BIGSERIAL is returned as a string.
    // Keep the string for response assertions.
    productId = productResponse.body.products[0].id;
  });

  test("GET /api/cart should require authentication", async () => {
    const response = await request(app).get("/api/cart");

    expect(response.statusCode).toBe(401);
  });

  test("GET /api/cart should return user's cart", async () => {
    const response = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty("cart");
    expect(response.body.cart).toHaveProperty("items");
    expect(response.body.cart).toHaveProperty("total");

    expect(Array.isArray(response.body.cart.items)).toBe(true);
  });

  test("POST /api/cart/items should add product to cart", async () => {
    const response = await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        // Controller requires productId to be an integer.
        productId: Number(productId),
        quantity: 1,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Product added to cart");
    expect(response.body.productId).toBe(Number(productId));
    expect(response.body.quantity).toBe(1);
  });

  test("GET /api/cart should contain added product", async () => {
    const response = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.cart.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          product_id: productId,
          quantity: 1,
        }),
      ])
    );
  });

  test("POST /api/cart/items should reject invalid quantity", async () => {
    const response = await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId: Number(productId),
        quantity: 0,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Quantity must be a positive integer"
    );
  });

  test("POST /api/cart/items should reject non-existing product", async () => {
    const response = await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        productId: 999999999,
        quantity: 1,
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Product not found");
  });

  test("PUT /api/cart/items/:productId should update quantity", async () => {
    const response = await request(app)
      .put(`/api/cart/items/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        quantity: 2,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Cart updated successfully");
    expect(response.body.quantity).toBe(2);
  });

  test("DELETE /api/cart/items/:productId should remove product", async () => {
    const response = await request(app)
      .delete(`/api/cart/items/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Product removed from cart"
    );
  });

  test("DELETE /api/cart/items/:productId should return 404 after removal", async () => {
    const response = await request(app)
      .delete(`/api/cart/items/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Cart item not found");
  });
});