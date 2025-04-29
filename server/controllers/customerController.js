import { getUserCart, updateCartQuantity, removeCartItem, placeOrderQuery, addOrUpdateCartItem, getUserOrders } from "../models/customerModel.js";
import { getProductById } from "../models/dataModel.js";

// Get the user's cart
export async function getUserCartController(req, res) {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const cart = await getUserCart(req.user.id);

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

// Add item to cart
export async function addToCartController(req, res) {
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  if (!quantity || Number(quantity) <= 0) {
    return res.status(400).json({ message: "Valid quantity is required" });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Fetch product details including stock
  const product = await getProductById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.stock < Number(quantity)) {
    return res.status(200).json({ message: "Not enough stock available" });
  }

  try {
    // Use the new function that handles both adding and updating cart items
    await addOrUpdateCartItem(req.user.id, productId, quantity);

    res.status(200).json({
      message: "Cart updated successfully",
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Internal Server Error", err });
  }
}

// Update cart item quantity
export async function updateCartController(req, res) {
  const { productId, quantity } = req.body;

  // Validate inputs
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  if (!quantity || Number(quantity) <= 0) {
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
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const result = await removeCartItem(req.user.id, productId);

    if (result) {
      res.status(200).json({
        message: "Item removed from cart successfully and stock updated",
      });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (err) {
    console.error("Error removing item from cart:", err);
    res.status(500).json({ message: "Internal Server Error", err });
  }
}

export async function placeOrderController(req, res) {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Items are required" });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const newOrders = await placeOrderQuery(req.user.id, items);

    res.status(201).json({
      message: "Order placed successfully",
      orders: newOrders,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function fetchOrdersController(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const result = await getUserOrders(req.user.id);

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
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}