import { getCartItem, getCustomerCart, insertCartItem, removeCartItem, placeOrder, getCustomerOrders, getCustomerOrder } from "../models/customerModel.js";

export async function getCartItemController(req, res) {
  const { productId } = req.params;

  try {
    const result = await getCartItem(productId, req.user.id);

    res.status(200).json(result[0].get_cart_product);
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
}

export async function getCustomerCartController(req, res) {
  try {
    const cart = await getCustomerCart(req.user.id);

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
}

export async function insertCartItemController(req, res) {
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  if (!quantity || Number(quantity) <= 0) {
    return res.status(200).json({ message: "Valid quantity is required" });
  }

  try {
    const result = await insertCartItem(req.user.id, productId, quantity);
    res.status(200).json({ message: result[0].add_to_cart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
}

export async function removeCartItemController(req, res) {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Cart id is required" });
  }

  try {
    const result = await removeCartItem(req.user.id, productId);
    if (result) {
      res.status(200).json({
        message: "Item removed from cart successfully",
      });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
}

export async function placeOrderController(req, res) {
  const { itemIds } = req.body;

  try {
    const result = await placeOrder(req.user.id, itemIds);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
}

export async function getCustomerOrdersController(req, res) {
  try {
    const result = await getCustomerOrders(req.user.id);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
}

export async function getCustomerOrderController(req, res) {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ message: "Order id is required" });
  }

  try {
    const result = await getCustomerOrder(orderId);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { order_id, status, order_time } = result[0];

    const formatted = {
      order: {
        order_id,
        status,
        time: order_time,
      },
      items: result.map((row) => ({
        product_id: row.product_id,
        quantity: row.quantity,
        price_at_order: row.price_at_order,
      })),
    };

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
}
