import { FaTextHeight } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const jwt_debugger: Tool = {
    name: "JWT Debugger",
    slug: "jwt-debugger",
    icon: FaTextHeight,
    primaryCategory: "developer",
    tags: [
        "developer",
        "security",
        "jwt",
        "token",
        "authentication",
        "authorization",
        "api",
        "decode",
        "claims",
        "debugging",
        "oauth",
    ],
    component: () => import("@/components/Tools/jwt-debugger"),
    seo: {
        title: "JWT Debugger",
        description: "Decode and inspect JWT tokens safely.",
    },
    seoContent: {
        h1: "JWT Debugger",
        intro: "Decode the header and payload of a JSON Web Token without verifying signature.",
        howToUse: ["Paste a JWT.", "View decoded parts.", "Check claims."],
        features: [
            "Decode header/payload",
            "Claims display",
            "Copy decoded data",
        ],
        benefits: [
            "Understand token structure",
            "Debug authentication",
            "No backend needed",
        ],
        useCases: ["API troubleshooting", "Learning OAuth", "Token inspection"],
        faqs: [
            {
                question: "Does it verify the signature?",
                answer: "No, it only decodes; signature verification requires a secret.",
            },
            {
                question: "Is my token safe?",
                answer: "Processing happens locally in the browser.",
            },
        ],
        relatedTools: [
            { slug: "base64-converter", name: "Base64 Converter" },
            { slug: "ssl-checker", name: "SSL Checker" },
        ],
    },
}
