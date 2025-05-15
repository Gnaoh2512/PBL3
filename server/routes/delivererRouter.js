import express from "express";
import { protect, isDeliverer } from "../auth.js";
import { getPendingOrdersController, deliverOrderAndInsertHistoryController, getDeliveredOrdersController } from "../controllers/delivererController.js";
import { getCustomerOrderController } from "../controllers/customerController.js";

const delivererRouter = express.Router();

delivererRouter.use(protect, isDeliverer);

delivererRouter.get("/order", getPendingOrdersController);

delivererRouter.get("/order/:orderId", getCustomerOrderController);

delivererRouter.get("/delivered-order", getDeliveredOrdersController);

delivererRouter.put("/order", deliverOrderAndInsertHistoryController);

export default delivererRouter;
