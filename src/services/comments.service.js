import * as CommentsModel from "../models/comments.model.js";
import * as PostsModel from "../models/posts.model.js";
import { AppError } from "../utils/AppError.js";

export async function listComments(postId) {
  const post = await PostsModel.findById(postId);
  if (!post || post.status !== "public") {
    throw new AppError("Post not found", 404);
  }
  return CommentsModel.findAllForPost(postId);
}

export async function createComment(postId, body, requestingUser) {
  const post = await PostsModel.findById(postId);
  if (!post || post.status !== "public") {
    throw new AppError("Post not found", 404);
  }
  return CommentsModel.create({ body, postId, userId: requestingUser.id });
}

export async function deleteComment(id, requestingUser) {
  const comment = await CommentsModel.findById(id);
  if (!comment) throw new AppError("Comment not found", 404);

  const isOwner = comment.user_id === requestingUser.id;
  const isAdmin = requestingUser.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new AppError("Comment not found", 404);
  }
  await CommentsModel.remove(id);
}
