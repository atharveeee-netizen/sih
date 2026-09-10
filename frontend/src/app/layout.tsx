import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import GovMasthead from "@/components/GovMasthead";
import IoTStageController from "@/components/IoTStageController";
import JudgeEvaluationBrief from "@/components/JudgeEvaluationBrief";
import MobileBottomNav from "@/components/MobileBottomNav";
import { LanguageProvider } from "@/lib/LanguageContext";
import { Toaster } from "@/components/ui/sonner";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

// One institutional family, two roles. Plex has a matched mono, which this
// interface genuinely needs: transaction hashes, batch ids and lab figures sit
// beside running text on nearly every screen.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const plexDisplay = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
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
    description:
      "KVIC & National Bee Board verifiable honey authentication powered by Polygon PoS, AI quality scoring, and cryptographic QR provenance.",
    images: [{ url: "/beevil_knievel_og.png", width: 1200, height: 630, alt: "Beevil Knievel" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plexDisplay.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/beevil_knievel_icon.png" type="image/png" />
        <link rel="shortcut icon" href="/beevil_knievel_icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#06182E" />
      </head>
      <body
        className="min-h-screen bg-ground text-text-primary relative selection:bg-gov-blue selection:text-white"
        suppressHydrationWarning
      >
        <LanguageProvider>
          {/* The film-grain overlay and the decorative vertical hairlines were
              removed with the redesign. Both were texture for its own sake,
              and both are signatures of the editorial template look this
              interface is moving away from. */}
          <GovMasthead />
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
