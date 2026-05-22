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
    // Next 16 bloquea por SSRF las imágenes remotas que resuelven a IP
    // privada/loopback (localhost → 127.0.0.1/::1) y devuelve
    // 400 «"url" parameter is not allowed». En desarrollo el backend vive en
    // localhost:8000, así que lo permitimos solo fuera de producción; en
    // producción el host es público (tabacoyron.com) y la protección sigue activa.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
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
