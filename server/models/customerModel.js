import pool from "../db.js";

// Helper function for executing queries with error handling
export async function executeQuery(query, params = []) {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error(`Database error: ${error.message}`, { query, params });
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

// Insert new cart item
export async function insertCartItem(userId, productId, quantity) {
  // Ensure quantity is a number
  const numQuantity = Number(quantity);

  const result = await executeQuery(
    `INSERT INTO "Cart" (customer_id, product_id, quantity) 
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, productId, numQuantity]
  );
  return result[0];
}

// Update cart item quantity
export async function updateCartQuantity(userId, productId, newQuantity) {
  // Ensure quantity is a number
  const numQuantity = Number(newQuantity);

  const result = await executeQuery(
    `UPDATE "Cart" SET quantity = $1 
     WHERE customer_id = $2 AND product_id = $3 RETURNING *`,
    [numQuantity, userId, productId]
  );
  return result.length > 0 ? result[0] : null;
}

// Add or update cart item
export async function addOrUpdateCartItem(userId, productId, quantity) {
  // Ensure quantity is a number
  const numQuantity = Number(quantity);

  // Check if the item already exists in the cart
  const existingItem = await getCartItem(userId, productId);

  if (existingItem) {
    // Update with the new quantity (replace, not add)
    return updateCartQuantity(userId, productId, numQuantity);
  } else {
    // Insert new item
    return insertCartItem(userId, productId, numQuantity);
  }
}

// Remove item from cart
export async function removeCartItem(userId, productId) {
  if (!userId || !productId) return false;

  // Get the quantity of the item to be removed from the cart
  const cartItem = await executeQuery(`SELECT quantity FROM "Cart" WHERE customer_id = $1 AND product_id = $2`, [userId, productId]);

  if (cartItem.length === 0) {
    return false; // Item not found in cart
  }

  const quantityToRemove = Number(cartItem[0].quantity);

  // Start a transaction to ensure both actions are atomic
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Delete the cart item
    const deleteResult = await client.query(`DELETE FROM "Cart" WHERE customer_id = $1 AND product_id = $2 RETURNING *`, [userId, productId]);

    if (deleteResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return false; // Item was not found in the cart
    }

    // Update the stock for the product
    await client.query(`UPDATE "Product" SET stock = stock + $1 WHERE id = $2`, [quantityToRemove, productId]);

    await client.query("COMMIT");
    return true; // Successfully removed the item and updated stock
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error removing item from cart:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Place an order
export async function placeOrderQuery(userId, items) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Insert into "Order" first (one order per user per checkout)
    const orderResult = await client.query(
      `INSERT INTO "Order" (customer_id, status, time)
       VALUES ($1, 'pending', NOW()) RETURNING *`,
      [userId]
    );
    const newOrder = orderResult.rows[0];

    // 2. Insert each item into "OrderItem"
    for (const item of items) {
      const { productId, quantity, priceAtOrder } = item;

      await client.query(
        `INSERT INTO "OrderItem" (order_id, product_id, quantity, price_at_order)
         VALUES ($1, $2, $3, $4)`,
        [newOrder.id, productId, quantity, priceAtOrder]
      );

      // 3. Delete from "Cart"
      await client.query(`DELETE FROM "Cart" WHERE customer_id = $1 AND product_id = $2`, [userId, productId]);
    }

    await client.query("COMMIT");
    return newOrder;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error placing order:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserOrders(userId) {
  // If userId is not provided, return an empty object
  if (!userId) return {};

  try {
    // Execute the SQL query to fetch the order items
    const result = await executeQuery(
      `SELECT oi.id AS order_item_id, o.id AS order_id, o.status, o.time, oi.product_id, oi.quantity, oi.price_at_order
       FROM "Order" o
       JOIN "OrderItem" oi ON o.id = oi.order_id
       WHERE o.customer_id = $1`,
      [userId]
    );

    // Check if the result is valid
    if (!result) {
      console.error("Error: result is undefined.");
      return {};
    }

    // Return the raw result directly
    return result;
  } catch (err) {
    // Log any errors and return an empty object in case of failure
    console.error("Error fetching orders:", err);
    return {};
  }
}
