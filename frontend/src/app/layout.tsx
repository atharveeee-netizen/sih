import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NoiseOverlay from "@/components/NoiseOverlay";
import GridLines from "@/components/GridLines";
import IoTStageController from "@/components/IoTStageController";
import JudgeEvaluationBrief from "@/components/JudgeEvaluationBrief";
import MobileBottomNav from "@/components/MobileBottomNav";
import { LanguageProvider } from "@/lib/LanguageContext";
import { Toaster } from "@/components/ui/sonner";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://beevil-knievel.vercel.app"),
  title: "Beevil Knievel — Blockchain Honey Authenticity & Provenance",
  description:
    "KVIC & National Bee Board verifiable honey authentication powered by Polygon PoS, AI quality scoring, and cryptographic QR provenance.",
  keywords: [
    "Beevil Knievel",
    "KVIC",
    "National Bee Board",
    "Honey Traceability",
    "Polygon Blockchain",
    "FSSAI Honey Purity",
    "SIH 2026",
  ],
  icons: {
    icon: [
      { url: "/beevil_knievel_icon.png", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/beevil_knievel_icon.png",
  },
  openGraph: {
    title: "Beevil Knievel — Blockchain Honey Authenticity & Provenance",
    description: "KVIC & National Bee Board verifiable honey authentication powered by Polygon PoS, AI quality scoring, and cryptographic QR provenance.",
    images: [{ url: "/beevil_knievel_og.png", width: 1200, height: 630, alt: "Beevil Knievel" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/beevil_knievel_icon.png" type="image/png" />
        <link rel="shortcut icon" href="/beevil_knievel_icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#14141A" />
      </head>
      <body
        className="min-h-screen bg-alabaster text-charcoal relative selection:bg-gold selection:text-charcoal"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <NoiseOverlay />
          <GridLines />
          <div className="relative z-10 pb-44 md:pb-0">{children}</div>
          <MobileBottomNav />
          <IoTStageController />
          <JudgeEvaluationBrief />
          <Toaster position="top-right" />
          <ServiceWorkerRegister />
        </LanguageProvider>
      </body>
    </html>
  );
}
