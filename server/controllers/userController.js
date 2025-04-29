import { getUserCart, addToCart, placeOrder, updateCartQuantity, removeFromCart } from "../models/userModel.js";

// Get the user's cart
export async function getUserCartController(req, res) {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const cart = await getUserCart(req.user.id);

    // Calculate total price
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.status(200).json({
      items: cart,
      totalItems: cart.length,
      totalPrice: total,
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Add product to the user's cart
export async function addToCartController(req, res) {
  const { productId, quantity } = req.body;

  // Validate inputs
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Valid quantity is required" });
  }

  // Ensure user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const newCartItem = await addToCart(req.user.id, productId, quantity);

    res.status(201).json({
      message: "Product added to cart successfully",
      item: newCartItem,
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update cart item quantity
export async function updateCartController(req, res) {
  const { productId, quantity } = req.body;

  // Validate inputs
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Valid quantity is required" });
  }

  // Ensure user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const updatedItem = await updateCartQuantity(req.user.id, productId, quantity);

    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({
      message: "Cart updated successfully",
      item: updatedItem,
    });
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Remove item from cart
export async function removeFromCartController(req, res) {
  const { productId } = req.params;

  // Validate inputs
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  // Ensure user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const removed = await removeFromCart(req.user.id, productId);

    if (!removed) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({
      message: "Item removed from cart successfully",
    });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Place an order
export async function placeOrderController(req, res) {
  const { productId, amount, status = "pending" } = req.body;

  // Validate inputs
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Valid amount is required" });
  }

  // Ensure user is authenticated
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const newOrder = await placeOrder(req.user.id, productId, amount, status);

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
