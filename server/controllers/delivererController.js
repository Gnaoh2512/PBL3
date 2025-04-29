import { getOrderById, getAllOrders, deliverOrderAndInsertHistory } from "../models/delivererModel.js";

// Fetch all orders with categories and brands
export async function getAllOrdersController(req, res) {
  try {
    const result = await getAllOrders();

    if (!result || result.length === 0) {
      return res.status(200).json({ orders: [] });
    }

    const orders = result.reduce((acc, row) => {
      const { order_item_id, order_id, status, time, product_id, quantity, price_at_order } = row;

      if (!acc[order_id]) {
        acc[order_id] = {
          order_id,
          status,
          time,
          items: [],
        };
      }

      acc[order_id].items.push({
        order_item_id,
        product_id,
        quantity,
        price_at_order,
      });

      return acc;
    }, {});

    const formattedOrders = Object.values(orders);

    return res.status(200).json({
      orders: formattedOrders,
    });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deliverOrderAndInsertHistoryController(req, res) {
  const { orderId, delivererId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    const existingOrder = await getOrderById(orderId);

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (existingOrder.status !== "pending") {
      return res.status(400).json({
        message: "Order cannot be marked as delivered because it is not pending",
        currentStatus: existingOrder.status,
      });
    }

    const deliveredOrder = await deliverOrderAndInsertHistory(orderId, delivererId);

    if (!deliveredOrder) {
      return res.status(500).json({ message: "Failed to deliver order" });
    }

    res.status(200).json({
      message: "Order marked as delivered and added to history successfully",
      order: deliveredOrder,
    });
  } catch (err) {
    console.error("Error delivering order and inserting history:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
