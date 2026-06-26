// lib/toolSearch.ts

import Fuse from "fuse.js"
import { SEARCHABLE_TOOLS } from "@/lib/searchables"

export const toolSearch = new Fuse(SEARCHABLE_TOOLS, {
    includeScore: true,
    threshold: 0.35,
    ignoreLocation: true,

    keys: [
        {
            name: "name",
            weight: 15,
        },

        {
            name: "tags",
            weight: 10,
        },

        {
            name: "slug",
            weight: 6,
        },

        {
            name: "seoTitle",
            weight: 8,
        },

        {
            name: "description",
            weight: 7,
        },

        {
            name: "searchText",
            weight: 3,
        },
    ],
})
