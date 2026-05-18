// app/sitemap.ts

import type { MetadataRoute } from "next";

import {
    toolsByCategory,
} from "@/data/toolsData";

const BASE_URL = "https://easemytools.com";

const LAST_MODIFIED = new Date("2026-05-15");

const STATIC_ROUTES = [
    "",
    "/tools",
    "/about",
    "/contact",
    "/blog",
    "/privacy-policy",
    "/terms-conditions",
    "/pricing",
    "/features",
    "/faq",
    "/documentation",
];

export default function sitemap(): MetadataRoute.Sitemap {
    const staticPages: MetadataRoute.Sitemap =
        STATIC_ROUTES.map((route) => ({
            url: `${BASE_URL}${route}`,

            lastModified: LAST_MODIFIED,

            changeFrequency:
                route === ""
                    ? "daily"
                    : "weekly",

            priority:
                route === ""
                    ? 1
                    : 0.8,
        }));

    

    const categoryPages: MetadataRoute.Sitemap =
        Object.keys(toolsByCategory).map(
            (category) => ({
                url: `${BASE_URL}/tools/${category}`,

                lastModified: LAST_MODIFIED,

                changeFrequency: "weekly",

                priority: 0.7,
            })
        );

    return [
        ...staticPages,
        ...categoryPages,
    ];
}