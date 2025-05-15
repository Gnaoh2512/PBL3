import { executeQuery } from "../helpers/executeQuery.js";

export async function createProduct(brand, roomCategory, price, stock, categories) {
  const result = await executeQuery(`SELECT add_product($1, $2, $3, $4, $5)`, [brand, roomCategory, price, stock, categories]);

  return result;
}

export async function updateProduct(productId, brand, roomCategory, price, stock, categories) {
  const result = await executeQuery(`SELECT update_product($1, $2, $3, $4, $5, $6)`, [productId, brand, roomCategory, price, stock, categories]);

  return result;
}

export async function updateStock(productId, stock) {
  const result = await executeQuery(`SELECT update_product_stock($1, $2)`, [productId, stock]);

  return result;
}

export async function deleteProductIfSafe(productId) {
  const result = await executeQuery(`SELECT delete_product_if_safe($1)`, [productId]);

  return result;
}
