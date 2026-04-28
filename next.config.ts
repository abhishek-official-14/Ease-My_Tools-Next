import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,

    experimental: {
        typedRoutes: true,
    },

    eslint: {
        ignoreDuringBuilds: false,
    },

    typescript: {
        ignoreBuildErrors: false,
    },
};

export default nextConfig;
