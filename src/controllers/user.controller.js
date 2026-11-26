import { getDB } from "../config/db.js";

const BANGLADESH_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

// Get Logged-in User Profile
export const getMyProfile = async (req, res) => {
  try {
    const db = getDB();

    const user = await db.collection("users").findOne({
      id: req.user.id,
      __ba_model: "user",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const { password, _id, __ba_model, ...profile } = user;

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully.",
      user: profile,
    });
  } catch (error) {
    console.error("Get Profile Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve profile.",
    });
  }
};

// Update Logged-in User Profile
export const updateMyProfile = async (req, res) => {
  try {
    const db = getDB();

    const { name, phone, bio, image, division } = req.body;

    const updateData = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Valid name is required.",
        });
      }

      updateData.name = name.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== "string") {
        return res.status(400).json({
          success: false,
          message: "Phone must be a string.",
        });
      }

      updateData.phone = phone.trim();
    }

    if (bio !== undefined) {
      if (typeof bio !== "string") {
        return res.status(400).json({
          success: false,
          message: "Bio must be a string.",
        });
      }

      updateData.bio = bio.trim();
    }

    if (image !== undefined) {
      if (typeof image !== "string" || !image.trim()) {
        return res.status(400).json({
          success: false,
          message: "Valid image URL is required.",
        });
      }

      updateData.image = image.trim();
    }

    // Validate Bangladesh Division
    if (division !== undefined) {
      if (
        typeof division !== "string" ||
        !BANGLADESH_DIVISIONS.includes(division)
      ) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid Bangladesh division.",
        });
      }

      updateData.division = division;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update.",
      });
    }

    updateData.updatedAt = new Date();

    const result = await db.collection("users").updateOne(
      {
        id: req.user.id,
        __ba_model: "user",
      },
      {
        $set: updateData,
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const updatedUser = await db.collection("users").findOne({
      id: req.user.id,
      __ba_model: "user",
    });

    const { password, _id, __ba_model, ...profile } = updatedUser;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: profile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

// Complete Google OAuth Onboarding
export const completeGoogleOnboarding = async (req, res) => {
  try {
    const db = getDB();

    const { role, division } = req.body;

    // Validate role
    if (!["student", "tutor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Please select Student or Tutor.",
      });
    }

    // Validate division
    if (!BANGLADESH_DIVISIONS.includes(division)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid division.",
      });
    }

    // Verify Google account
    const googleAccount = await db.collection("users").findOne({
      __ba_model: "account",
      userId: req.user.id,
      providerId: "google",
    });

    if (!googleAccount) {
      return res.status(403).json({
        success: false,
        message: "Google authentication is required.",
      });
    }

    // Update only incomplete Student/Tutor accounts
    const result = await db.collection("users").updateOne(
      {
        id: req.user.id,
        __ba_model: "user",
        role: { $in: ["student", "tutor"] },
        onboardingCompleted: { $ne: true },
        $or: [
          { division: { $exists: false } },
          { division: null },
          { division: "" },
        ],
      },
      {
        $set: {
          role,
          division,
          onboardingCompleted: true,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(409).json({
        success: false,
        message: "Onboarding is already completed or unavailable.",
      });
    }

    const user = await db.collection("users").findOne({
      id: req.user.id,
      __ba_model: "user",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Google account setup completed successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        division: user.division,
        plan: user.plan,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Google Onboarding Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to complete account setup.",
    });
  }
};