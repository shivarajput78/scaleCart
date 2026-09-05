// const express = require("express");

// const {
//   register,
//   login,
//   refreshAccessToken,
// } = require("../controllers/authController");

// const {
//   authenticateUser,
//   authorize,
// } = require("../middleware/authMiddleware");



// const {
//   authLimiter,
// } = require("../middleware/rateLimiter");


// const router = express.Router();

// router.post("/register", authLimiter, register);

// router.post("/login", authLimiter, login);

// router.post("/refresh", authLimiter, refreshAccessToken);

// router.get("/me", authenticateUser, (req, res) => {
//   res.json({
//     success: true,
//     user: req.user,
//   });
// });

// router.get(
//   "/admin-test",
//   authenticateUser,
//   authorize("admin"),
//   (req, res) => {
//     res.json({
//       success: true,
//       message: "Welcome Admin",
//     });
//   }
// );

// module.exports = router;


const express = require("express");

const {
  register,
  login,
  refreshAccessToken,
  logout,
} = require("../controllers/authController");

const {
  authenticateUser,
  authorize,
} = require("../middleware/authMiddleware");

const {
  authLimiter,
} = require("../middleware/rateLimiter");

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  register
);

router.post(
  "/login",
  authLimiter,
  login
);

router.post(
  "/refresh",
  authLimiter,
  refreshAccessToken
);

router.post(
  "/logout",
  logout
);

router.get(
  "/me",
  authenticateUser,
  (req, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

router.get(
  "/admin-test",
  authenticateUser,
  authorize("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

module.exports = router;