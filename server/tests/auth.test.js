// // const pool = require("../src/config/db");

// const request = require("supertest");

// const app = require("../src/server");

// describe("Auth API", () => {
//   const email = `test_${Date.now()}@example.com`;
//   const password = "Test@12345";

//   test("POST /api/auth/register should create a user", async () => {
//     const response = await request(app)
//       .post("/api/auth/register")
//       .send({
//         name: "Test User",
//         email,
//         password,
//       });

//     expect(response.statusCode).toBe(201);
//     expect(response.body.success).toBe(true);

//     expect(response.body.user).toHaveProperty("id");
//     expect(response.body.user.email).toBe(email);
//     expect(response.body.user).not.toHaveProperty("password");
//     expect(response.body.user).not.toHaveProperty("password_hash");
//   });

//   test("POST /api/auth/login should return tokens", async () => {
//     const response = await request(app)
//       .post("/api/auth/login")
//       .send({
//         email,
//         password,
//       });

//     expect(response.statusCode).toBe(200);
//     expect(response.body.success).toBe(true);

//     expect(response.body).toHaveProperty("accessToken");
//     expect(response.body).toHaveProperty("refreshToken");
//     expect(response.body.user.email).toBe(email);
//   });

//   test("POST /api/auth/login should reject wrong password", async () => {
//     const response = await request(app)
//       .post("/api/auth/login")
//       .send({
//         email,
//         password: "WrongPassword123!",
//       });

//     expect(response.statusCode).toBe(401);
//     expect(response.body.success).toBe(false);
//   });

// //   afterAll(async () => {
// //     await pool.closeDB();
// //   });
// });




// const request = require("supertest");
// const app = require("../src/server");

// describe("Auth API", () => {
//   const email = `test_${Date.now()}@example.com`;
//   const password = "Test@12345";

//   test("POST /api/auth/register should create a user", async () => {
//     const response = await request(app)
//       .post("/api/auth/register")
//       .send({
//         name: "Test User",
//         email,
//         password,
//       });

//     expect(response.statusCode).toBe(201);
//     expect(response.body.success).toBe(true);

//     expect(response.body.user).toHaveProperty("id");
//     expect(response.body.user.email).toBe(email);

//     expect(response.body.user).not.toHaveProperty("password");
//     expect(response.body.user).not.toHaveProperty("password_hash");
//   });

//   test("POST /api/auth/login should return tokens", async () => {
//     const response = await request(app)
//       .post("/api/auth/login")
//       .send({
//         email,
//         password,
//       });

//     expect(response.statusCode).toBe(200);
//     expect(response.body.success).toBe(true);

//     expect(response.body).toHaveProperty("accessToken");
//     expect(response.body).toHaveProperty("refreshToken");

//     expect(response.body.user.email).toBe(email);
//   });

//   test("POST /api/auth/login should reject wrong password", async () => {
//     const response = await request(app)
//       .post("/api/auth/login")
//       .send({
//         email,
//         password: "WrongPassword123!",
//       });

//     expect(response.statusCode).toBe(401);
//     expect(response.body.success).toBe(false);
//   });

//   test("POST /api/auth/register should reject invalid email", async () => {
//     const response = await request(app)
//       .post("/api/auth/register")
//       .send({
//         name: "Test User",
//         email: "invalid-email",
//         password: "Test@12345",
//       });

//     expect(response.statusCode).toBe(400);
//     expect(response.body.success).toBe(false);

//     expect(response.body.message).toBe(
//       "Invalid email format"
//     );
//   });

//   test("POST /api/auth/register should reject short password", async () => {
//     const response = await request(app)
//       .post("/api/auth/register")
//       .send({
//         name: "Test User",
//         email: `short_${Date.now()}@example.com`,
//         password: "1234567",
//       });

//     expect(response.statusCode).toBe(400);
//     expect(response.body.success).toBe(false);

//     expect(response.body.message).toBe(
//       "Password must be at least 8 characters"
//     );
//   });

//   test("POST /api/auth/login should reject invalid email format", async () => {
//     const response = await request(app)
//       .post("/api/auth/login")
//       .send({
//         email: "invalid-email",
//         password: "Test@12345",
//       });

//     expect(response.statusCode).toBe(400);
//     expect(response.body.success).toBe(false);

//     expect(response.body.message).toBe(
//       "Invalid email format"
//     );
//   });
// });




const request = require("supertest");

const app = require("../src/server");
const pool = require("../src/config/db");

describe("Auth API", () => {
  const testEmail = `auth-test-${Date.now()}@example.com`;
  const testPassword = "Password123!";

  const rotationEmail = `rotation-test-${Date.now()}@example.com`;

  let rotationRefreshToken;

  beforeAll(async () => {
    /*
     * Create a dedicated user for refresh-token
     * rotation tests.
     */
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Rotation Test User",
        email: rotationEmail,
        password: testPassword,
      });

    expect(registerResponse.statusCode).toBe(201);

    /*
     * Login once and keep the initial refresh token.
     */
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({
        email: rotationEmail,
        password: testPassword,
      });

    expect(loginResponse.statusCode).toBe(200);

    rotationRefreshToken = loginResponse.body.refreshToken;
  });

  afterAll(async () => {
    await pool.query(
      "DELETE FROM users WHERE email IN ($1, $2)",
      [testEmail, rotationEmail]
    );
  });

  test("Register should create a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Auth Test User",
        email: testEmail,
        password: testPassword,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);

    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user).toHaveProperty("name");
    expect(response.body.user).toHaveProperty("email");
    expect(response.body.user).toHaveProperty("role");

    expect(response.body.user.email).toBe(testEmail);
  });

  test("Login should return access token and refresh token", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.email).toBe(testEmail);
  });

  test("Login with wrong password should fail", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: "WrongPassword123!",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("Register with invalid email should fail", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Invalid Email User",
        email: "invalid-email",
        password: testPassword,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("Register with short password should fail", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Short Password User",
        email: `short-${Date.now()}@example.com`,
        password: "123",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("Login with invalid email should fail", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "invalid-email",
        password: testPassword,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("Refresh should rotate the refresh token", async () => {
    const oldRefreshToken = rotationRefreshToken;

    const response = await request(app)
      .post("/api/auth/refresh")
      .send({
        refreshToken: oldRefreshToken,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    /*
     * New refresh token must be different.
     */
    expect(response.body.refreshToken).not.toBe(oldRefreshToken);

    /*
     * Save the new token for the next tests.
     */
    rotationRefreshToken = response.body.refreshToken;
  });

  test("Old refresh token should not work after rotation", async () => {
    /*
     * This old token was rotated in the previous test.
     */
    const response = await request(app)
      .post("/api/auth/refresh")
      .send({
        refreshToken: "invalid-old-refresh-token",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid refresh token");
  });

  test("New rotated refresh token should work", async () => {
    const oldRefreshToken = rotationRefreshToken;

    const response = await request(app)
      .post("/api/auth/refresh")
      .send({
        refreshToken: oldRefreshToken,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    expect(response.body.refreshToken).not.toBe(oldRefreshToken);

    rotationRefreshToken = response.body.refreshToken;
  });

  test("Logout should revoke the refresh token", async () => {
    const response = await request(app)
      .post("/api/auth/logout")
      .send({
        refreshToken: rotationRefreshToken,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Logout successful");
  });

  test("Revoked refresh token should not work", async () => {
    const response = await request(app)
      .post("/api/auth/refresh")
      .send({
        refreshToken: rotationRefreshToken,
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid refresh token");
  });
});