import { getOrderById, getAllOrders, deliverOrderAndInsertHistory } from "../models/delivererModel.js";

export async function getAllOrdersController(req, res) {
  try {
    const result = await getAllOrders("pending");

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
    res.status(500).json({ message: "Internal Server Error", err });
  }
}

export async function getDeliveredOrders(req, res) {
  try {
    const result = await getAllOrders("delivered");

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
    res.status(500).json({ message: "Internal Server Error", err });
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
      });
    }

    const deliveredOrder = await deliverOrderAndInsertHistory(orderId, delivererId);

    if (!deliveredOrder) {
      return res.status(500).json({ message: "Failed to deliver order" });
    }

    res.status(200).json({
      message: "Order marked as delivered and added to history successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", err });
  }
}
