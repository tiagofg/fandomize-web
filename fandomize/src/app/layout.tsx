// layout.tsx
import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "700",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Fandomize",
  description:
    "Transforme suas fotos em universos extraordinários com o Fandomize. Personalização e diversão para os fãs da cultura pop.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#6C5CE7] to-[#00B894]">
          <Header />
          <main className="flex flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
