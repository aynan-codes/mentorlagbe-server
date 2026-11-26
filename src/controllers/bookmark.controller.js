import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

// Get My Bookmarks
export const getMyBookmarks = async (req, res) => {
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

    const savedTuitions = user.savedTuitions || [];

    const tuitionIds = savedTuitions
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    const tuitions = await db.collection("tuitions")
      .find({
        _id: { $in: tuitionIds },
        approvalStatus: "approved",
        isActive: true,
      })
      .toArray();

    return res.status(200).json({
      success: true,
      total: tuitions.length,
      tuitions,
    });
  } catch (error) {
    console.error("Get Bookmarks Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve bookmarks.",
    });
  }
};

// Add Bookmark
export const addBookmark = async (req, res) => {
  try {
    const db = getDB();
    const { tuitionId } = req.body;

    if (!tuitionId || !ObjectId.isValid(tuitionId)) {
      return res.status(400).json({
        success: false,
        message: "Valid tuition ID is required.",
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

    const tuition = await db.collection("tuitions").findOne({
      _id: new ObjectId(tuitionId),
      approvalStatus: "approved",
      isActive: true,
    });

    if (!tuition) {
      return res.status(404).json({
        success: false,
        message: "Tuition not found or unavailable.",
      });
    }

    const savedTuitions = user.savedTuitions || [];

    if (savedTuitions.includes(tuitionId)) {
      return res.status(409).json({
        success: false,
        message: "Tuition is already bookmarked.",
      });
    }

    if (user.plan !== "pro" && savedTuitions.length >= 5) {
      return res.status(403).json({
        success: false,
        message:
          "Free plan allows only 5 bookmarks. Upgrade to Pro for unlimited bookmarks.",
        plan: "free",
        limit: 5,
      });
    }

    await db.collection("users").updateOne(
      {
        id: req.user.id,
        __ba_model: "user",
      },
      {
        $addToSet: {
          savedTuitions: tuitionId,
        },
        $set: {
          updatedAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Tuition bookmarked successfully.",
    });
  } catch (error) {
    console.error("Add Bookmark Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to bookmark tuition.",
    });
  }
};

// Remove Bookmark
export const removeBookmark = async (req, res) => {
  try {
    const db = getDB();
    const { tuitionId } = req.params;

    if (!tuitionId || !ObjectId.isValid(tuitionId)) {
      return res.status(400).json({
        success: false,
        message: "Valid tuition ID is required.",
      });
    }

    const result = await db.collection("users").updateOne(
      {
        id: req.user.id,
        __ba_model: "user",
      },
      {
        $pull: {
          savedTuitions: tuitionId,
        },
        $set: {
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bookmark removed successfully.",
    });
  } catch (error) {
    console.error("Remove Bookmark Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to remove bookmark.",
    });
  }
};