import express from "express";
import { protect, isDeliverer } from "../auth.js";
import { getAllOrdersController, deliverOrderAndInsertHistoryController, getDeliveredOrders } from "../controllers/delivererController.js";

const delivererRouter = express.Router();

delivererRouter.use(protect, isDeliverer);

delivererRouter.get("/order", getAllOrdersController);

delivererRouter.get("/delivered-order", getDeliveredOrders);

delivererRouter.put("/order", deliverOrderAndInsertHistoryController);

export default delivererRouter;
