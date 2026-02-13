import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/Monster-Expedition-Map' : '';

const nextConfig: NextConfig = {
  basePath,
  output: 'export',
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
