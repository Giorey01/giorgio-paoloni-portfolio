import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { JetBrains_Mono } from 'next/font/google';
import Header from "@/app/header";
import Footer from "@/app/footer";
import "./globals.css";

const garamond = Cormorant_Garamond({
  weight: "400",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  weight: '400', // Puoi specificare il peso (400 per Regular)
  subsets: ['latin'], // Puoi specificare i subset necessari
});

export const metadata: Metadata = {
  title: "Joji'trips",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" className="relative min-h-screen bg-[#EEEDEB] text-[#2F3645]">
        <body className={jetBrainsMono.className}>
          <div className="w-full flex justify-center">
            <Header />
          </div>
          <div className="mb-16">{children}</div>
          <Footer />
        </body>
      </html>
    </>
  );
}
