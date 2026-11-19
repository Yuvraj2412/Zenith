import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${geist.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F5F7FB] text-[#091930]">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
