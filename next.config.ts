import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  skipTrailingSlashRedirect: true,
  images: {
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
