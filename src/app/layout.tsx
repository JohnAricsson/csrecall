import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shell/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Providers } from "@/components/shell/Providers";

export const metadata: Metadata = {
  title: {
    default: "CSRecall",
    template: "%s | CSRecall",
  },
  description:
    "Interactive, zero-fluff CS interview revision hub for students and young developers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen text-stone-900 bg-[#F8F7FC] relative selection:bg-violet-100 selection:text-violet-900">
        <Providers>
          {/* Sticky app shell */}
          <Navbar />

          {/* Page content */}
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
