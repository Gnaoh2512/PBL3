import { getPendingOrders, getDeliveredOrders, deliverOrderAndInsertHistory } from "../models/delivererModel.js";

export async function getPendingOrdersController(req, res) {
  try {
    const result = await getPendingOrders("pending");

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
}

export async function getDeliveredOrdersController(req, res) {
  try {
    const result = await getDeliveredOrders(req.user.id);

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
}

export async function deliverOrderAndInsertHistoryController(req, res) {
  const { orderId } = req.body;

  if (!orderId || !req.user.id) {
    return res.status(400).json({ message: "Order ID and Deliverer ID are required" });
  }

  try {
    const result = await deliverOrderAndInsertHistory(orderId, req.user.id);

    if (!result) {
      return res.status(400).json({ message: "Order already delivered or does not exist" });
    }

    res.status(200).json({
      message: "Order has been marked as delivered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
}
