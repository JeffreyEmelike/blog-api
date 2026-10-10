import * as PostsService from "../services/posts.service.js";

export async function list(req, res) {
  const posts = await PostsService.listPosts(req.user);
  res.json(posts);
}

export async function getOne(req, res) {
  const post = await PostsService.getPost(Number(req.params.id), req.user);
  res.json(post);
}

export async function create(req, res) {
  const post = await PostsService.createPost(req.body, req.user);
  res.status(201).json(post);
}
