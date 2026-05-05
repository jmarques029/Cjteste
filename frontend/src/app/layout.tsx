import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CJnet — Internet de Alta Performance",
  description:
    "A internet ultrarrápida que sua casa ou empresa precisa.",
  keywords: ["internet fibra", "provedor internet", "planos internet", "fibra óptica"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
