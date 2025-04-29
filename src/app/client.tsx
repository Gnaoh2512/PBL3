"use client";

import Header from "components/header/Header";
import { AuthProvider } from "../providers/authProvider";

export default function ClientLayout({ children, categories }: { children: React.ReactNode; categories: string[] }) {
  return (
    <AuthProvider>
      <Header categories={categories} />
      {children}
    </AuthProvider>
  );
}
