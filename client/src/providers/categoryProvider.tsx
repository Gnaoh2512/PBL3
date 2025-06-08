"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import callAPI from "utils/callAPI";
import { dynamicFontSize } from "utils/dynamicFonrsize";

const CategoryContext = createContext<string[] | undefined>(undefined);

const isValidCategory = (cat: string) => /^[a-zA-Z0-9\s-_]+$/.test(cat);

async function fetchCategories(): Promise<string[]> {
  try {
    return await callAPI<string[]>(`${process.env.NEXT_PUBLIC_API_URL}/data/categories`);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dynamicFontSize();

    fetchCategories().then((fetched) => {
      const seen = new Set<string>();
      const filtered = fetched.filter(isValidCategory).filter((cat) => {
        const lower = cat.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
      });

      setCategories(filtered);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return <div></div>;

  return <CategoryContext.Provider value={categories}>{children}</CategoryContext.Provider>;
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};
