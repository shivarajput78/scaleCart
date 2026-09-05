const express = require("express");

const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");

const {
  authenticateUser,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  authorize("admin"),
  createCategory
);

router.get("/", getCategories);

module.exports = router;