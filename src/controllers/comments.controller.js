import * as CommentsService from "../services/comments.service.js";

export async function list(req, res) {
  const comments = await CommentsService.listComments(
    Number(req.params.postId),
  );
  res.json(comments);
}

export async function create(req, res) {
  const comment = await CommentsService.createComment(
    Number(req.params.postId),
    req.body.body,
    req.user,
  );
  res.status(201).json(comment);
}

export async function remove(req, res) {
  await CommentsService.deleteComment(Number(req.params.id), req.user);
  res.status(204).end();
}
