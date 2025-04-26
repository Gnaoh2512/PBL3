import { getUserCart, addToCart, placeOrder } from "../models/userModel.js";

// Get the user's cart
export async function getUserCartController(req, res) {
  try {
    const cart = await getUserCart(req.user.id);
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Add product to the user's cart
export async function addToCartController(req, res) {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: "Product ID and quantity are required" });
  }

  try {
    const newCartItem = await addToCart(req.user.id, productId, quantity);
    res.status(201).json(newCartItem);
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Place an order
export async function placeOrderController(req, res) {
  const { productId, amount, status } = req.body;

  if (!productId || !amount || !status) {
    return res.status(400).json({ message: "Product ID, amount, and status are required" });
  }

  try {
    const newOrder = await placeOrder(req.user.id, productId, amount, status);
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
