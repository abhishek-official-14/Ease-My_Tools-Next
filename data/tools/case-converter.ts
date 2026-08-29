import { MdFormatColorText } from "react-icons/md"
import { Tool } from "@/types/tool"

export const case_converter: Tool = {
    name: "Case Converter",
    slug: "case-converter",
    icon: MdFormatColorText,
    primaryCategory: "text",
    tags: [
        "text",
        "writing",
        "case",
        "uppercase",
        "lowercase",
        "title-case",
        "sentence-case",
        "camel-case",
        "snake-case",
        "format",
        "convert",
    ],
    component: () => import("@/components/Tools/case-converter"),
    seo: {
        title: "Case Converter",
        description: "Convert text casing instantly.",
    },
    seoContent: {
        h1: "Case Converter",
        intro: "Change text to uppercase, lowercase, title case, and more.",
        howToUse: [
            "Paste your text.",
            "Choose a case style.",
            "Copy the transformed text.",
        ],
        features: [
            "Multiple case styles",
            "One-click transform",
            "Preserves line breaks",
        ],
        benefits: [
            "Saves retyping effort",
            "Consistent formatting",
            "Helpful for coding and writing",
        ],
        useCases: [
            "Fixing accidental caps lock",
            "Preparing headlines",
            "Formatting code identifiers",
        ],
        faqs: [
            {
                question: "Does it support sentence case?",
                answer: "Yes, sentence case capitalizes the first letter of each sentence.",
            },
            {
                question: "Can I undo a transformation?",
                answer: "Keep your original text; the tool outputs a transformed copy.",
            },
        ],
        relatedTools: [
            { slug: "word-counter", name: "Word Counter" },
            { slug: "text-diff-checker", name: "Text Diff Checker" },
        ],
    },
}
