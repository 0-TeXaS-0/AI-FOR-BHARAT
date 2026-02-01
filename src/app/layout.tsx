import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { VendorProvider } from "@/contexts/VendorContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { AIAssistantProvider } from "@/contexts/AIAssistantContext";
import Navbar from "@/components/Navbar";
import FloatingActionButton from "@/components/FloatingActionButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multilingual Mandi | बहुभाषी मंडी",
  description: "AI-powered local trade platform with instant translation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F5F5F5] dark:bg-gray-900 transition-colors duration-300 text-gray-900 dark:text-gray-100`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <VendorProvider>
            <OrderProvider>
              <AIAssistantProvider>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1 pt-16">
                    <div className="min-h-[calc(100vh-4rem)]">
                      {children}
                    </div>
                  </main>
                  <FloatingActionButton />
                </div>
              </AIAssistantProvider>
            </OrderProvider>
          </VendorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
