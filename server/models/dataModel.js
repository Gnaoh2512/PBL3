import pool from "../db.js";

// Get category names from the database
export async function getCategoryNames() {
  const result = await pool.query('SELECT name FROM "Category"');
  return result.rows.map((row) => row.name);
}

// Get room ID by name
export async function getRoomIdByName(roomName) {
  const result = await pool.query('SELECT id FROM "Room" WHERE LOWER(name) = LOWER($1)', [roomName]);
  return result.rows.length > 0 ? result.rows[0].id : null;
}

// Get categories associated with a room
export async function getRoomCategories(roomId) {
  const result = await pool.query('SELECT id, name FROM "RoomCategory" WHERE id_room = $1', [roomId]);
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
  }));
}

// Get room category ID by name
export async function getRoomCategoryByName(roomCategory) {
  const result = await pool.query('SELECT id FROM "RoomCategory" WHERE LOWER(name) = LOWER($1)', [roomCategory]);
  return result.rows.length > 0 ? result.rows[0].id : null;
}

export async function getProductsByCategory(roomCategoryId) {
  const result = await pool.query(
    `SELECT p.id, p.price, p.stock, b.name AS brand
     FROM "Product" p
     JOIN "Brand" b ON p.id_brand = b.id
     WHERE p."id_roomCategory" = $1`,
    [roomCategoryId]
  );
  return result.rows;
}

export async function getProductCategories(productIds) {
  const result = await pool.query(
    `SELECT pc.id_product, c.name AS category
     FROM "ProductCategory" pc
     JOIN "Category" c ON pc.id_category = c.id
     WHERE pc.id_product = ANY($1)`,
    [productIds]
  );

  const categoryMap = {};
  result.rows.forEach(({ id_product, category }) => {
    if (!categoryMap[id_product]) {
      categoryMap[id_product] = [];
    }
    categoryMap[id_product].push(category);
  });

  return categoryMap;
}

export async function getProductById(productId) {
  const result = await pool.query(
    `SELECT p.id, p.price, p.stock, p."id_roomCategory", b.name AS brand
     FROM "Product" p
     JOIN "Brand" b ON p.id_brand = b.id
     WHERE p.id = $1`,
    [productId]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
}
