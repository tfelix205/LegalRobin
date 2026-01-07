import { Router } from "express";
import { createPost, getAllPosts, getPostById } from "../controllers/post.controller.js";
import { auth } from "../middleware/auth.js";
const router = Router();
// Create a new legal post (requires authentication)
router.post("/", auth, createPost);
// Get all posts (public)
router.get("/", getAllPosts);
// Get single post with responses
router.get("/:id", getPostById);
export default router;
