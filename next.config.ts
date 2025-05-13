import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    async headers() {
        return [
            {
                source: "/iframe",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "ALLOWALL",
                    },
                    {
                        key: "Content-Security-Policy",
                        value: "frame-ancestors *",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
