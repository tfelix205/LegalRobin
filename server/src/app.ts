import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import lawyerRoutes from "./routes/lawyer.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Legal Robin API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/lawyers", lawyerRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;