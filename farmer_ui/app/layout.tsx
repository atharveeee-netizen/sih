import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import './globals.css';

// Same family as the KVIC portal. 300 carries the large headings, the
// rest carry labels and running text.
const plex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plex',
  display: 'swap',
});

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
      <body className={`${plex.variable} antialiased bg-ground selection:bg-gov-blue selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
