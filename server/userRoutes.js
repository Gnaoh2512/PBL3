import express from "express";
import { isCustomer, protect } from "./auth.js";
import pool from "./db.js";

const userRouter = express.Router();

// User Routes
userRouter.use(protect, isCustomer);

// Get User's Cart
userRouter.get("/cart", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM "Cart" WHERE "customer_id" = $1`, [req.user.id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

// Add to Cart
userRouter.post("/cart", async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const result = await pool.query(`INSERT INTO "Cart" ("customer_id", "product_id", quantity) VALUES ($1, $2, $3) RETURNING *`, [req.user.id, productId, quantity]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

// Place an Order
userRouter.post("/order", async (req, res) => {
  const { productId, amount, status } = req.body;
  try {
    const result = await pool.query(`INSERT INTO "Order" ("customer_id", "product_id", amount, status) VALUES ($1, $2, $3, $4) RETURNING *`, [req.user.id, productId, amount, status]);

    await pool.query(`INSERT INTO "OrderHistory" ("customer_id", "order_id") VALUES ($1, $2)`, [req.user.id, result.rows[0].id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

export default userRouter;
