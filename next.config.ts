import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/tajik-vocab-app',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
