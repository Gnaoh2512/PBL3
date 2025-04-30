"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { dynamicFontSize } from "utils/dynamicFonrsize";

const CategoryContext = createContext<string[] | undefined>(undefined);

export const CategoryProvider = ({ categories, children }: { categories: string[]; children: React.ReactNode }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dynamicFontSize();
    setLoaded(true);
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
