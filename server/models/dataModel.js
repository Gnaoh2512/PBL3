import pool from "../db.js";

// Helper function for executing queries with error handling
async function executeQuery(query, params = []) {
  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error(`Database error: ${error.message}`, { query, params });
    throw error;
  }
}

// Get category names from the database
export async function getCategoryNames() {
  const rows = await executeQuery('SELECT name FROM "Category"');
  return rows.map((row) => row.name);
}

// Get room ID by name
export async function getRoomIdByName(roomName) {
  if (!roomName) return null;

  const rows = await executeQuery('SELECT id FROM "Room" WHERE LOWER(name) = LOWER($1)', [roomName]);
  return rows.length > 0 ? rows[0].id : null;
}

// Get categories associated with a room
export async function getRoomCategories(roomId) {
  if (!roomId) return [];

  const rows = await executeQuery('SELECT id, name FROM "RoomCategory" WHERE id_room = $1', [roomId]);
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
  }));
}

// Get room category ID by name
export async function getRoomCategoryByName(roomCategory) {
  if (!roomCategory) return null;

  const rows = await executeQuery('SELECT id FROM "RoomCategory" WHERE LOWER(name) = LOWER($1)', [roomCategory]);
  return rows.length > 0 ? rows[0].id : null;
}

// Get products by category
export async function getProductsByCategory(roomCategoryId) {
  if (!roomCategoryId) return [];

  return executeQuery(
    `SELECT p.id, p.price, p.stock, b.name AS brand
     FROM "Product" p
     JOIN "Brand" b ON p.id_brand = b.id
     WHERE p."id_roomCategory" = $1`,
    [roomCategoryId]
  );
}

// Get categories for multiple products
export async function getProductCategories(productIds) {
  if (!productIds || productIds.length === 0) return {};

  const rows = await executeQuery(
    `SELECT pc.id_product, c.name AS category
     FROM "ProductCategory" pc
     JOIN "Category" c ON pc.id_category = c.id
     WHERE pc.id_product = ANY($1)`,
    [productIds]
  );

  // Group categories by product ID
  const categoryMap = {};
  rows.forEach(({ id_product, category }) => {
    if (!categoryMap[id_product]) {
      categoryMap[id_product] = [];
    }
    categoryMap[id_product].push(category);
  });

  return categoryMap;
}

// Get product by ID
export async function getProductById(productId) {
  if (!productId) return null;

  const rows = await executeQuery(
    `SELECT p.id, p.price, p.stock, p."id_roomCategory", b.name AS brand
     FROM "Product" p
     JOIN "Brand" b ON p.id_brand = b.id
     WHERE p.id = $1`,
    [productId]
  );

  return rows.length > 0 ? rows[0] : null;
}

// Get all products
export async function getAllProducts() {
  return executeQuery('SELECT * FROM "Product"');
}

// Get brands for multiple products
export async function getProductBrands(productIds) {
  if (!productIds || productIds.length === 0) return {};

  try {
    // Direct database query to get brand information
    const rows = await executeQuery(
      `SELECT p.id AS product_id, b.name AS brand_name
       FROM "Product" p
       JOIN "Brand" b ON p.id_brand = b.id
       WHERE p.id = ANY($1)`,
      [productIds]
    );

    // Create a map of product IDs to brand names
    const brandsMap = {};
    rows.forEach((row) => {
      brandsMap[row.product_id] = row.brand_name;
    });

    return brandsMap;
  } catch (err) {
    console.error("Error fetching brands:", err);
    return {}; // Return empty map on error
  }
}
