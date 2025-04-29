import express from "express";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { register, login, logout, profile, deleteAccount, edit } from "../controllers/authController.js";
import { protect } from "../auth.js";

const router = express.Router();

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
const authSlowDown = slowDown({ windowMs: 15 * 60 * 1000, delayAfter: 20, delayMs: () => 500 });

router.post("/register", authLimiter, authSlowDown, register);
router.post("/login", authLimiter, authSlowDown, login);
router.post("/logout", logout);
router.post("/edit", protect, authLimiter, authSlowDown, edit);
router.get("/profile", protect, authLimiter, authSlowDown, profile);
router.delete("/delete", protect, deleteAccount);

export default router;
