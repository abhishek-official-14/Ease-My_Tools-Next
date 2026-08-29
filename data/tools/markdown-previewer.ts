import { BiCodeAlt } from "react-icons/bi"
import { Tool } from "@/types/tool"

export const markdown_previewer: Tool = {
    name: "Markdown Previewer",
    slug: "markdown-previewer",
    icon: BiCodeAlt,
    primaryCategory: "text",
    tags: [
        "text",
        "markdown",
        "writing",
        "documentation",
        "preview",
        "editor",
        "html",
        "readme",
        "github",
        "formatting",
        "notes",
        "blogging",
    ],
    component: () => import("@/components/Tools/markdown-previewer"),
    seo: {
        title: "Markdown Previewer",
        description: "Preview rendered markdown as you type.",
    },
    seoContent: {
        h1: "Markdown Previewer",
        intro: "Write markdown and see a live HTML preview side by side.",
        howToUse: [
            "Write or paste markdown",
            "Preview updates instantly",
            "Use toolbar for formatting",
            "Copy or download markdown",
        ],
        features: [
            "Live markdown preview",
            "GFM support",
            "Formatting toolbar",
            "Word & character count",
            "Copy & download support",
            "Responsive layout",
        ],
        benefits: [
            "Fast markdown editing",
            "Instant preview updates",
            "Works fully in browser",
        ],
        useCases: [
            "README writing",
            "Documentation",
            "Markdown notes",
            "Blog drafting",
        ],
        faqs: [
            {
                question: "Does it support GitHub Markdown?",
                answer: "Yes, it supports most GFM features.",
            },
            {
                question: "Is my data private?",
                answer: "Yes, everything runs locally in your browser.",
            },
            {
                question: "Can I download markdown?",
                answer: "Yes, you can export as a .md file.",
            },
            {
                question: "Does it work on mobile?",
                answer: "Yes, it is fully responsive.",
            },
        ],
        relatedTools: [
            { slug: "word-counter", name: "Word Counter" },
            { slug: "text-diff-checker", name: "Text Diff Checker" },
        ],
    },
}
