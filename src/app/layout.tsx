import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LittleScoops",
  description: "Track your baby's milk powder and diaper usage",
  manifest: "/manifest.json",
  openGraph: {
    title: "LittleScoops",
    description: "Track your baby's milk powder and diaper usage",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LittleScoops",
    description: "Track your baby's milk powder and diaper usage",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LittleScoops",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#9333ea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
