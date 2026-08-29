// data/featuredTags.ts

import { categoryIcons } from "@/lib/tool-icons"

import { getToolsByTag } from "./registry"
import { Category, FeaturedCategory } from "../types/category"
import { Route } from "next"

export const CATEGORIES: Category[] = [
    {
        tag: "image",
        title: "Image Tools",
        description: "Resize, optimize and edit images",
        color: "#F97316",
        icon: categoryIcons.image,
        link: "/tools/category/image" as Route,
    },
    {
        tag: "text",
        title: "Text Tools",
        description: "Writing, formatting and text analysis",
        color: "#06B6D4",
        icon: categoryIcons.text,
        link: "/tools/category/text" as Route,
    },
    {
        tag: "developer",
        title: "Developer Tools",
        description: "JSON, regex, encoders and APIs",
        color: "#EC4899",
        icon: categoryIcons.developer,
        link: "/tools/category/developer" as Route,
    },
    {
        tag: "file",
        title: "File & Document Tools",
        description: "PDFs, files and document utilities",
        color: "#3B82F6",
        icon: categoryIcons.file,
        link: "/tools/category/file" as Route,
    },
    {
        tag: "security",
        title: "Security & Privacy",
        description: "Encryption, passwords and certificates",
        color: "#F43F5E",
        icon: categoryIcons.security,
        link: "/tools/category/security" as Route,
    },
    {
        tag: "web",
        title: "Web Tools",
        description: "Website and SEO utilities",
        color: "#10B981",
        icon: categoryIcons.web,
        link: "/tools/category/web" as Route,
    },
    {
        tag: "finance",
        title: "Finance & Numbers",
        description: "Currencies, percentages and calculations",
        color: "#8B5CF6",
        icon: categoryIcons.finance,
        link: "/tools/category/finance" as Route,
    },
    {
        tag: "misc",
        title: "Misc. Tools",
        description: "Miscellanous tools",
        color: "#0D9488",
        icon: categoryIcons.misc,
        link: "/tools/category/misc" as Route,
    },
] as const

export const getFeaturedCategories = (): FeaturedCategory[] =>
    CATEGORIES.map((category) => ({
        ...category,
        id: category.tag,
        count: `${getToolsByTag(category.tag).length} tools`,
    }))
