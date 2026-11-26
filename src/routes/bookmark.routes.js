import express from "express";

import {
  getMyBookmarks,
  addBookmark,
  removeBookmark,
} from "../controllers/bookmark.controller.js";

import { verifyToken } from "../middleware/verify-token.js";

const router = express.Router();

// Get My Bookmarks
router.get("/", verifyToken, getMyBookmarks);

// Add Bookmark
router.post("/", verifyToken, addBookmark);

// Remove Bookmark
router.delete("/:tuitionId", verifyToken, removeBookmark);

export default router;