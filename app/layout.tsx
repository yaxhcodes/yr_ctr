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
  title: "Yearly Hour Counter",
  description: "The clock is ticking...",
  icons: {
    icon: "/icon.svg",
  },
  // Add OpenGraph image metadata
  openGraph: {
    title: "Are you accelerating?",
    description: "The clock is ticking...",
    url: 'https://yr-ctr.vercel.app/',
    siteName: 'Yearly Hour Counter',
    type: 'website',
    images: [
      {
        url: "/cover.jpeg", // Path to your image in the public directory
        width: 100,
        height: 100,
        alt: "Yearly Hour Counter.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}