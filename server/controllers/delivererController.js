import { getPendingOrders, markOrderAsDelivered, getOrderById } from "../models/delivererModel.js";

export async function getPendingOrdersController(req, res) {
  try {
    const orders = await getPendingOrders();
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching pending orders:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function markOrderAsDeliveredController(req, res) {
  const { orderId } = req.body;

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

    const updatedOrder = await markOrderAsDelivered(orderId);

    res.status(200).json({
      message: "Order marked as delivered successfully",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOrderStatusController(req, res) {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    const order = await getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      orderId: order.id,
      status: order.status,
      lastUpdated: order.updated_at || order.created_at,
    });
  } catch (err) {
    console.error("Error fetching order status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
