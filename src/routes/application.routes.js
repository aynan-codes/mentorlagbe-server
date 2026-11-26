import express from "express";

import {
  createApplication,
  getMyApplications,
  getTutorApplications,
  updateApplicationStatus,
  cancelApplication,
} from "../controllers/application.controller.js";

import { verifyToken } from "../middleware/verify-token.js";
import { verifyRole } from "../middleware/verify-role.js";

const router = express.Router();

// Student Applies for a Tuition
router.post(
  "/",
  verifyToken,
  verifyRole("student"),
  createApplication
);

// Student Views Own Applications
router.get(
  "/my-applications",
  verifyToken,
  verifyRole("student"),
  getMyApplications
);

// Student Cancels Pending Application
router.delete(
  "/:id",
  verifyToken,
  verifyRole("student"),
  cancelApplication
);

// Tutor Views Applicants
router.get(
  "/tutor-applications",
  verifyToken,
  verifyRole("tutor"),
  getTutorApplications
);

// Tutor Accepts or Rejects Application
router.patch(
  "/:id/status",
  verifyToken,
  verifyRole("tutor"),
  updateApplicationStatus
);

export default router;