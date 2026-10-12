import { Router } from "express";
import * as CommentsController from "../controllers/comments.controller.js";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate.js";
import { createCommentSchema } from "../validation/comments.schema.js";

const router = Router();

router.get("/posts/:postId/comments", CommentsController.list);
router.post(
  "/posts/:postId/comments",
  requireAuth,
  validate(createCommentSchema),
  CommentsController.create,
);
router.delete("/comments/:id", requireAuth, CommentsController.remove);

export default router;
