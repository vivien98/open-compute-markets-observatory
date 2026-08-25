import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Open Compute Markets Observatory",
  description: "An evidence-first public dashboard for AI compute supply, bottlenecks, prices, and financing conditions.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Open Compute Markets Observatory",
    description: "Where AI infrastructure meets the market.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Compute Markets Observatory",
    description: "Where AI infrastructure meets the market.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
