require("dotenv").config();

const pool = require("../src/config/db");
const { redisClient, connectRedis } = require("../src/config/redis");

beforeAll(async () => {
  await connectRedis();
});

afterAll(async () => {
  await pool.end();

  if (redisClient.isOpen) {
    await redisClient.quit();
  }
});