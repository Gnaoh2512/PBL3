import pool from "../db.js";

// Get the user's cart
export async function getUserCart(userId) {
  const result = await pool.query(`SELECT * FROM "Cart" WHERE "customer_id" = $1`, [userId]);
  return result.rows;
}

// Add product to the user's cart
export async function addToCart(userId, productId, quantity) {
  const result = await pool.query(`INSERT INTO "Cart" ("customer_id", "product_id", quantity) VALUES ($1, $2, $3) RETURNING *`, [userId, productId, quantity]);
  return result.rows[0];
}

// Place an order
export async function placeOrder(userId, productId, amount, status) {
  // Insert the order
  const orderResult = await pool.query(`INSERT INTO "Order" ("customer_id", "product_id", amount, status) VALUES ($1, $2, $3, $4) RETURNING *`, [userId, productId, amount, status]);

  const orderId = orderResult.rows[0].id;

  // Insert into OrderHistory
  await pool.query(`INSERT INTO "OrderHistory" ("customer_id", "order_id") VALUES ($1, $2)`, [userId, orderId]);

  return orderResult.rows[0]; // Return the order
}
