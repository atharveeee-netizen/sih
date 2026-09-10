/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    // Production content-hashes chunk filenames, so `immutable` is safe there.
    // Dev reuses filenames (src_12mngh9._.js) across rebuilds, so `immutable`
    // told browsers never to revalidate and they kept serving stale chunks
    // under the same URL even after a normal reload. This is what Next warns
    // about on startup ("Setting a custom Cache-Control header can break
    // Next.js development behavior").
    const isProd = process.env.NODE_ENV === "production";
    return [
      // ── Static assets: immutable cache in prod, never cached in dev ──
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: isProd
              ? "public, max-age=31536000, immutable"
              : "no-store, must-revalidate",
          },
        ],
      },
      // ── All app routes: security headers ──
      {
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none';",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
