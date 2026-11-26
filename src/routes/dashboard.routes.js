import express from "express";

import {
  getStudentDashboard,
  getTutorDashboard,
  getAdminDashboard,
} from "../controllers/dashboard.controller.js";

import { verifyToken } from "../middleware/verify-token.js";
import { verifyRole } from "../middleware/verify-role.js";

const router = express.Router();

// Student Dashboard
router.get(
  "/student",
  verifyToken,
  verifyRole("student"),
  getStudentDashboard
);

// Tutor Dashboard
router.get(
  "/tutor",
  verifyToken,
  verifyRole("tutor"),
  getTutorDashboard
);

// Admin Dashboard
router.get(
  "/admin",
  verifyToken,
  verifyRole("admin"),
  getAdminDashboard
);

export default router;