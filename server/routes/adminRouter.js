import express from "express";
import { protect, isAdmin } from "../auth.js";
import { createProduct, getAllUsers } from "../controllers/adminController.js";

const adminRouter = express.Router();

// Admin Routes
adminRouter.use(protect, isAdmin);

// Manage Products
adminRouter.post("/product", createProduct);

// Get All Users
adminRouter.get("/users", getAllUsers);

export default adminRouter;
