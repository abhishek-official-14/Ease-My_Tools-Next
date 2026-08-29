import { TbVectorBezier } from "react-icons/tb"
import { Tool } from "@/types/tool"

export const hash_generator: Tool = {
    name: "Hash Generator",
    slug: "hash-generator",
    icon: TbVectorBezier,
    primaryCategory: "security",
    tags: [
        "security",
        "hash",
        "checksum",
        "sha256",
        "sha1",
        "md5",
        "cryptography",
        "integrity",
        "fingerprint",
        "verification",
        "digest",
    ],
    component: () => import("@/components/Tools/hash-generator"),
    seo: {
        title: "Hash Generator",
        description: "Generate secure hashes for text input.",
    },
    seoContent: {
        h1: "Hash Generator",
        intro: "Compute MD5, SHA-1, SHA-256, and other hashes from any text.",
        howToUse: ["Enter text.", "Select algorithm.", "Copy the hash."],
        features: [
            "Multiple algorithms",
            "Instant generation",
            "Copy to clipboard",
        ],
        benefits: [
            "Verify file integrity",
            "Obfuscate data",
            "No server needed",
        ],
        useCases: [
            "Checksum verification",
            "Password storage (with salt)",
            "Data fingerprinting",
        ],
        faqs: [
            {
                question: "Is SHA-256 secure?",
                answer: "It’s considered cryptographically secure for many applications.",
            },
            {
                question: "Can I hash a file?",
                answer: "You can paste the file’s text content; binary hashing is not supported.",
            },
        ],
        relatedTools: [
            { slug: "password-generator", name: "Password Generator" },
            { slug: "base64-converter", name: "Base64 Converter" },
        ],
    },
}
