import express from "express";
import { protect, isCustomer } from "../auth.js";
import {
  getCustomerCartController,
  getCartItemController,
  insertCartItemController,
  placeOrderController,
  removeCartItemController,
  getCustomerOrdersController,
  getCustomerOrderController,
} from "../controllers/customerController.js";

const userRouter = express.Router();

userRouter.use(protect, isCustomer);

userRouter.get("/cart", getCustomerCartController);

userRouter.get("/cart/:productId", getCartItemController);

userRouter.post("/cart", insertCartItemController);

userRouter.delete("/cart", removeCartItemController);

userRouter.post("/order", placeOrderController);

userRouter.get("/order", getCustomerOrdersController);

userRouter.get("/order/:orderId", getCustomerOrderController);

export default userRouter;
