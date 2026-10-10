import { Router } from "express";
import * as PostsController from "../controllers/posts.controller.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createPostsSchema } from "../validation/posts.schema.js";

const router = Router();

router.get("/", optionalAuth, PostsController.list);
router.get("/:id", optionalAuth, PostsController.getOne);
router.post(
  "/",
  requireAuth,
  validate(createPostsSchema),
  PostsController.create,
);

export default router;
