const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  authenticateUser,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateUser);





router.post("/", createOrder);

router.get("/", getMyOrders);



// Admin
router.get(
  "/admin/all",
  authorize("admin"),
  getAllOrders
);

router.patch(
  "/admin/:id/status",
  authorize("admin"),
  updateOrderStatus
);

router.get("/:id", getOrderById);

router.patch("/:id/cancel", cancelOrder);


module.exports = router;