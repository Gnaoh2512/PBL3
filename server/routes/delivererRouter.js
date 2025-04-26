import express from "express";
import { protect, isDeliverer } from "../auth.js";
import { getPendingOrdersController, markOrderAsDeliveredController } from "../controllers/delivererController.js";

const delivererRouter = express.Router();

// Deliverer Routes
delivererRouter.use(protect, isDeliverer);

// Get Pending Orders for Deliverer
delivererRouter.get("/orders", getPendingOrdersController);

// Mark Order as Delivered
delivererRouter.put("/orders", markOrderAsDeliveredController);

export default delivererRouter;
