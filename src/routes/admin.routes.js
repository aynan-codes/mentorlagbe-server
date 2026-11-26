import express from "express";

import {
  getPendingTuitions,
  getAllTuitions,
  updateTuitionApproval,
  getAllUsers,
  updateUserRole,
  getAllTransactions,
} from "../controllers/admin.controller.js";

import { verifyToken } from "../middleware/verify-token.js";
import { verifyRole } from "../middleware/verify-role.js";

const router = express.Router();

// All routes are Admin Only
router.use(verifyToken, verifyRole("admin"));

// Get All Pending Tuitions
router.get("/tuitions/pending", getPendingTuitions);

// Get All Tuitions
router.get("/tuitions", getAllTuitions);

// Approve or Reject Tuition
router.patch("/tuitions/:id/approval", updateTuitionApproval);

// Get All Users
router.get("/users", getAllUsers);

// Update User Role
router.patch("/users/:id/role", updateUserRole);

// Get All Payment Transactions
router.get("/transactions", getAllTransactions);

export default router;