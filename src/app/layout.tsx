import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Sistem Logbook Harian KKN 117 Nambaru",
  description: "Dokumentasi resmi seluruh kegiatan Posko KKN 117 Nambaru",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
