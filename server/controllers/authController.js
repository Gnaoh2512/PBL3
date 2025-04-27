import { hashPassword, comparePassword, generateToken } from "../auth.js";
import { findUserByEmail, createUser, deleteUser, findUserById, emailExists, updateUser } from "../models/authModel.js";

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export async function register(req, res) {
  const { email, password, role } = req.body;

  try {
    // Input validation
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password strength
    if (password.length < 3) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // Restrict admin registration
    if (role === "admin") {
      return res.status(403).json({ message: "Cannot register as admin" });
    }

    // Check if email already exists
    const emailAlreadyExists = await emailExists(email);
    if (emailAlreadyExists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Create user with hashed password
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser(email, hashedPassword, role);

    if (!newUser) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    // Generate JWT token
    const token = generateToken({ id: newUser.id, role: newUser.role });

    // Set cookie
    res.cookie("jwt", token, getCookieOptions());

    // Simply return the user without the password field
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Login existing user
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await findUserByEmail(email);

    // Check credentials
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken({ id: user.id, role: user.role });

    // Set cookie
    res.cookie("jwt", token, getCookieOptions());

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Logout user
export function logout(req, res) {
  try {
    // Clear JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Get user profile
export async function profile(req, res) {
  try {
    // Check if user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Get user data
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Delete user account
export async function deleteAccount(req, res) {
  try {
    // Check if user exists
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    const deleted = await deleteUser(req.user.id);

    if (!deleted) {
      return res.status(500).json({ message: "Failed to delete account" });
    }

    // Clear JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Account deletion error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function edit(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { email, password } = req.body;

    // Check if there is something to update
    if (!email && !password) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    // Find the current user
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {};

    // Handle email change
    if (email && email !== user.email) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Check if new email is already used
      const emailAlreadyExists = await emailExists(email);
      if (emailAlreadyExists) {
        return res.status(409).json({ message: "Email already registered" });
      }

      updates.email = email;
    }

    // Handle password change
    if (password) {
      if (password.length < 3) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }

      const hashedPassword = await hashPassword(password);
      updates.password = hashedPassword;
    }

    // Update user
    const updatedUser = await updateUser(req.user.id, updates);

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user" });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    return res.status(200).json({
      message: "Account updated successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Edit error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
