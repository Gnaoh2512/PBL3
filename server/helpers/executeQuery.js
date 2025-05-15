import pool from "../db.js";

export async function executeQuery(query, params = []) {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error(`Database error: ${error.message}`, { query, params });
    throw error;
  }
}
