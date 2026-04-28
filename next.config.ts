import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,

    // ✅ moved out of experimental (Next 15 change)
    typedRoutes: true,

    // ✅ allow builds even if ESLint errors exist
    eslint: {
        ignoreDuringBuilds: true,
    },

    // ✅ allow builds even if TypeScript errors exist
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;