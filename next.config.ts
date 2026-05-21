import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow all external image hostnames for prototype use
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
