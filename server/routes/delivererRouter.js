import express from "express";
import { protect, isDeliverer } from "../auth.js";
import { getAllOrdersController, deliverOrderAndInsertHistoryController } from "../controllers/delivererController.js";

const delivererRouter = express.Router();

delivererRouter.use(protect, isDeliverer);

delivererRouter.get("/order", getAllOrdersController);

delivererRouter.put("/order", deliverOrderAndInsertHistoryController);


export default delivererRouter;
