import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shell/Navbar";
import { Footer } from "@/components/shell/Footer";
import { Providers } from "@/components/shell/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CSRecall",
    template: "%s | CSRecall",
  },
  description:
    "Interactive, zero-fluff CS interview revision hub for students and young developers.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen flex flex-col text-stone-900 bg-[#3b0b18] relative selection:bg-yellow-300 selection:text-black">
        <Providers>
          {/* Sticky app shell */}
          <Navbar />

          {/* Page content */}
          <main className="flex-1 w-full">{children}</main>

          {/* Comic-arcade footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
