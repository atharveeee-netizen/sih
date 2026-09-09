import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd && process.env.GITHUB_PAGES ? "/sih" : "",
  assetPrefix: isProd && process.env.GITHUB_PAGES ? "/sih/" : "",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd && process.env.GITHUB_PAGES ? "/sih" : "",
  },
};

export default nextConfig;
