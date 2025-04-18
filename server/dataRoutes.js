import express from "express";
import pool from "./db.js";

const router = express.Router();

router.get("/category", async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM "Category"');
    const categoryNames = result.rows.map((row) => row.name);
    res.json(categoryNames);
  } catch (err) {
    console.error("Error fetching category names:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
