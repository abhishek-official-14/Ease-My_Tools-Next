import { BsRegex } from "react-icons/bs"
import { Tool } from "@/types/tool"

export const regex_generator: Tool = {
    name: "Regex Generator",
    slug: "regex-generator",
    icon: BsRegex,
    primaryCategory: "developer",
    tags: [
        "developer",
        "regex",
        "pattern",
        "validation",
        "search",
        "text",
        "matching",
        "extraction",
        "automation",
        "debugging",
        "parsing",
    ],
    component: () => import("@/components/Tools/regex-generator"),
    seo: {
        title: "Regex Generator",
        description: "Generate and test regular expressions quickly.",
    },
    seoContent: {
        h1: "Regex Generator",
        intro: "Build and test regular expressions with live matching.",
        howToUse: [
            "Enter a sample text.",
            "Write or generate a pattern.",
            "See matches highlighted.",
        ],
        features: [
            "Pattern builder",
            "Match highlighting",
            "Common regex snippets",
        ],
        benefits: [
            "Learn regex faster",
            "Test before implementing",
            "Handy for text processing",
        ],
        useCases: ["Form validation", "Data extraction", "Log parsing"],
        faqs: [
            {
                question: "Does it support all regex flavors?",
                answer: "It uses JavaScript regex syntax.",
            },
            {
                question: "Can I save my patterns?",
                answer: "You can copy the pattern; no server-side save.",
            },
        ],
        relatedTools: [
            { slug: "text-diff-checker", name: "Text Diff Checker" },
            { slug: "json-formatter", name: "JSON Formatter" },
        ],
    },
}
