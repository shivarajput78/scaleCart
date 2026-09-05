const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const {
  authenticateUser,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateUser);

router.get("/", getWishlist);

router.post("/", addToWishlist);

router.delete("/:productId", removeFromWishlist);

module.exports = router;