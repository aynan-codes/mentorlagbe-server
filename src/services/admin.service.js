import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Get All Pending Tuitions
export const getPendingTuitionsService = async () => {
  const db = getDB();

  return await db
    .collection("tuitions")
    .find({
      approvalStatus: "pending",
      isActive: true,
    })
    .sort({ createdAt: -1 })
    .toArray();
};

// Get All Tuitions
export const getAllTuitionsService = async () => {
  const db = getDB();

  return await db
    .collection("tuitions")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
};

// Approve or Reject Tuition
export const updateTuitionApprovalService = async (
  id,
  approvalStatus,
  adminEmail
) => {
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    throw createError("Invalid tuition ID.", 400);
  }

  if (!["approved", "rejected"].includes(approvalStatus)) {
    throw createError(
      "Approval status must be approved or rejected.",
      400
    );
  }

  const result = await db.collection("tuitions").updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        approvalStatus,
        reviewedAt: new Date(),
        reviewedBy: adminEmail,
      },
    }
  );

  if (result.matchedCount === 0) {
    throw createError("Tuition not found.", 404);
  }

  return true;
};

// Get All Users
export const getAllUsersService = async () => {
  const db = getDB();

  return await db
    .collection("users")
    .find(
      { __ba_model: "user" },
      {
        projection: {
          password: 0,
          __ba_model: 0,
        },
      }
    )
    .sort({ createdAt: -1 })
    .toArray();
};

// Update User Role
export const updateUserRoleService = async (
  id,
  role,
  adminId
) => {
  const db = getDB();

  if (!id || typeof id !== "string") {
    throw createError("Invalid user ID.", 400);
  }

  if (!["student", "tutor", "admin"].includes(role)) {
    throw createError(
      "Role must be student, tutor, or admin.",
      400
    );
  }

  if (adminId === id) {
    throw createError(
      "You cannot change your own admin role.",
      403
    );
  }

  const result = await db.collection("users").updateOne(
    {
      id,
      __ba_model: "user",
    },
    {
      $set: {
        role,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw createError("User not found.", 404);
  }

  return true;
};

// Get All Payment Transactions
export const getAllTransactionsService = async () => {
  const db = getDB();

  return await db
    .collection("payments")
    .find({})
    .sort({ paidAt: -1 })
    .toArray();
};