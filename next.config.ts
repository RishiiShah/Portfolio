import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.1.221"],
};

export default nextConfig;
