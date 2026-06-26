import { FaTextHeight } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const lorem_ipsum_generator: Tool = {
    name: "Lorem Ipsum Generator",
    slug: "lorem-ipsum-generator",
    icon: FaTextHeight,
    primaryCategory: "text",
    tags: [
        "text",
        "writing",
        "placeholder",
        "lorem-ipsum",
        "content",
        "dummy-text",
        "typography",
        "design",
        "ui",
        "wireframe",
        "mockup",
        "copywriting",
    ],
    component: () => import("@/components/Tools/lorem-ipsum-generator"),
    seo: {
        title: "Lorem Ipsum Generator",
        description: "Generate placeholder lorem ipsum text quickly.",
    },
    seoContent: {
        h1: "Lorem Ipsum Generator",
        intro: "Create dummy text for design mockups and layouts.",
        howToUse: [
            "Specify paragraphs, words, or bytes.",
            "Click generate.",
            "Copy the text.",
        ],
        features: [
            "Customizable length",
            "Classic Lorem Ipsum",
            "Instant copy",
        ],
        benefits: [
            "Filler text without distraction",
            "Faster mockup creation",
            "Consistent formatting",
        ],
        useCases: ["UI prototypes", "Print layouts", "Content placeholders"],
        faqs: [
            {
                question: "Can I generate in other languages?",
                answer: "Currently it generates traditional Latin-like placeholder text.",
            },
            {
                question: "Is there a word limit?",
                answer: "You can generate up to a reasonable amount for browser performance.",
            },
        ],
        relatedTools: [
            { slug: "word-counter", name: "Word Counter" },
            { slug: "text-diff-checker", name: "Text Diff Checker" },
        ],
    },
}
