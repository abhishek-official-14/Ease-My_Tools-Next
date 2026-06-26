import { BiText } from "react-icons/bi"
import { Tool } from "@/types/tool"

export const text_diff_checker: Tool = {
    name: "Text Diff Checker",
    slug: "text-diff-checker",
    icon: BiText,
    primaryCategory: "text",
    tags: [
        "text",
        "compare",
        "difference",
        "diff",
        "changes",
        "revision",
        "editing",
        "versioning",
        "documents",
        "comparison",
        "review",
    ],
    component: () => import("@/components/Tools/text-diff-checker"),
    seo: {
        title: "Text Diff Checker",
        description: "Compare text and highlight differences.",
    },
    seoContent: {
        h1: "Text Diff Checker",
        intro: "Compare two text blocks and see added, removed, and unchanged lines.",
        howToUse: [
            "Paste original text.",
            "Paste modified text.",
            "Compare and view differences.",
        ],
        features: [
            "Word, line, and character comparison",
            "Unified and split diff view",
            "Color-highlighted changes",
            "Copy diff results",
        ],
        benefits: [
            "Find changes quickly",
            "Helpful for editing and code review",
            "Works directly in browser",
        ],
        useCases: ["Code comparison", "Document revisions", "Article editing"],
        faqs: [
            {
                question: "Can I compare large text?",
                answer: "Yes, you can compare long text content easily.",
            },
            {
                question: "Does it support line comparison?",
                answer: "Yes, you can compare by words, lines, or characters.",
            },
        ],
        relatedTools: [
            { slug: "word-counter", name: "Word Counter" },
            { slug: "markdown-previewer", name: "Markdown Previewer" },
            { slug: "case-converter", name: "Case Converter" },
        ],
    },
}
