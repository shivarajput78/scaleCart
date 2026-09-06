require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const cartRoutes = require("./routes/cartRoutes");

const wishlistRoutes = require("./routes/wishlistRoutes");

const addressRoutes = require("./routes/addressRoutes");

const orderRoutes = require("./routes/orderRoutes");

const paymentRoutes = require("./routes/paymentRoutes");


const webhookRoutes = require("./routes/webhookRoutes");



const { connectRedis } = require("./config/redis");

const { apiLimiter } = require("./middleware/rateLimiter");







const http = require("http");

const { setIO } = require("./socket");

const { Server } = require("socket.io");

const app = express();



const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});



setIO(io);


io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-order", (orderId) => {
    socket.join(`order:${orderId}`);
    console.log(
      `Socket ${socket.id} joined order:${orderId}`
    );
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.use(cors());



app.use("/api", apiLimiter);



/*
 * Webhook FIRST
 * because it needs raw body.
 */
app.use("/api/webhooks", webhookRoutes);

/*
 * Normal JSON APIs
 */


app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/addresses", addressRoutes);


app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "ScaleCart API is running",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});










app.get("/api/redis-health", async (req, res) => {
  try {
    const { redisClient } = require("./config/redis");

    const result = await redisClient.ping();

    res.json({
      success: true,
      redis: result,
    });
  } catch (error) {
    console.error("Redis health error:", error);

    res.status(500).json({
      success: false,
      message: "Redis is not available",
    });
  }
});






const PORT = process.env.PORT || 5000;





async function startServer() {
  try {
    await connectRedis();

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;





// httpServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// async function startServer() {
//   try {
//     await connectRedis();

//     httpServer.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   }
// }

// startServer();
