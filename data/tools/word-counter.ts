import { AiOutlineFileText } from "react-icons/ai"
import { Tool } from "@/types/tool"

export const word_counter: Tool = {
    name: "Word Counter",
    slug: "word-counter",
    icon: AiOutlineFileText,
    primaryCategory: "text",
    tags: [
        "text",
        "writing",
        "word-count",
        "characters",
        "reading-time",
        "seo",
        "content",
        "blogging",
        "copywriting",
        "editing",
        "productivity",
    ],
    component: () => import("@/components/Tools/word-counter"),
    seo: {
        title: "Word Counter",
        description: "Count words and characters in real time.",
    },
    seoContent: {
        h1: "Word Counter",
        intro: "Count words, characters, sentences, and paragraphs instantly.",
        howToUse: [
            "Type or paste text.",
            "View live statistics.",
            "Use the reading time estimate.",
        ],
        features: [
            "Real-time counts",
            "Character and word stats",
            "Reading time",
        ],
        benefits: [
            "Stay within content limits",
            "Improve writing clarity",
            "Quick feedback",
        ],
        useCases: [
            "Essay writing",
            "Social media captions",
            "SEO meta descriptions",
        ],
        faqs: [
            {
                question: "Does it count spaces?",
                answer: "Character count can include or exclude spaces depending on the view.",
            },
            {
                question: "Can I count words in a document?",
                answer: "You can paste the text directly.",
            },
        ],
        relatedTools: [
            { slug: "case-converter", name: "Case Converter" },
            { slug: "text-diff-checker", name: "Text Diff Checker" },
            { slug: "markdown-previewer", name: "Markdown Previewer" },
        ],
    },
}
