import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cubico Technologies | Digital Creative Agency",
  description: "Award-winning creative studio specializing in visual artwork, logo design, and viral social media content. Transform your brand vision into digital masterpieces.",
  keywords: ["creative agency", "graphic design", "logo design", "social media content", "digital artwork", "brand identity"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="/images/logos/logo.svg" />
      </head>
      <body className="antialiased">
        {/* Cinematic Atmospheric Gradient Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Purple Gradient - Top Left */}
          <div className="absolute -top-[40%] -left-[20%] w-[800px] h-[800px] opacity-[0.06]">
            <div className="w-full h-full bg-purple-600 rounded-full blur-[120px] animate-gradient-drift-slow"></div>
          </div>

          {/* Cyan Gradient - Mid Right */}
          <div className="absolute top-[30%] -right-[15%] w-[900px] h-[900px] opacity-[0.05]">
            <div className="w-full h-full bg-cyan-500 rounded-full blur-[140px] animate-gradient-drift-medium"></div>
          </div>

          {/* Rose Gradient - Bottom Center */}
          <div className="absolute -bottom-[30%] left-[20%] w-[850px] h-[850px] opacity-[0.07]">
            <div className="w-full h-full bg-rose-500 rounded-full blur-[130px] animate-gradient-drift-long"></div>
          </div>
        </div>

        <Navigation />
        <main className="relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
