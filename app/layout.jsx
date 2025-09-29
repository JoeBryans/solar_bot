import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Solar Bot",
  description: "Solar Bot is a web application that allows you to track your solar energy consumption and generate reports.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={false}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative bg-gray-50`}
      >

        <Navbar />
        <main className="w-full min-h-screen overflow-auto text-gray-800  hide-scrollbar">
          <Toaster richColors position="top-right" />
          {children}
        </main>
      
      </body>

    </html>
  );
}
