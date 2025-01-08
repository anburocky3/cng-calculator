import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CNG Smart Calculator",
  description: "Calculate CNG costs based on your selected district in India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>{children}</body>
    </html>
  );
}
