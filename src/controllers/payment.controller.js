import { createPaymentSessionService } from "../services/payment.service.js";

// Create Pro Plan Checkout Session
export const createPaymentSession = async (req, res) => {
  try {
    const session = await createPaymentSessionService(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Checkout session created successfully.",
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error("Payment Controller Error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode || process.env.NODE_ENV === "development"
          ? error.message
          : "Unable to create payment session.",
    });
  }
};