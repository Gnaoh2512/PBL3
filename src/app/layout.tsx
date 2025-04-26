import type { Metadata } from "next";
import "./globals.css";
import callAPI from "utils/callAPI";
import ClientLayout from "./client";

export const metadata: Metadata = {
  title: "Nesture",
  description: "a project built for PBL3 class",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    const categories = await callAPI<string[]>(`${process.env.NEXT_PUBLIC_API_URL}/data/category`);

    return (
      <html lang="en">
        <body>
          <ClientLayout categories={categories}>{children}</ClientLayout>
        </body>
      </html>
    );
  } catch (error) {
    console.log(error);

    return (
      <html lang="en">
        <body>
          <div>Server error</div>
          {children}
        </body>
      </html>
    );
  }
}
