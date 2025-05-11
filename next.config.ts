import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['encrypted-tbn0.gstatic.com'], // Add the external domain here
  },
  /* config options here */
}

export default nextConfig;
