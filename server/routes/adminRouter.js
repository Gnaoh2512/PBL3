import express from "express";
import { protect, isAdmin } from "../auth.js";
import { createProductController, updateProductController, updateStockController, deleteProductIfSafeController } from "../controllers/adminController.js";
import { getPendingOrdersController } from "../controllers/delivererController.js";

const adminRouter = express.Router();

adminRouter.use(protect, isAdmin);

adminRouter.post("/product", createProductController);

adminRouter.get("/order", getPendingOrdersController);

adminRouter.put("/product", updateProductController);

adminRouter.patch("/product", updateStockController);

adminRouter.delete("/product/:productId", deleteProductIfSafeController);

export default adminRouter;
