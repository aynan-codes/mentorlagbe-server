import { getStripe } from "../config/stripe.js";

export const createCheckoutSession = async (user) => {
  try {
    const stripe = getStripe();

    let amount;

    if (user.role === "student") {
      amount = Number(process.env.STRIPE_STUDENT_PRO_AMOUNT || 1000);
    } else if (user.role === "tutor") {
      amount = Number(process.env.STRIPE_TUTOR_PRO_AMOUNT || 1500);
    } else {
      throw new Error("Only students and tutors can purchase Pro plans.");
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error("Invalid Stripe payment amount.");
    }

    const planPrice = user.role === "student" ? "$10" : "$15";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,

      line_items: [
        {
          price_data: {
            currency: process.env.STRIPE_CURRENCY || "usd",
            product_data: {
              name: `MentorLagbe ${user.role} Pro Plan`,
              description: `Upgrade to MentorLagbe Pro Membership - ${planPrice}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],

      metadata: {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        userRole: user.role,
        planName: "pro",
      },

      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
    });

    return session;
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    throw error;
  }
};
