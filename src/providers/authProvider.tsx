"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import callAPI from "utils/callAPI";
import { AuthContextType, User } from "types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserProfile = async () => {
    try {
      const response = await callAPI<{ message: string; user: User }>(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`);

      if (response?.user) {
        setUser(response.user);
      } else {
        setUser(null);
        setError(null);
      }
    } catch (err) {
      if (err || "Unauthorize") {
        setUser(null);
        setError(null);
      } else {
        setError("Failed to load user data");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await callAPI<{ message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, { method: "POST" });
      console.log(res.message);
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return <AuthContext.Provider value={{ user, loading, error, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
