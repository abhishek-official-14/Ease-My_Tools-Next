// app/robots.ts

import type { MetadataRoute } from "next";

const BASE_URL = "https://easemytools.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",

                allow: "/",

                disallow: [
                    "/api/",
                    "/verify-email",
                    "/login",
                    "/register",
                ],
            },
        ],

        sitemap: `${BASE_URL}/sitemap.xml`,

        host: BASE_URL,
    };
}