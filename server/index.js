import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";
import delivererRouter from "./routes/delivererRouter.js";
import authRouter from "./routes/authRouter.js";
import dataRouter from "./routes/dataRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));
app.use("/data", dataRouter);
app.use("/auth", authRouter);
app.use("/customer", userRouter);
app.use("/admin", adminRouter);
app.use("/deliverer", delivererRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
