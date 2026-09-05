const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateInventory,

} = require("../controllers/productController");

const {
  authenticateUser,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin only
router.post(
  "/",
  authenticateUser,
  authorize("admin"),
  createProduct
);



router.patch(
  "/:id",
  authenticateUser,
  authorize("admin"),
  updateProduct
);





router.delete(
  "/:id",
  authenticateUser,
  authorize("admin"),
  deleteProduct
);



router.put(
  "/:id/inventory",
  authenticateUser,
  authorize("admin"),
  updateInventory
);


module.exports = router;