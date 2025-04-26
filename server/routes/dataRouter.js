import express from "express";
import { getCategoryNamesController, getRoomCategoriesController, getRoomCategoryProductsController, getSingleProductController } from "../controllers/dataController.js";

const router = express.Router();

// Fetch all category names
router.get("/category", getCategoryNamesController);

// Fetch categories for a room
router.get("/rooms/:roomName", getRoomCategoriesController);

// Fetch products for a room and category
router.get("/rooms/:roomName/:roomCategory", getRoomCategoryProductsController);

router.get("/products/:id", getSingleProductController);

export default router;
