import pool from "../db.js";

// Create a new product
export async function createProductInDb(name, price, category, stock, description, images) {
  const result = await pool.query(
    `INSERT INTO "Product" (name, price, category, stock, description, images) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [name, price, category, stock, description, images]
  );
  return result.rows[0];
}

// Get all users
export async function getAllUsersFromDb() {
  const result = await pool.query(`SELECT * FROM "AuthedUser"`);
  return result.rows;
}
