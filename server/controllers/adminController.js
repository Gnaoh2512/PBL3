import { createProduct, getAllOrders } from "../models/adminModel.js";

export async function createProductController(req, res) {
  const { brand, roomCategory, price, stock, categories } = req.body;
  try {
    const capitalizedRoomCategory = roomCategory.charAt(0).toUpperCase() + roomCategory.slice(1).toLowerCase();
    const categoriesArray = categories
      .split(",")
      .map((item) => item.trim())
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
      .filter((item) => item.length > 0);
    await createProduct(brand, capitalizedRoomCategory, price, stock, categoriesArray);
    res.status(201).json({ message: "Product created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
}

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
    res.status(500).json({ message: "Internal Server Error", err });
  }
}