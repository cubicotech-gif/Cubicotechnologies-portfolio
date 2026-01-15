import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cubico Technologies | Islamic Educational Content & Digital Solutions",
  description: "Transform Islamic Education with award-winning digital solutions. From Emmy-quality animations to enterprise-grade learning platforms.",
  keywords: ["Islamic education", "animations", "web development", "digital content", "educational technology"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/png" href="/images/logos/logo.png" />
      </head>
      <body className="antialiased">
        {/* Animated Background Blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-secondary/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {children}
      </body>
    </html>
  );
}
