import { pool } from "../config/db.js";

export async function findById(id) {
  const [rows] = await pool.query("SELECT * FROM posts WHERE id = ?", [id]);
  return rows[0] ?? null;
}

export async function findAllPublic() {
  const [rows] = await pool.query(
    "SELECT * FROM posts WHERE status = 'public'",
  );
  return rows;
}

export async function findAllPublicOrOwnedBy(userId) {
  const [rows] = await pool.query(
    "SELECT * FROM posts WHERE status = 'public' OR user_id = ?",
    [userId],
  );
  return rows;
}

export async function create({ title, body, status, userId }) {
  const [result] = await pool.query(
    "INSERT INTO posts (title, body, status, user_id) VALUES (?,?,?,?)",
    [title, body, status ?? "draft", userId],
  );
  return findById(result.insertId);
}
