import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: process.env.NODE_ENV === 'production' ? '/tajik-first-1000' : '',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
