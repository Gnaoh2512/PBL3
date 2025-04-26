import express from "express";
import { protect, isCustomer } from "../auth.js";
import { getUserCartController, addToCartController, placeOrderController } from "../controllers/userController.js";

const userRouter = express.Router();

// User Routes
userRouter.use(protect, isCustomer);

// Get the user's cart
userRouter.get("/cart", getUserCartController);

// Add product to cart
userRouter.post("/cart", addToCartController);

// Place an order
userRouter.post("/order", placeOrderController);

export default userRouter;
