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

export async function getUserCart(userId) {
  if (!userId) return [];

  return executeQuery(
    `SELECT c.*, p.price, p.stock, b.name as brand_name 
    FROM "Cart" c
    JOIN "Product" p ON c.product_id = p.id
    JOIN "Brand" b ON p.id_brand = b.id
    WHERE c.customer_id = $1`,
    [userId]
  );
}

export async function getCartItem(userId, productId) {
  if (!userId || !productId) return null;

  const rows = await executeQuery(`SELECT * FROM "Cart" WHERE customer_id = $1 AND product_id = $2`, [userId, productId]);

  return rows.length > 0 ? rows[0] : null;
}

export async function insertCartItem(userId, productId, quantity) {
  const numQuantity = Number(quantity);

  const result = await executeQuery(
    `INSERT INTO "Cart" (customer_id, product_id, quantity) 
     VALUES ($1, $2, $3) RETURNING *`,
    [userId, productId, numQuantity]
  );
  return result[0];
}

export async function updateCartQuantity(userId, productId, newQuantity) {
  const numQuantity = Number(newQuantity);

  const result = await executeQuery(
    `UPDATE "Cart" SET quantity = $1 
     WHERE customer_id = $2 AND product_id = $3 RETURNING *`,
    [numQuantity, userId, productId]
  );
  return result.length > 0 ? result[0] : null;
}

export async function addOrUpdateCartItem(userId, productId, quantity) {
  const numQuantity = Number(quantity);

  const existingItem = await getCartItem(userId, productId);

  if (existingItem) {
    return updateCartQuantity(userId, productId, numQuantity);
  } else {
    return insertCartItem(userId, productId, numQuantity);
  }
}

export async function removeCartItem(userId, productId) {
  if (!userId || !productId) return false;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const deleteResult = await client.query(`DELETE FROM "Cart" WHERE customer_id = $1 AND product_id = $2 RETURNING *`, [userId, productId]);

    if (deleteResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return false;
    }

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function placeOrder(userId, items) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderResult = await client.query(
      `INSERT INTO "Order" (customer_id, status, time)
       VALUES ($1, 'pending', NOW()) RETURNING *`,
      [userId]
    );
    const newOrder = orderResult.rows[0];

    for (const item of items) {
      const { productId, quantity, priceAtOrder } = item;

      await client.query(
        `INSERT INTO "OrderItem" (order_id, product_id, quantity, price_at_order)
         VALUES ($1, $2, $3, $4)`,
        [newOrder.id, productId, quantity, priceAtOrder]
      );

      await client.query(`UPDATE "Product" SET stock = stock - $1 WHERE id = $2`, [quantity, productId]);

      await client.query(`DELETE FROM "Cart" WHERE customer_id = $1 AND product_id = $2`, [userId, productId]);
    }

    await client.query("COMMIT");
    return newOrder;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getUserOrders(userId) {
  if (!userId) return {};

  const result = await executeQuery(
    `SELECT oi.id AS order_item_id, o.id AS order_id, o.status, o.time, oi.product_id, oi.quantity, oi.price_at_order
       FROM "Order" o
       JOIN "OrderItem" oi ON o.id = oi.order_id
       WHERE o.customer_id = $1`,
    [userId]
  );

  return result.length > 0 ? result : {};
}
