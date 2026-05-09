import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StickyContact } from "@/components/layout/StickyContact";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { siteConfig } from "@/data/site-config";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.companyName} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.companyName}`,
  },
  description:
    "Professional plumbing services in Austin, TX. Emergency repairs, drain cleaning, water heaters, and more. Licensed, insured, and available 24/7.",
  keywords: ["plumbing", "plumber", "Austin TX", "emergency plumber", "drain cleaning", "water heater"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <StickyContact />
        </ThemeProvider>
      </body>
    </html>
  );
}
