import pool from "../db.js";

// Helper function for query execution
async function executeQuery(query, params = []) {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error(`Database error: ${error.message}`, { query, params });
    throw error;
  }
}

// Find user by email
export async function findUserByEmail(email) {
  if (!email) return null;

  const rows = await executeQuery('SELECT * FROM "AuthedUser" WHERE email = $1', [email]);
  return rows.length > 0 ? rows[0] : null;
}

// Create new user
export async function createUser(email, password, role) {
  if (!email || !password || !role) return null;

  const rows = await executeQuery('INSERT INTO "AuthedUser" (email, password, role) VALUES ($1, $2, $3) RETURNING *', [email, password, role]);
  return rows.length > 0 ? rows[0] : null;
}

// Delete user account
export async function deleteUser(id) {
  if (!id) return false;

  const rows = await executeQuery('DELETE FROM "AuthedUser" WHERE id = $1 RETURNING id', [id]);
  return rows.length > 0;
}

// Find user by ID
export async function findUserById(id) {
  if (!id) return null;

  const rows = await executeQuery('SELECT * FROM "AuthedUser" WHERE id = $1', [id]);
  return rows.length > 0 ? rows[0] : null;
}

// Update user information
export async function updateUser(id, userData) {
  if (!id || !userData) return null;

  // Create SET clause and values array
  const fields = Object.keys(userData);
  const values = Object.values(userData);

  if (fields.length === 0) return null;

  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(", ");

  const rows = await executeQuery(`UPDATE "AuthedUser" SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`, [id, ...values]);

  return rows.length > 0 ? rows[0] : null;
}

// Check if email exists
export async function emailExists(email) {
  if (!email) return false;

  const rows = await executeQuery('SELECT COUNT(*) as count FROM "AuthedUser" WHERE email = $1', [email]);

  return rows[0].count > 0;
}
