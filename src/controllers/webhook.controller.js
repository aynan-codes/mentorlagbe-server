import Stripe from "stripe";
import { getDB } from "../config/db.js";

export const handleStripeWebhook = async (req, res) => {
  let insertedPaymentId = null;

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secretKey || !webhookSecret) {
      return res.status(500).json({
        success: false,
        message: "Stripe is not configured.",
      });
    }

    const stripe = new Stripe(secretKey);
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      return res.status(400).json({
        success: false,
        message: "Stripe signature is missing.",
      });
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );

    if (event.type !== "checkout.session.completed") {
      return res.status(200).json({ received: true });
    }

    const session = event.data.object;

    if (session.payment_status !== "paid") {
      return res.status(200).json({ received: true });
    }

    const db = getDB();
    const metadata = session.metadata || {};

    if (
      !metadata.userId ||
      !metadata.userEmail ||
      !["student", "tutor"].includes(metadata.userRole)
    ) {
      throw new Error("Invalid payment user information.");
    }

    // Check whether payment was already processed
    const existingPayment = await db.collection("payments").findOne({
      stripeSessionId: session.id,
    });

    if (existingPayment) {
      return res.status(200).json({ received: true });
    }

    // Find the user
    const user = await db.collection("users").findOne({
      id: metadata.userId,
      __ba_model: "user",
    });

    if (!user || user.email !== metadata.userEmail) {
      throw new Error("Payment user not found or email mismatch.");
    }

    if (user.role !== metadata.userRole) {
      throw new Error("Payment user role mismatch.");
    }

    // Insert payment record
    const paymentResult = await db.collection("payments").insertOne({
      userEmail: metadata.userEmail,
      userName: metadata.userName || "",
      userRole: metadata.userRole,
      planName: "pro",
      amount: session.amount_total,
      currency: session.currency,
      transactionId: session.payment_intent,
      stripeSessionId: session.id,
      paymentStatus: "paid",
      paidAt: new Date(),
    });

    insertedPaymentId = paymentResult.insertedId;

    // Upgrade user plan
    const updateResult = await db.collection("users").updateOne(
      {
        id: metadata.userId,
        __ba_model: "user",
        email: metadata.userEmail,
        role: metadata.userRole,
      },
      {
        $set: {
          plan: "pro",
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.matchedCount !== 1) {
      throw new Error("User Pro Plan update failed.");
    }

    return res.status(200).json({
      success: true,
      received: true,
      message: "Payment processed successfully.",
    });
  } catch (error) {
    console.error("Stripe Webhook Error:", error.message);

    // Remove incomplete payment record so Stripe can retry safely
    if (insertedPaymentId) {
      try {
        await getDB().collection("payments").deleteOne({
          _id: insertedPaymentId,
        });
      } catch (cleanupError) {
        console.error("Payment Cleanup Error:", cleanupError.message);
      }
    }

    // Duplicate webhook delivery is safe because of the unique index
    if (error.code === 11000) {
      return res.status(200).json({ received: true });
    }

    return res.status(400).json({
      success: false,
      message: "Webhook processing failed.",
    });
  }
};