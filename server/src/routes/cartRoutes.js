const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");

const {
  authenticateUser,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateUser);

router.get("/", getCart);

router.post("/items", addToCart);

router.put("/items/:productId", updateCartItem);

router.delete("/items/:productId", removeFromCart);

module.exports = router;