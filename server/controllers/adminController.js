import { createProduct, updateProduct, updateStock, deleteProductIfSafe } from "../models/adminModel.js";

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
    res.status(500).json({ message: "Failed to create product, check RoomCategory", err: err.message });
  }
}

export async function updateProductController(req, res) {
  const { productId, brand, roomCategory, price, stock, categories } = req.body;
  try {
    const capitalizedRoomCategory = roomCategory.charAt(0).toUpperCase() + roomCategory.slice(1).toLowerCase();
    await updateProduct(parseInt(productId), brand, capitalizedRoomCategory, price, stock, categories);
    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
}

export async function updateStockController(req, res) {
  const { productId, stock } = req.body;

  try {
    await updateStock(productId, stock);
    res.status(200).json({ message: "Stock updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
}

export async function deleteProductIfSafeController(req, res) {
  const { productId } = req.params;

  try {
    const result = await deleteProductIfSafe(parseInt(productId));
    if (result[0].delete_product_if_safe === false) {
      return res.status(200).json({ message: "Product is in an active order and cannot be deleted" });
    } else res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
}
