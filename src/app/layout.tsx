import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Snapcapture – Interactive Web Photobooth",
  description: "Ambil foto dari browser, pilih filter, desain photo strip, dan simpan ke gallery pribadimu.",
};

export const viewport: Viewport = { themeColor: "#FFF7EC", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
        {process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY && (
          <Script
            src="https://app.sandbox.midtrans.com/snap/snap.js"
            data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
