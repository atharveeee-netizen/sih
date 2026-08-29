import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoBasePath = process.env.NEXT_PUBLIC_BASE_PATH || (isProd ? "/sih" : "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: repoBasePath,
  assetPrefix: repoBasePath ? `${repoBasePath}/` : "",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: repoBasePath,
  },
};

export default nextConfig;
