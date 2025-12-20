import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        hostname: "images.pexels.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "frugal-octopus-136.convex.cloud",
        protocol: "https",
        port: "",
      }
    ]
  },
  cacheComponents:true
};

export default nextConfig;
