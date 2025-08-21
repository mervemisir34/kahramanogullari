import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSidebar from "@/components/project/hero-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kahramanoğulları İnşaat - İnşaat ve Gayrimenkul",
  description: "Profesyonel inşaat ve gayrimenkul hizmetleri. Konut, ofis ve ticari proje çözümleri.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1 relative">
          {children}
          <HeroSidebar />
        </main>
        <Footer />
      </body>
    </html>
  );
}
