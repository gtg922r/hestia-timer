import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geist = localFont({
  src: [
    {
      path: '../app/fonts/GeistVF.woff',
      weight: '400',
    }
  ],
  variable: '--font-geist',
  preload: true,
  display: 'swap',
});

const geistMono = localFont({
  src: [
    {
      path: '../app/fonts/GeistMonoVF.woff',
      weight: '400',
    }
  ],
  variable: '--font-geist-mono',
  preload: true,
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Hestia Timer",
  description: "A smart cooking timer application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="bg-white dark:bg-gray-950">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
