import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  completeGoogleOnboarding,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middleware/verify-token.js";

const router = express.Router();

// Get logged-in user profile
router.get("/me", verifyToken, getMyProfile);

// Update logged-in user profile
router.patch("/me", verifyToken, updateMyProfile);

// Complete Google OAuth onboarding
router.patch(
  "/complete-onboarding",
  verifyToken,
  completeGoogleOnboarding
);

export default router;