const request = require("supertest");
const app = require("../src/server");

describe("Address API", () => {
  let accessToken;
  let addressId;

  const email = `address_test_${Date.now()}@example.com`;
  const password = "Test@12345";

  beforeAll(async () => {
    // Create test user
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Address Test User",
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
  });

  test("GET /api/addresses should require authentication", async () => {
    const response = await request(app).get("/api/addresses");

    expect(response.statusCode).toBe(401);
  });

  test("GET /api/addresses should return user's addresses", async () => {
    const response = await request(app)
      .get("/api/addresses")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty("addresses");
    expect(Array.isArray(response.body.addresses)).toBe(true);
  });

  test("POST /api/addresses should reject missing required fields", async () => {
    const response = await request(app)
      .post("/api/addresses")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Required address fields are missing"
    );
  });

  test("POST /api/addresses should create an address", async () => {
    const response = await request(app)
      .post("/api/addresses")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        fullName: "Test User",
        phone: "9876543210",
        addressLine1: "123 Test Street",
        addressLine2: "Near Test Market",
        city: "Delhi",
        state: "Delhi",
        postalCode: "110001",
        country: "India",
        isDefault: true,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Address added successfully"
    );

    expect(response.body).toHaveProperty("address");
    expect(response.body.address).toHaveProperty("id");

    addressId = response.body.address.id;
  });

  test("GET /api/addresses should contain created address", async () => {
    const response = await request(app)
      .get("/api/addresses")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.addresses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: addressId,
          full_name: "Test User",
          city: "Delhi",
          state: "Delhi",
          postal_code: "110001",
          is_default: true,
        }),
      ])
    );
  });

  test("PATCH /api/addresses/:id should update address", async () => {
    const response = await request(app)
      .patch(`/api/addresses/${addressId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        city: "Noida",
        postalCode: "201301",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Address updated successfully"
    );

    expect(response.body.address.city).toBe("Noida");
    expect(response.body.address.postal_code).toBe("201301");
  });

  test("PATCH /api/addresses/:id should reject invalid id", async () => {
    const response = await request(app)
      .patch("/api/addresses/abc")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        city: "Mumbai",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid address id");
  });

  test("PATCH /api/addresses/:id should return 404 for non-existing address", async () => {
    const response = await request(app)
      .patch("/api/addresses/999999999")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        city: "Mumbai",
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Address not found");
  });

  test("DELETE /api/addresses/:id should delete address", async () => {
    const response = await request(app)
      .delete(`/api/addresses/${addressId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Address deleted successfully"
    );
  });

  test("DELETE /api/addresses/:id should return 404 after deletion", async () => {
    const response = await request(app)
      .delete(`/api/addresses/${addressId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Address not found");
  });
});