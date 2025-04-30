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

export async function getAllOrders(status) {
  try {
    const result = await executeQuery(
      `SELECT 
        oi.id AS order_item_id, 
        o.id AS order_id, 
        o.status, 
        o.time, 
        oi.product_id, 
        oi.quantity, 
        oi.price_at_order
      FROM "Order" o
      JOIN "OrderItem" oi ON o.id = oi.order_id
      WHERE o.status = $1`,
      [status]
    );

    return result;
  } catch (err) {
    console.error("Error fetching all orders:", err);
    return [];
  }
}

export async function deliverOrderAndInsertHistory(orderId, delivererId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const updatedOrder = await client.query(`UPDATE "Order" SET status = $1 WHERE id = $2 RETURNING *`, ["delivered", orderId]);

    if (updatedOrder.rowCount === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const order = updatedOrder.rows[0];

    await client.query(`INSERT INTO "DeliverHistory" (deliverer_id, order_id, time) VALUES ($1, $2, NOW())`, [delivererId, order.id]);

    await client.query("COMMIT");
    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error delivering order:", error.message);
    throw error;
  } finally {
    client.release();
  }
}

export async function getOrderById(orderId) {
  const rows = await executeQuery(`SELECT * FROM "Order" WHERE id = $1`, [orderId]);

  return rows.length > 0 ? rows[0] : null;
}
