import { Router } from "express";
import authRoutes from "./auth.routes.js";
import postsRoutes from "./posts.routes.js";
import commentRoutes from "./comments.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/posts", postsRoutes);
router.use("/", commentRoutes);

export default router;
