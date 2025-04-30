import express from "express";
import dotenv from "dotenv";
import customerRouter from "./routes/customerRouter.js";
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

app.use(
  "/",
  express.static("public", {
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=2592000");
    },
  })
);

const PORT = process.env.PORT || 5000;

app.use("/data", dataRouter);
app.use("/auth", authRouter);
app.use("/customer", customerRouter);
app.use("/admin", adminRouter);
app.use("/deliverer", delivererRouter);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
