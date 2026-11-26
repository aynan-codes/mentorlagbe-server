import { getDB } from "../config/db.js";
import { createCheckoutSession } from "./stripe.service.js";

// Create Pro Plan Payment Service
export const createPaymentSessionService = async (userId) => {
  const db = getDB();

  const user = await db.collection("users").findOne({
    id: userId,
    __ba_model: "user",
  });

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  if (user.plan === "pro") {
    const error = new Error("You are already a Pro member.");
    error.statusCode = 400;
    throw error;
  }

  const session = await createCheckoutSession(user);

  return session;
};

// Get User Payment History Service
export const getMyPaymentHistoryService = async (userEmail) => {
  const db = getDB();

  const payments = await db
    .collection("payments")
    .find({ userEmail })
    .sort({ paidAt: -1 })
    .toArray();

  return payments;
};
