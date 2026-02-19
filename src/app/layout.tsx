import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { MockDataProvider } from "@/context/MockDataContext";
import { ToastProvider } from "@/context/ToastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CAI COID Master",
  description: "Premium COID Reclassification Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased bg-[var(--color-background)] text-[var(--color-foreground)] overflow-hidden`}
      >
        <ToastProvider>
          <MockDataProvider>
            <div className="flex h-screen w-full">
              <Sidebar />
              <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-950/50 scroll-smooth">
                  {children}
                </main>
              </div>
            </div>
          </MockDataProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
