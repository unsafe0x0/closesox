import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Closesox - GitHub Repository Explorer",
  description:
    "Search and explore GitHub repositories with custom filters and pagination to find the perfect projects for your needs.",
  keywords: [
    "GitHub",
    "Repository",
    "Explorer",
    "Search",
    "Filters",
    "Pagination",
    "Open Source",
    "Projects",
    "Developers",
    "Code",
    "unsafezero",
    "Closesox",
    "unsafe0x0",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
