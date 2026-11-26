import { getDB } from "../config/db.js";

// Student Dashboard Statistics
export const getStudentDashboard = async (req, res) => {
  try {
    const db = getDB();
    const email = req.user.email;

    const applications = db.collection("applications");

    const [total, pending, accepted, rejected, user] =
      await Promise.all([
        applications.countDocuments({ studentEmail: email }),

        applications.countDocuments({
          studentEmail: email,
          status: "pending",
        }),

        applications.countDocuments({
          studentEmail: email,
          status: "accepted",
        }),

        applications.countDocuments({
          studentEmail: email,
          status: "rejected",
        }),

        db.collection("users").findOne({
          email,
          __ba_model: "user",
        }),
      ]);

    return res.status(200).json({
      success: true,
      statistics: {
        totalApplications: total,
        pendingApplications: pending,
        acceptedApplications: accepted,
        rejectedApplications: rejected,
        currentPlan: user?.plan || "free",
      },
    });
  } catch (error) {
    console.error("Student Dashboard Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load student dashboard.",
    });
  }
};

// Tutor Dashboard Statistics
export const getTutorDashboard = async (req, res) => {
  try {
    const db = getDB();
    const email = req.user.email;

    const [totalTuitions, approvedTuitions, applicants, user] =
      await Promise.all([
        db.collection("tuitions").countDocuments({
          tutorEmail: email,
        }),

        db.collection("tuitions").countDocuments({
          tutorEmail: email,
          approvalStatus: "approved",
          isActive: true,
        }),

        db.collection("applications").countDocuments({
          tutorEmail: email,
        }),

        db.collection("users").findOne({
          email,
          __ba_model: "user",
        }),
      ]);

    return res.status(200).json({
      success: true,
      statistics: {
        totalTuitions,
        approvedTuitions,
        totalApplicants: applicants,
        currentPlan: user?.plan || "free",
      },
    });
  } catch (error) {
    console.error("Tutor Dashboard Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load tutor dashboard.",
    });
  }
};

// Admin Dashboard Statistics
export const getAdminDashboard = async (req, res) => {
  try {
    const db = getDB();

    const [
      totalUsers,
      totalTutors,
      pendingTuitions,
      approvedTuitions,
      revenue,
    ] = await Promise.all([
      db.collection("users").countDocuments({
        __ba_model: "user",
      }),

      db.collection("users").countDocuments({
        __ba_model: "user",
        role: "tutor",
      }),

      db.collection("tuitions").countDocuments({
        approvalStatus: "pending",
      }),

      db.collection("tuitions").countDocuments({
        approvalStatus: "approved",
      }),

      db.collection("payments")
        .aggregate([
          {
            $match: {
              paymentStatus: "paid",
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$amount",
              },
            },
          },
        ])
        .toArray(),
    ]);

    return res.status(200).json({
      success: true,
      statistics: {
        totalUsers,
        totalTutors,
        pendingTuitions,
        approvedTuitions,
        totalRevenue: revenue[0]?.total || 0,
        currency: "usd",
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin dashboard.",
    });
  }
};