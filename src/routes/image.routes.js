import express from "express";
import { uploadImage } from "../controllers/image.controller.js";
import upload from "../middleware/upload.middleware.js";
import { verifyToken } from "../middleware/verify-token.js";

const router = express.Router();

router.post(
  "/upload",
  verifyToken,
  upload.single("image"),
  uploadImage
);

export default router;