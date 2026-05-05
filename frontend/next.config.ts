import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
    API_INTERNAL_URL: process.env.API_INTERNAL_URL ?? "http://localhost:8000",
  },
};

export default nextConfig;
