import { executeQuery } from "../helpers/executeQuery.js";

export async function getCartItem(productId, customerId) {
  if (!productId || !customerId) return [];

  return executeQuery(`SELECT * FROM get_cart_product($1, $2)`, [customerId, productId]);
}

export async function getCustomerCart(customerId) {
  if (!customerId) return [];

  return executeQuery(`SELECT * FROM get_cart($1)`, [customerId]);
}

export async function insertCartItem(customerId, productId, quantity) {
  if (!customerId || !productId || !quantity) return;

  return executeQuery(`SELECT * FROM add_to_cart($1, $2, $3)`, [customerId, productId, quantity]);
}

export async function removeCartItem(customerId, productId) {
  if (!customerId || !productId) return false;

  return executeQuery(`SELECT * FROM remove_cart_item($1, $2);`, [customerId, productId]);
}

export async function placeOrder(customerId, cartItemIds) {
  if (!customerId || !cartItemIds) return;

  const rows = await executeQuery(`SELECT * FROM place_order($1, $2)`, [customerId, cartItemIds]);
  return rows[0];
}

export async function getCustomerOrders(customerId) {
  if (!customerId) return [];

  const result = await executeQuery(`SELECT * FROM get_user_orders($1);`, [customerId]);
  return result.length > 0 ? result : [];
}

export async function getCustomerOrder(orderId) {
  if (!orderId) return [];

  const result = await executeQuery(`SELECT * from get_order_info($1);`, [orderId]);
  return result;
}
