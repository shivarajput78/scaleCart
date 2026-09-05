const express = require("express");

const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");

const {
  authenticateUser,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateUser);

router.get("/", getAddresses);

router.post("/", addAddress);

router.patch("/:id", updateAddress);

router.delete("/:id", deleteAddress);

module.exports = router;