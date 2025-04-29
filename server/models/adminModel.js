import pool from "../db.js";

export async function createProduct(brand, roomCategory, price, stock, categories) {
  try {
    const result = await pool.query(`SELECT add_product($1, $2, $3, $4, $5)`, [brand, roomCategory, price, stock, categories]);
    return result.rows[0];
  } catch (err) {
    throw new Error("Error creating product: " + err.message);
  }
}

export async function getAllOrders() {
  try {
    const result = await pool.query(
      `SELECT 
        oi.id AS order_item_id, 
        o.id AS order_id, 
        o.status, 
        o.time, 
        oi.product_id, 
        oi.quantity, 
        oi.price_at_order
      FROM "Order" o
      JOIN "OrderItem" oi ON o.id = oi.order_id`
    );
    return result.rows;
  } catch (err) {
    throw new Error("Error fetching all orders: " + err.message);
  }
}
