import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import { Geist, Geist_Mono } from "next/font/google";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "The Timekeeper",
  description: "The clock is ticking...",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Are you accelerating?",
    description: "The clock is ticking...",
    url: 'https://yr-ctr.vercel.app/',
    siteName: 'The Timekeeper',
    type: 'website',
    images: [
      {
        url: "/cover.jpeg",
        width: 100,
        height: 100,
        alt: "The Timekeeper.",
      },
    ],
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
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
        >
        {children}
        <Analytics />
      </body>
    </html>
  );
}