const request = require("supertest");

const app = require("../src/server");
// const pool = require("../src/config/db");

describe("Health API", () => {
  test("GET /api/health should return 200", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

//   afterAll(async () => {
//     await pool.closeDB();
//   });
});