import express from "express";

import { createPaymentSession } from "../controllers/payment.controller.js";
import { getMyPaymentHistory } from "../controllers/payment-history.controller.js";

import { verifyToken } from "../middleware/verify-token.js";

const router = express.Router();

// Create Stripe Checkout Session
router.post(
  "/create-checkout-session",
  verifyToken,
  createPaymentSession
);

// Get My Payment History
router.get(
  "/history",
  verifyToken,
  getMyPaymentHistory
);

export default router;