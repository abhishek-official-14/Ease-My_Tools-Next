import { TbBinaryTree } from "react-icons/tb"
import { Tool } from "@/types/tool"

export const base64_converter: Tool = {
    name: "Base64 Converter",
    slug: "base64-converter",
    icon: TbBinaryTree,
    primaryCategory: "developer",
    tags: [
        "developer",
        "base64",
        "encode",
        "decode",
        "binary",
        "text",
        "data-uri",
        "ascii",
        "utf8",
        "api",
        "serialization",
        "encoding",
    ],
    component: () => import("@/components/Tools/base64-converter"),
    seo: {
        title: "Base64 Converter",
        description: "Encode and decode Base64 data online.",
    },
    seoContent: {
        h1: "Base64 Converter",
        intro: "Encode text or files to Base64, and decode Base64 strings back.",
        howToUse: [
            "Enter text or upload a file.",
            "Choose encode or decode.",
            "Copy or download the result.",
        ],
        features: [
            "Text and file support",
            "Instant conversion",
            "Copy to clipboard",
        ],
        benefits: [
            "Data-safe encoding",
            "Works for inline images",
            "Quick developer utility",
        ],
        useCases: [
            "Embedding images in CSS",
            "API data transfer",
            "Debugging encoded payloads",
        ],
        faqs: [
            {
                question: "Is Base64 encryption?",
                answer: "No, it is an encoding method and not secure encryption.",
            },
            {
                question: "Can I convert large files?",
                answer: "The tool works best with moderate-sized inputs.",
            },
        ],
        relatedTools: [
            { slug: "json-formatter", name: "JSON Formatter" },
            { slug: "url-encoder", name: "URL Encoder" },
        ],
    },
}
