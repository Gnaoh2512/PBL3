import {
  getCategories,
  getRoomIdByName,
  getRoomCategoriesByRoomId,
  getProductsByRoomCategoryId,
  getProductCategories,
  getRoomCategoryIdsByName,
  getProductById,
  getAllProducts,
  getProductBrands,
  getProductsByCategoryName,
} from "../models/dataModel.js";

function formatName(name) {
  if (!name) return "";
  return name
    .replace(/-/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function getCategoriesController(req, res) {
  try {
    const categoryNames = await getCategories();
    res.json(categoryNames);
  } catch (err) {
    console.error("Error fetching category names:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getRoomCategoryByRoomNameController(req, res) {
  const { roomName } = req.params;

  try {
    const formattedRoomName = formatName(roomName);
    const roomId = await getRoomIdByName(formattedRoomName);

    if (!roomId) {
      return res.status(404).json({ error: "Room not found" });
    }

    const roomCategories = await getRoomCategoriesByRoomId(roomId);
    res.json(roomCategories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getRoomCategoryProductsController(req, res) {
  const { roomCategory } = req.params;

  try {
    const formattedRoomCategory = formatName(roomCategory);
    const roomCategoryId = await getRoomCategoryIdsByName(formattedRoomCategory);

    if (!roomCategoryId) {
      return res.status(404).json({ error: "Room category not found" });
    }

    const products = await getProductsByRoomCategoryId(roomCategoryId);
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

export async function getProductsByCategoryNameController(req, res) {
  const { categoryName } = req.params;
  try {
    const formattedCategoryName = formatName(categoryName);
    const products = await getProductsByCategoryName(formattedCategoryName);

    if (!products.length) {
      return res.json([]);
    }

    const productIds = products.map((p) => p.id);
    const categoriesMap = await getProductCategories(productIds);

    const result = products.map((product) => ({
      id: product.id,
      price: parseFloat(product.price),
      stock: product.stock,
      brand: product.brand,
      categories: categoriesMap[product.id] || [],
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching products by category name:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getSingleProductController(req, res) {
  const { id } = req.params;
  const productId = parseInt(id);

  try {
    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: `Product with ID ${id} not found` });
    }

    const productCategoryInfo = await getProductCategories([product.id]);

    const formatted = {
      id: product.id,
      price: parseFloat(product.price),
      stock: product.stock,
      brand: product.brand,
      categories: productCategoryInfo[product.id] || [],
    };

    res.json({ product: formatted });
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
