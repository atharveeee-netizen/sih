import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Beevil Knievel - Farmer Companion App',
  description: 'Voice-assisted, offline-first mobile app for rural beekeepers (KVIC Apiary Cluster)',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#d97706',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased bg-amber-50 selection:bg-amber-300">
        {children}
      </body>
    </html>
  );
}
