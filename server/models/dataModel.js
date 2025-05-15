import { executeQuery } from "../helpers/executeQuery.js";

export async function getCategories() {
  const rows = await executeQuery('SELECT name FROM "Category"');
  return rows.map((row) => row.name);
}

export async function getRoomIdByName(roomName) {
  if (!roomName) return null;

  const rows = await executeQuery('SELECT id FROM "Room" WHERE LOWER(name) = LOWER($1)', [roomName]);
  return rows.length > 0 ? rows[0].id : null;
}

export async function getRoomCategoriesByRoomId(roomId) {
  if (!roomId) return [];

  const rows = await executeQuery('SELECT * FROM "RoomCategory" WHERE id_room = $1', [roomId]);
  return rows.map((row) => ({
    name: row.name,
    id: row.id,
  }));
}

export async function getRoomCategoryIdsByName(roomCategory) {
  if (!roomCategory) return null;

  const rows = await executeQuery('SELECT id FROM "RoomCategory" WHERE LOWER(name) = LOWER($1)', [roomCategory]);
  return rows.length > 0 ? rows[0].id : null;
}

export async function getProductsByCategoryName(categoryName) {
  if (!categoryName) return [];

  return executeQuery(
    `SELECT p.id, p.price, p.stock, b.name AS brand
     FROM "Product" p
     JOIN "ProductCategory" pc ON p.id = pc.id_product
     JOIN "Category" c ON pc.id_category = c.id
     JOIN "Brand" b ON p.id_brand = b.id
     WHERE LOWER(c.name) = LOWER($1)`,
    [categoryName]
  );
}

export async function getProductsByRoomCategoryId(roomCategoryId) {
  if (!roomCategoryId) return [];

  return executeQuery(
    `SELECT p.id, p.price, p.stock, b.name AS brand
     FROM "Product" p
     JOIN "Brand" b ON p.id_brand = b.id
     WHERE p."id_roomCategory" = $1`,
    [roomCategoryId]
  );
}

export async function getProductCategories(productIds) {
  if (!productIds || productIds.length === 0) return {};

  const rows = await executeQuery(
    `SELECT pc.id_product, c.name AS category
     FROM "ProductCategory" pc
     JOIN "Category" c ON pc.id_category = c.id
     WHERE pc.id_product = ANY($1)`,
    [productIds]
  );

  const categoryMap = {};
  rows.forEach(({ id_product, category }) => {
    if (!categoryMap[id_product]) {
      categoryMap[id_product] = [];
    }
    categoryMap[id_product].push(category);
  });

  return categoryMap;
}

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

export async function getAllProducts() {
  return executeQuery('SELECT * FROM "Product"');
}

export async function getProductBrands(productIds) {
  if (!productIds || productIds.length === 0) return {};

  try {
    const rows = await executeQuery(
      `SELECT p.id AS product_id, b.name AS brand_name
       FROM "Product" p
       JOIN "Brand" b ON p.id_brand = b.id
       WHERE p.id = ANY($1)`,
      [productIds]
    );

    const brandsMap = {};
    rows.forEach((row) => {
      brandsMap[row.product_id] = row.brand_name;
    });

    return brandsMap;
  } catch (err) {
    console.error("Error fetching brands:", err);
    return {};
  }
}
