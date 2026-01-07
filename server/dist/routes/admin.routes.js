import { Router } from "express";
import { getPendingLawyers, approveLawyer, rejectLawyer, flagPost } from "../controllers/admin.controller.js";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
const router = Router();
// All admin routes require authentication and ADMIN role
router.use(auth);
router.use(requireRole("ADMIN"));
// Get all pending lawyer applications
router.get("/lawyers/pending", getPendingLawyers);
// Approve lawyer application
router.post("/lawyers/:id/approve", approveLawyer);
// Reject lawyer application
router.post("/lawyers/:id/reject", rejectLawyer);
// Flag inappropriate post
router.post("/posts/:id/flag", flagPost);
export default router;
