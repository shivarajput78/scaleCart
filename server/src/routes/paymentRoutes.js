const express = require("express");

const {
  createPayment,
  verifyPayment,
} = require("../controllers/paymentController");

const {
  authenticateUser,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateUser);

router.post("/", createPayment);

router.post("/verify", verifyPayment);

module.exports = router;