import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const apiHost = (() => {
  try {
    return new URL(apiUrl).hostname;
  } catch {
    return "localhost";
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: apiHost,
        pathname: "/static/uploads/**",
      },
      {
        protocol: "https",
        hostname: apiHost,
        pathname: "/static/uploads/**",
      },
      {
        protocol: "https",
        hostname: "tabacoyron.com",
        pathname: "/static/uploads/**",
      },
      {
        protocol: "https",
        hostname: "tabacoyronpa.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
