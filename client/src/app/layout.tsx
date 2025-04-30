import type { Metadata } from "next";
import "./globals.css";
import callAPI from "utils/callAPI";
import { CategoryProvider } from "../providers/categoryProvider";
import { AuthProvider } from "../providers/authProvider";
import Header from "components/header/Header";

export const metadata: Metadata = {
  title: "Nesture",
  description: "A project built for PBL3 class",
};

async function fetchCategories(): Promise<string[]> {
  try {
    return await callAPI<string[]>(`${process.env.NEXT_PUBLIC_API_URL}/data/categories`);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await fetchCategories();

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CategoryProvider categories={categories}>
            <Header />
            {children}
          </CategoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
