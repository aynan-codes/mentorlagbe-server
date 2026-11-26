import { getMyPaymentHistoryService } from "../services/payment.service.js";

// Get Logged-in User's Payment History
export const getMyPaymentHistory = async (req, res) => {
  try {
    const payments = await getMyPaymentHistoryService(req.user.email);

    return res.status(200).json({
      success: true,
      totalPayments: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Payment History Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve payment history.",
    });
  }
};
