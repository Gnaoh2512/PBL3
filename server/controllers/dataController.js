import {
  getCategoryNames,
  getRoomIdByName,
  getRoomCategories,
  getProductsByCategory,
  getProductCategories,
  getRoomCategoryByName,
  getProductById,
  getAllProducts,
  getProductBrands,
} from "../models/dataModel.js";

// Helper function to format names
function formatName(name) {
  if (!name) return "";
  return name
    .replace(/-/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function getCategoryNamesController(req, res) {
  try {
    const categoryNames = await getCategoryNames();
    res.json(categoryNames);
  } catch (err) {
    console.error("Error fetching category names:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getRoomCategoriesController(req, res) {
  const { roomName } = req.params;

  try {
    const formattedRoomName = formatName(roomName);
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

export async function getRoomCategoryProductsController(req, res) {
  const { roomCategory } = req.params;

  try {
    const formattedRoomCategory = formatName(roomCategory);
    const roomCategoryId = await getRoomCategoryByName(formattedRoomCategory);

    if (!roomCategoryId) {
      return res.status(404).json({ error: "Room category not found" });
    }

    const products = await getProductsByCategory(roomCategoryId);
    if (products.length === 0) {
      return res.json([]);
    }

    const productIds = products.map((p) => p.id);
    const productCategoryInfo = await getProductCategories(productIds);

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
  const productId = parseInt(id);

  try {
    // Get main product data
    const mainProduct = await getProductById(productId);
    if (!mainProduct) {
      return res.status(404).json({ error: `Product with ID ${id} not found` });
    }

    // Get categories for main product
    const productCategoryInfo = await getProductCategories([mainProduct.id]);

    const mainProductInfo = {
      id: mainProduct.id,
      price: parseFloat(mainProduct.price),
      stock: mainProduct.stock,
      brand: mainProduct.brand,
      categories: productCategoryInfo[mainProduct.id] || [],
    };

    // Get related products
    const relatedProducts = await getProductsByCategory(mainProduct.id_roomCategory);

    // Get category info for related products
    const relatedProductIds = relatedProducts.map((p) => p.id);
    const relatedCategoriesMap = await getProductCategories(relatedProductIds);

    const relatedProductsWithDetails = relatedProducts
      .filter((product) => product.id !== productId)
      .map((product) => ({
        id: product.id,
        price: parseFloat(product.price),
        stock: product.stock,
        brand: product.brand,
        categories: relatedCategoriesMap[product.id] || [],
      }));

    res.json({
      mainProduct: mainProductInfo,
      relatedProducts: relatedProductsWithDetails,
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getAllProductsController(req, res) {
  try {
    const products = await getAllProducts();

    if (!products || products.length === 0) {
      return res.json([]);
    }

    const productIds = products.map((p) => p.id);

    const categoriesMap = await getProductCategories(productIds);
    const brandsMap = await getProductBrands(productIds);

    const result = products.map((product) => ({
      id: product.id,
      brand: brandsMap[product.id] || product.brand,
      price: parseFloat(product.price),
      stock: product.stock,
      categories: categoriesMap[product.id] || [],
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
