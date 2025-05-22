import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['encrypted-tbn0.gstatic.com', 'res.cloudinary.com'], // Add the external domains here
  },
  /* config options here */
}

export default nextConfig;
