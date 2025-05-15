import { executeQuery } from "../helpers/executeQuery.js";

export async function getPendingOrders() {
  const result = await executeQuery(`SELECT * FROM get_pending_orders()`);

  return result;
}

export async function getDeliveredOrders(delivererId) {
  const result = await executeQuery(`SELECT * FROM get_delivered_orders($1)`, [delivererId]);

  return result;
}

export async function deliverOrderAndInsertHistory(orderId, delivererId) {
  const result = await executeQuery(`SELECT * FROM deliver_order_and_insert_history($1, $2)`, [orderId, delivererId]);

  return result;
}
