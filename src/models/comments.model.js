import { pool } from "../config/db.js";

export async function findById(id) {
  const [rows] = await pool.query("SELECT * FROM comments WHERE id = ?", [id]);
  return rows[0] ?? null;
}

export async function findAllForPost(postId) {
  const [rows] = await pool.query("SELECT * FROM comments WHERE post_id = ?", [
    postId,
  ]);
  return rows;
}

export async function create({ body, postId, userId }) {
  const [result] = await pool.query(
    "INSERT INTO comments(body, post_id, user_id) VALUES(?, ?, ?)",
    [body, postId, userId],
  );
  return findById(result.insertId);
}

export async function remove(id) {
  const [result] = await pool.query("DELETE FROM comments WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
