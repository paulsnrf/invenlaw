import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export const metadata: Metadata = {
  title: "Invenlaw — Dokumen Hukum Profesional",
  description: "Platform template dokumen hukum digital terlengkap di Indonesia. Akses seumur hidup dengan satu kali pembayaran.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${syne.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
