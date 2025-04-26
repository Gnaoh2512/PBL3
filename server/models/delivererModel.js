import pool from "../db.js";

// Get all pending orders for the deliverer
export async function getPendingOrders() {
  const result = await pool.query('SELECT * FROM "Order" WHERE status = $1', ["pending"]);
  return result.rows;
}

// Mark an order as delivered
export async function markOrderAsDelivered(orderId) {
  const result = await pool.query('UPDATE "Order" SET status = $1 WHERE id = $2 RETURNING *', ["delivered", orderId]);

  return result.rows.length > 0 ? result.rows[0] : null; // If the order is not found, return null
}
