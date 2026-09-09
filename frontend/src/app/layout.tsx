import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Honey Chain — Blockchain Honey Traceability & Smart Beekeeping (SIH 26021)",
  description:
    "Ministry of MSME — KVIC Honey Mission: An integrated blockchain, AI, and IoT digital ecosystem for honey authenticity, QR-code verification, colony health monitoring, and rural market linkages.",
  openGraph: {
    title: "Honey Chain — Digital Honey Traceability & Smart Beekeeping Platform",
    description:
      "SIH Problem Statement 26021: Tamper-evident cryptographic ledger, smart hive IoT telemetry, AI disease detection, and QR counterfeit prevention.",
    siteName: "Honey Chain",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Honey Chain — Blockchain Honey Traceability (SIH 26021)",
    description:
      "End-to-end honey traceability from smart hive to retail consumer with cryptographic verification.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#7a8085] text-white selection:bg-[#ffc833] selection:text-[#312f28]">
        {children}
      </body>
    </html>
  );
}
