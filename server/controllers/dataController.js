import { getCategoryNames, getRoomIdByName, getRoomCategories, getProductsByCategory, getProductCategories, getRoomCategoryByName, getProductById } from "../models/dataModel.js";

// Fetch all category names
export async function getCategoryNamesController(req, res) {
  try {
    const categoryNames = await getCategoryNames();
    res.json(categoryNames);
  } catch (err) {
    console.error("Error fetching category names:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Fetch categories for a room
export async function getRoomCategoriesController(req, res) {
  const { roomName } = req.params;
  const formattedRoomName = formatName(roomName);

  try {
    const roomId = await getRoomIdByName(formattedRoomName);
    if (!roomId) {
      return res.status(404).json({ error: "Room not found" });
    }

    const categoryNames = await getRoomCategories(roomId);
    res.json(categoryNames);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Fetch products for a specific room and category
export async function getRoomCategoryProductsController(req, res) {
  const { roomCategory } = req.params;
  const formattedRoomCategory = formatName(roomCategory);

  try {
    const roomCategoryIds = await getRoomCategoryByName(formattedRoomCategory);
    if (!roomCategoryIds) {
      return res.status(404).json({ error: "Room category not found" });
    }

    const products = await getProductsByCategory(roomCategoryIds);
    if (products.length === 0) {
      return res.json([]);
    }

    const productCategoryInfo = await getProductCategories(products.map((p) => p.id));
    const result = products.map((product) => ({
      id: product.id,
      brand: product.brand,
      price: parseFloat(product.price),
      stock: product.stock,
      categories: productCategoryInfo[product.id] || [],
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching product info:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getSingleProductController(req, res) {
  const { id } = req.params;

  try {
    // Step 1: Get the main product
    const mainProduct = await getProductById(parseInt(id));
    if (!mainProduct) {
      return res.status(404).json({ error: `Product with ID ${id} not found` });
    }

    // Step 2: Get categories for the main product
    const productCategoryInfo = await getProductCategories([mainProduct.id]);
    const mainProductInfo = {
      id: mainProduct.id,
      price: parseFloat(mainProduct.price),
      stock: mainProduct.stock,
      brand: mainProduct.brand, // Now 'brand' is part of the main product info
      categories: productCategoryInfo[mainProduct.id] || [],
    };

    // Step 3: Get related products in same room category
    const relatedProducts = await getProductsByCategory(mainProduct.id_roomCategory);

    // Step 4: Get category info for related products
    const relatedProductIds = relatedProducts.map((p) => p.id);
    const relatedCategoriesMap = await getProductCategories(relatedProductIds);

    // Step 5: Merge brand and category information for related products
    const relatedProductsWithDetails = relatedProducts
      .filter((product) => product.id !== parseInt(id)) // Exclude the main product
      .map((product) => ({
        id: product.id,
        price: parseFloat(product.price),
        stock: product.stock,
        brand: product.brand, // Brand included for related products
        categories: relatedCategoriesMap[product.id] || [],
      }));

    // Step 6: Return full response
    res.json({
      mainProduct: mainProductInfo,
      relatedProducts: relatedProductsWithDetails,
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Helper function to format names
function formatName(name) {
  return name
    .replace(/-/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
