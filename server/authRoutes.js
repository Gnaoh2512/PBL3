import express from "express";
import { hashPassword, comparePassword, generateToken, protect } from "./auth.js";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const authRouter = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const authSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 100,
  delayMs: () => 500,
});

authRouter.post("/register", authLimiter, authSlowDown, async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (role === "admin") {
      return res.status(403).json({ message: "Cannot register as admin" });
    }

    const { rows } = await pool.query('SELECT id FROM "AuthedUser" WHERE email = $1', [email]);
    const user = rows[0];

    if (user) {
      return res.status(401).json({ message: "Registered Email" });
    }

    const hashedPassword = await hashPassword(password);
    const result = await pool.query('INSERT INTO "AuthedUser" (email, password, role) VALUES ($1, $2, $3) RETURNING id', [email, hashedPassword, role]);

    const token = generateToken({ id: result.rows[0].id });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json();
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

// Login route
authRouter.post("/login", authLimiter, authSlowDown, async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await pool.query("SELECT id, email, password FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user.id });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json();
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

// Logout route
authRouter.post("/logout", (req, res) => {
  res.clearCookie("jwt", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
  res.status(200).json();
});

// Protected route example
authRouter.get("/profile", protect, authLimiter, authSlowDown, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

authRouter.delete("/delete", protect, async (req, res) => {
  const userId = req.user.id; // Assume req.user contains the authenticated user ID

  try {
    // Check if user exists in the database
    const { rows } = await pool.query('SELECT id FROM "AuthedUser" WHERE id = $1', [userId]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user account from the database
    await pool.query('DELETE FROM "AuthedUser" WHERE id = $1', [userId]);

    // Optionally, clear the JWT cookie after account deletion
    res.clearCookie("jwt", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });

    // Respond with a success message
    res.status(200).json();
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
});

export default authRouter;
