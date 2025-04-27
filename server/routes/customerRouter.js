import express from "express";
import { protect, isCustomer } from "../auth.js";
import { getUserCartController, addToCartController, placeOrderController, removeFromCartController, fetchOrdersController } from "../controllers/customerController.js";

const userRouter = express.Router();

userRouter.use(protect, isCustomer);

userRouter.get("/cart", getUserCartController);

userRouter.post("/cart", addToCartController);

userRouter.delete("/cart", removeFromCartController);

userRouter.post("/order", placeOrderController);

userRouter.get("/order", fetchOrdersController);

export default userRouter;
