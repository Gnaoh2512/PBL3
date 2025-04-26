import pool from "../db.js";

async function executeQuery(query, params = []) {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error(`Database error: ${error.message}`);
    throw error;
  }
}

export async function getPendingOrders() {
  return executeQuery('SELECT * FROM "Order" WHERE status = $1', ["pending"]);
}

export async function markOrderAsDelivered(orderId) {
  if (!orderId) return null;

  const rows = await executeQuery('UPDATE "Order" SET status = $1, delivered_at = NOW() WHERE id = $2 RETURNING *', ["delivered", orderId]);

  return rows.length > 0 ? rows[0] : null;
}

export async function getOrderById(orderId) {
  if (!orderId) return null;

  const rows = await executeQuery('SELECT * FROM "Order" WHERE id = $1', [orderId]);
  return rows.length > 0 ? rows[0] : null;
}
