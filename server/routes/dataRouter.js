import express from "express";
import { getCategoryNamesController, getRoomCategoriesController, getRoomCategoryProductsController, getSingleProductController, getAllProductsController } from "../controllers/dataController.js";

const router = express.Router();

router.get("/category", getCategoryNamesController);

router.get("/rooms/:roomName", getRoomCategoriesController);

router.get("/rooms/:roomName/:roomCategory", getRoomCategoryProductsController);

router.get("/products/:id", getSingleProductController);

router.get("/products", getAllProductsController);

export default router;
