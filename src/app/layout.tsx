import type { Metadata } from "next";
import { Geist, Unbounded } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const akiraFallback = Unbounded({
  variable: "--font-akira",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ZENITH 2027 | IIST Inter-College Sports Fest",
  description:
    "Official sports portal for ZENITH 2027 — Indian Institute of Space Science and Technology (IIST) Inter-College Sports Fest. Explore tournaments, register teams, and track verification.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${akiraFallback.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-b from-[#071A3E] via-[#0B2559] to-[#071A3E] text-[#091930]">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
