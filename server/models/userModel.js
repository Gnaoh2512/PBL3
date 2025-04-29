import pool from "../db.js";

// Simple query helper function
async function executeQuery(query, params = []) {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error(`Database error: ${error.message}`);
    throw error;
  }
}

// Get the user's cart
export async function getUserCart(userId) {
  if (!userId) return [];

  return executeQuery(
    `
    SELECT c.*, p.price, p.stock, b.name as brand_name 
    FROM "Cart" c
    JOIN "Product" p ON c.product_id = p.id
    JOIN "Brand" b ON p.id_brand = b.id
    WHERE c.customer_id = $1
  `,
    [userId]
  );
}

// Check if product already exists in cart
export async function getCartItem(userId, productId) {
  if (!userId || !productId) return null;

  const rows = await executeQuery(`SELECT * FROM "Cart" WHERE customer_id = $1 AND product_id = $2`, [userId, productId]);

  return rows.length > 0 ? rows[0] : null;
}

// Add product to the user's cart
export async function addToCart(userId, productId, quantity) {
  if (!userId || !productId || !quantity) return null;

  // Check if product already in cart
  const existingItem = await getCartItem(userId, productId);

  if (existingItem) {
    // Update quantity instead of inserting new item
    const newQuantity = existingItem.quantity + quantity;

    const updated = await executeQuery(`UPDATE "Cart" SET quantity = $1 WHERE customer_id = $2 AND product_id = $3 RETURNING *`, [newQuantity, userId, productId]);

    return updated[0];
  }

  // Insert new cart item
  const result = await executeQuery(`INSERT INTO "Cart" (customer_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`, [userId, productId, quantity]);

  return result[0];
}

// Update cart item quantity
export async function updateCartQuantity(userId, productId, quantity) {
  if (!userId || !productId || !quantity) return null;

  const result = await executeQuery(`UPDATE "Cart" SET quantity = $1 WHERE customer_id = $2 AND product_id = $3 RETURNING *`, [quantity, userId, productId]);

  return result.length > 0 ? result[0] : null;
}

// Remove item from cart
export async function removeFromCart(userId, productId) {
  if (!userId || !productId) return false;

  const result = await executeQuery(`DELETE FROM "Cart" WHERE customer_id = $1 AND product_id = $2 RETURNING *`, [userId, productId]);

  return result.length > 0;
}

// Place an order
export async function placeOrder(userId, productId, amount, status = "pending") {
  if (!userId || !productId || !amount) return null;

  // Start transaction
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert the order
    const orderResult = await client.query(
      `INSERT INTO "Order" (customer_id, product_id, amount, status, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING *`,
      [userId, productId, amount, status]
    );

    const orderId = orderResult.rows[0].id;

    // Insert into OrderHistory
    await client.query(
      `INSERT INTO "OrderHistory" (customer_id, order_id, created_at) 
       VALUES ($1, $2, NOW())`,
      [userId, orderId]
    );

    // Remove item from cart if present
    await client.query(`DELETE FROM "Cart" WHERE customer_id = $1 AND product_id = $2`, [userId, productId]);

    await client.query("COMMIT");
    return orderResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction error:", error);
    throw error;
  } finally {
    client.release();
  }
}
