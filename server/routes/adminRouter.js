import express from "express";
import { protect, isAdmin } from "../auth.js";
import { createProductController, getAllOrdersController } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.use(protect, isAdmin);

adminRouter.post("/product", createProductController);

adminRouter.get("/order", getAllOrdersController);

export default adminRouter;
