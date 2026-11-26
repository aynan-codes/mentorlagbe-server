import express from "express";

import {
  createTuition,
  getAllTuitions,
  getTuitionById,
  getMyTuitions,
  updateTuition,
  deleteTuition,
  updateTuitionStatus,
} from "../controllers/tuition.controller.js";

import { verifyToken } from "../middleware/verify-token.js";
import { verifyRole } from "../middleware/verify-role.js";

const router = express.Router();

// Get All Approved Tuitions
router.get("/", getAllTuitions);

// Get Logged-in Tutor's Tuitions
router.get(
  "/my-tuitions",
  verifyToken,
  verifyRole("tutor"),
  getMyTuitions
);

// Create New Tuition
router.post(
  "/",
  verifyToken,
  verifyRole("tutor"),
  createTuition
);

// Update Tuition Status (Active / Closed)
router.patch(
  "/:id/status",
  verifyToken,
  verifyRole("tutor"),
  updateTuitionStatus
);

// Update Tuition
router.patch(
  "/:id",
  verifyToken,
  verifyRole("tutor"),
  updateTuition
);

// Delete Tuition
router.delete(
  "/:id",
  verifyToken,
  verifyRole("tutor"),
  deleteTuition
);

// Get Single Tuition
router.get("/:id", getTuitionById);

export default router;