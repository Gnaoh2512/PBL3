import express from "express";
import {
  getCategoriesController,
  getProductsByCategoryNameController,
  getRoomCategoryByRoomNameController,
  getRoomCategoryProductsController,
  getSingleProductController,
  getAllProductsController,
} from "../controllers/dataController.js";

const router = express.Router();

router.get("/categories", getCategoriesController);

router.get("/categories/:categoryName", getProductsByCategoryNameController);

router.get("/rooms/:roomName", getRoomCategoryByRoomNameController);

router.get("/rooms/:roomName/:roomCategory", getRoomCategoryProductsController);

router.get("/products/:id", getSingleProductController);

router.get("/products", getAllProductsController);

export default router;
