import { pool } from "../config/db.js";

export async function findByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0] ?? null;
}

export async function create({ name, email, passwordHash }) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?,?,?)",
    [name, email, passwordHash],
  );
  return { id: result.insertId, name, email, role: "user" };
}
