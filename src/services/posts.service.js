import * as PostsModel from "../models/posts.model.js";
import { AppError } from "../utils/AppError";

export async function listPosts(requestingUser) {
  if (!requestingUser) return PostsModel.findAllPublic();
  return PostsModel.findAllPublicOrOwnedBy(requestingUser.id);
}

export async function getPost(id, requestingUser) {
  const post = await PostsModel.findById(id);
  if (!post) throw new AppError("Post not found", 404);

  const isOwner = requestingUser && post.user_id === requestingUser.id;
  if (post.status === "draft" && !isOwner) {
    throw new AppError("Post not found", 404);
  }
  return post;
}

export async function createPost(data, requestingUser) {
  return PostsModel.create({ ...data, userId: requestingUser.id });
}
