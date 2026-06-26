import { FaQrcode } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const qr_code_tool: Tool = {
    name: "QR Code Tool",
    slug: "qr-code-tool",
    icon: FaQrcode,
    primaryCategory: "image",
    tags: [
        "qr",
        "barcode",
        "sharing",
        "url",
        "contact",
        "wifi",
        "marketing",
        "mobile",
        "business",
        "encoding",
        "payment",
        "digital",
    ],
    component: () => import("@/components/Tools/qr-code-tool"),
    seo: {
        title: "QR Code Tool",
        description: "Generate downloadable QR codes online.",
    },
    seoContent: {
        h1: "QR Code Tool",
        intro: "Create QR codes for URLs, text, and contact info.",
        howToUse: [
            "Enter the data to encode.",
            "Customize size and color.",
            "Download the QR image.",
        ],
        features: ["URL/text encoding", "PNG download", "Simple customization"],
        benefits: ["Contactless sharing", "Marketing material", "Quick setup"],
        useCases: ["Event tickets", "Wi-Fi credentials", "Business cards"],
        faqs: [
            {
                question: "Can I add a logo in the center?",
                answer: "Basic logo overlay is supported.",
            },
            {
                question: "What’s the maximum data size?",
                answer: "QR codes have capacity limits; shorter URLs work best.",
            },
        ],
        relatedTools: [
            { slug: "url-encoder", name: "URL Encoder" },
            { slug: "base64-converter", name: "Base64 Converter" },
        ],
    },
}
