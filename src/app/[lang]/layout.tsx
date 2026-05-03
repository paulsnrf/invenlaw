import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });

export const metadata: Metadata = {
  title: "Invenlaw — Dokumen Hukum Profesional",
  description: "Platform template dokumen hukum digital terlengkap di Indonesia. Akses seumur hidup dengan satu kali pembayaran.",
  icons: {
    icon: "/inven.svg",
    apple: "/inven.svg",
  },
};

import { AuthProvider } from "@/components/AuthProvider";
import { DictionaryProvider } from "@/components/DictionaryProvider";
import { i18n } from "@/i18n-config";
import { getDictionary } from "@/lib/dictionary";
import type { Locale } from "@/i18n-config";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang} className={`${inter.variable} ${syne.variable}`}>
      <body className="min-h-screen flex flex-col">
        <DictionaryProvider dict={dict} lang={lang}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </DictionaryProvider>
      </body>
    </html>
  );
}
