import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import DynamicStyles from "@/components/DynamicStyles";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portfolio - Artista",
  description: "Portfolio profissional de arte e design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body className={`${inter.variable} font-sans antialiased`}>
          <DynamicStyles />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
