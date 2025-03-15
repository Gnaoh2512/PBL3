import express from "express";
import { protect, isDeliverer } from "./auth.js";
import pool from "./db.js";

const delivererRouter = express.Router();

// Deliverer Routes
delivererRouter.use(protect, isDeliverer);

// Get Pending Orders for Deliverer
delivererRouter.get("/orders", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM "Order" WHERE status = 'pending'`);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

// Mark Order as Delivered
delivererRouter.put("/orders", async (req, res) => {
  const { orderId } = req.body;
  try {
    const result = await pool.query(`UPDATE "Order" SET status = 'delivered' WHERE id = $1 RETURNING *`, [orderId]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

export default delivererRouter;
