import { TbVectorBezier } from "react-icons/tb"
import { Tool } from "@/types/tool"

export const password_generator: Tool = {
    name: "Password Generator",
    slug: "password-generator",
    icon: TbVectorBezier,
    primaryCategory: "security",
    tags: [
        "security",
        "password",
        "generator",
        "random",
        "strong-password",
        "credentials",
        "authentication",
        "privacy",
        "cybersecurity",
        "accounts",
        "protection",
    ],
    component: () => import("@/components/Tools/password-generator"),
    seo: {
        title: "Password Generator",
        description: "Create strong, customizable passwords instantly.",
    },
    seoContent: {
        h1: "Password Generator",
        intro: "Generate random, secure passwords with adjustable length and character sets.",
        howToUse: [
            "Set length and options.",
            "Click generate.",
            "Copy the password.",
        ],
        features: [
            "Length control",
            "Include symbols",
            "Avoid ambiguous chars",
        ],
        benefits: [
            "Stronger account security",
            "No repeated patterns",
            "Local generation",
        ],
        useCases: ["New account setup", "Password resets", "Security audits"],
        faqs: [
            {
                question: "Are the passwords stored?",
                answer: "No, they are generated in your browser and not saved.",
            },
            {
                question: "What makes a password strong?",
                answer: "Length and a mix of character types increase strength.",
            },
        ],
        relatedTools: [
            { slug: "hash-generator", name: "Hash Generator" },
            { slug: "base64-converter", name: "Base64 Converter" },
        ],
    },
}
