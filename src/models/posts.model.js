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

export async function update(id, changes) {
  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(changes)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }
  if (fields.length === 0) return findById(id);

  values.push(id);
  await pool.query(
    `UPDATE posts SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.query("DELETE FROM posts WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
