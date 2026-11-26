import "dotenv/config";

import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import { connectDB } from "./config/db.js";
import { createIndexes } from "./config/indexes.js";
import { auth } from "./config/auth.js";

import { verifyToken } from "./middleware/verify-token.js";
import errorMiddleware from "./middleware/error.middleware.js";

import userRoutes from "./routes/user.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import tuitionRoutes from "./routes/tuition.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import imageRoutes from "./routes/image.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";


const app = express();

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Better Auth Route
app.all("/api/auth/*splat", toNodeHandler(auth));

// Stripe Webhook Route (must be before express.json)
app.use("/api/webhooks/stripe", webhookRoutes);

// JSON Middleware
app.use(express.json());

// User Routes
app.use("/api/users", userRoutes);

// Bookmark Routes
app.use("/api/bookmarks", bookmarkRoutes);

// Dashboard Routes
app.use("/api/dashboard", dashboardRoutes);

// Tuition Routes
app.use("/api/tuitions", tuitionRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes);

// Application Routes
app.use("/api/applications", applicationRoutes);

// Image Upload Routes
app.use("/api/images", imageRoutes);

// Payment Routes
app.use("/api/payments", paymentRoutes);

// Server Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MentorLagbe Server is Running!",
  });
});

// JWT Protected API
app.get("/api/protected", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "JWT Authentication Successful!",
    user: req.user,
  });
});

// Global Error Middleware
app.use(errorMiddleware);

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    await createIndexes();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server Startup Failed:", error.message);
    process.exit(1);
  }
};

startServer();