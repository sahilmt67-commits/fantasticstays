import type { NextConfig } from "next";

function storageRemotePattern() {
  try {
    const api = new URL(process.env.VILLA_API_URL || "http://127.0.0.1:8000/api/v1");
    return {
      protocol: api.protocol.replace(":", "") as "http" | "https",
      hostname: api.hostname,
      port: api.port,
      pathname: "/storage/**",
    };
  } catch {
    return null;
  }
}

const storagePattern = storageRemotePattern();

const nextConfig: NextConfig = {
  images: {
    // Laravel storage is served from 127.0.0.1:8000 in local development.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.base44.com",
      },
      {
        protocol: "https",
        hostname: "admin.fantasticstay.in",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      ...(storagePattern ? [storagePattern] : []),
    ],
    // Skip AVIF — Sharp AVIF encode is slow on first request and was delaying loads.
    formats: ["image/webp"],
    // Cap widths so we never request 2048/3840px variants for local cards/heroes.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [60, 70, 75, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
