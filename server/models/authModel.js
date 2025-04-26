import pool from "../db.js";

export async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM "AuthedUser" WHERE email = $1', [email]);
  return rows[0];
}

export async function createUser(email, password, role) {
  const result = await pool.query('INSERT INTO "AuthedUser" (email, password, role) VALUES ($1, $2, $3) RETURNING id', [email, password, role]);
  return result.rows[0];
}

export async function deleteUser(id) {
  await pool.query('DELETE FROM "AuthedUser" WHERE id = $1', [id]);
}

export async function findUserById(id) {
  const { rows } = await pool.query('SELECT * FROM "AuthedUser" WHERE id = $1', [id]);
  return rows[0];
}
