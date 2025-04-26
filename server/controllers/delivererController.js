import { getPendingOrders, markOrderAsDelivered } from "../models/delivererModel.js";

// Get all pending orders for the deliverer
export async function getPendingOrdersController(req, res) {
  try {
    const orders = await getPendingOrders();
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching pending orders:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Mark an order as delivered
export async function markOrderAsDeliveredController(req, res) {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    const updatedOrder = await markOrderAsDelivered(orderId);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found or already delivered" });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
