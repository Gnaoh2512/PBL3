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
      const response = await callAPI<{ data: { user: User } }>(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`);
      console.log(response);
      if (response?.data?.user) {
        setUser(response.data.user);
      } else {
        setError("User data not found");
      }
    } catch (err) {
      setError("Failed to load user data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return <AuthContext.Provider value={{ user, loading, error }}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
