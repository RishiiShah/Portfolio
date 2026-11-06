import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.1.221"],
  // Old /resume.pdf links 404 in GSC ("Discovered - currently not indexed").
  // Send crawlers to the homepage until a real PDF is hosted.
  async redirects() {
    return [{ source: "/resume.pdf", destination: "/", permanent: true }];
  },
};

export default nextConfig;
