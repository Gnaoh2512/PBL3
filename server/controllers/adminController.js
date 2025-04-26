import pool from "../db.js";

export async function createProduct(req, res) {
  const { name, price, category, stock, description, images } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO "Product" (name, price, category, stock, description, images) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, price, category, stock, description, images]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
}

export async function getAllUsers(req, res) {
  try {
    const result = await pool.query(`SELECT * FROM "AuthedUser"`);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
}
