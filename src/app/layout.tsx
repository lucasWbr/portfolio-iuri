import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";
import FontAwesomeSetup from "@/components/FontAwesomeSetup";

export const metadata: Metadata = {
  title: "Iuri Lang Meira",
  description: "Portfolio profissional de arte e design",
  icons: {
    icon: "/icone-site.png",
    shortcut: "/icone-site.png",
    apple: "/icone-site.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <FontAwesomeSetup />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
