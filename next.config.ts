import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/project-files/:slug/:filename',
        destination: '/api/files/:slug/:filename',
      },
      {
        source: '/project-media/:slug/:filename',
        destination: '/api/media/:slug/:filename',
      },
    ]
  },
};

export default nextConfig;
