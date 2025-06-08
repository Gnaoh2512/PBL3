import type { Metadata } from "next";
import "./globals.css";
import { CategoryProvider } from "../providers/CategoryProvider";
import { AuthProvider } from "../providers/AuthProvider";
import Header from "components/header/Header";

export const metadata: Metadata = {
  title: "Nesture",
  description: "A project built for PBL3 class",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CategoryProvider>
            <Header />
            {children}
          </CategoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
