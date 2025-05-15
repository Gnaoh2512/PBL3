import { hashPassword, comparePassword, generateToken } from "../auth.js";
import { findUserByEmail, createUser, deleteUser, findUserById, updateUser } from "../models/authModel.js";

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export async function register(req, res) {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 3) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    if (role === "admin") {
      return res.status(403).json({ message: "Cannot register as admin" });
    }

    const emailAlreadyExists = await findUserByEmail(email);
    if (emailAlreadyExists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await createUser(email, hashedPassword, role);

    if (!newUser) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    const token = generateToken({ id: newUser.id, role: newUser.role });

    res.cookie("jwt", token, getCookieOptions());

    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      user: userWithoutPassword,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.cookie("jwt", token, getCookieOptions());

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      user: userWithoutPassword,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
}

export function logout(req, res) {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
}

export async function profile(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(200).json({ message: "Not authenticated" });
    }

    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      user: userWithoutPassword,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
}

export async function deleteAccount(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deleted = await deleteUser(req.user.id);

    if (!deleted) {
      return res.status(500).json({ message: "Failed to delete account" });
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
}

export async function edit(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { email, password } = req.body;

    if (!email && !password) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {};

    if (email && email !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const emailAlreadyExists = await findUserByEmail(email);
      if (emailAlreadyExists) {
        return res.status(409).json({ message: "Email already registered" });
      }

      updates.email = email;
    }

    if (password) {
      if (password.length < 3) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      const hashedPassword = await hashPassword(password);
      updates.password = hashedPassword;
    }

    const updatedUser = await updateUser(req.user.id, updates);

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user" });
    }

    return res.status(200).json({
      message: "Account updated successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
}
