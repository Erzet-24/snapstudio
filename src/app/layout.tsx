import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SnapStudio – Interactive Web Photobooth",
  description: "Ambil foto dari browser, pilih filter, desain photo strip, dan simpan ke gallery pribadimu.",
};

export const viewport: Viewport = { themeColor: "#FFF7EC", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Pacifico&family=Caveat:wght@500;700&family=Playfair+Display:wght@600&family=Courier+Prime:wght@700&display=swap"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
