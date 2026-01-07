import { Router } from "express";
import { applyAsLawyer, respondToPost, getLawyerProfile } from "../controllers/lawyer.controller.js";
import { auth } from "../middleware/auth.js";
const router = Router();
// Apply to become a lawyer
router.post("/apply", auth, applyAsLawyer);
// Respond to a post (lawyers only)
router.post("/respond/:postId", auth, respondToPost);
// Get lawyer profile
router.get("/profile/:userId", getLawyerProfile);
export default router;
