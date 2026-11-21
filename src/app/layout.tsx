import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "LiveIPO Options - Options Selling Management Portal",
  description: "Comprehensive options selling portal with trade journals, automated subscription management, and Google authentication.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Identity Services (GSI Client) */}
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className="min-h-screen flex flex-col bg-[#0b1120] text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
        <AppProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
