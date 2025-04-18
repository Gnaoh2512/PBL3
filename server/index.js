import express from "express";
import dotenv from "dotenv";
import userRouter from "./userRoutes.js";
import adminRouter from "./adminRoutes.js";
import delivererRouter from "./delivererRoutes.js";
import authRouter from "./authRoutes.js";
import dataRouter from "./dataRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use("/data", dataRouter);
app.use("/auth", authRouter);
app.use("/customer", userRouter);
app.use("/admin", adminRouter);
app.use("/deliverer", delivererRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
