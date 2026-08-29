import { FaGlobe } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const url_encoder: Tool = {
    name: "URL Encoder",
    slug: "url-encoder",
    icon: FaGlobe,
    primaryCategory: "developer",
    tags: [
        "developer",
        "url",
        "encoding",
        "decode",
        "web",
        "query-parameters",
        "api",
        "http",
        "uri",
        "percent-encoding",
        "debugging",
    ],
    component: () => import("@/components/Tools/url-encoder"),
    seo: {
        title: "URL Encoder",
        description: "Encode and decode URL components.",
    },
    seoContent: {
        h1: "URL Encoder",
        intro: "Encode special characters for safe URLs, or decode them back.",
        howToUse: [
            "Paste a URL or string.",
            "Choose encode or decode.",
            "Copy the result.",
        ],
        features: [
            "Encode/decode toggle",
            "Preserves structure",
            "One-click copy",
        ],
        benefits: [
            "Clean query parameters",
            "Prevent broken links",
            "Essential for web dev",
        ],
        useCases: [
            "Building API requests",
            "Sharing complex URLs",
            "Debugging redirects",
        ],
        faqs: [
            {
                question: "Does it encode spaces as %20 or +?",
                answer: "It uses percent-encoding as per the encodeURIComponent standard.",
            },
            {
                question: "Can I decode a full URL?",
                answer: "Yes, but be careful with already decoded parts.",
            },
        ],
        relatedTools: [
            { slug: "base64-converter", name: "Base64 Converter" },
            { slug: "ssl-checker", name: "SSL Checker" },
        ],
    },
}
