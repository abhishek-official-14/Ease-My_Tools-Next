import { FaExchangeAlt } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const unit_converter: Tool = {
    name: "Unit Converter",
    slug: "unit-converter",
    icon: FaExchangeAlt,
    primaryCategory: "finance",
    tags: [
        "finance",
        "measurement",
        "units",
        "convert",
        "length",
        "weight",
        "temperature",
        "volume",
        "distance",
        "science",
        "engineering",
        "math",
    ],
    component: () => import("@/components/Tools/unit-converter"),
    seo: {
        title: "Unit Converter",
        description: "Convert units quickly and accurately.",
    },
    seoContent: {
        h1: "Unit Converter",
        intro: "Convert between length, weight, temperature, and more.",
        howToUse: [
            "Select a category.",
            "Enter a value and choose units.",
            "See instant conversion results.",
        ],
        features: [
            "Multiple unit categories",
            "Real-time conversion",
            "Common units covered",
        ],
        benefits: [
            "No manual calculations",
            "Quick reference",
            "Works offline",
        ],
        useCases: [
            "Cooking measurements",
            "Travel distances",
            "Science homework",
        ],
        faqs: [
            {
                question: "Which categories are available?",
                answer: "Length, weight, temperature, volume, and area.",
            },
            {
                question: "Are the conversions accurate?",
                answer: "They follow standard conversion factors.",
            },
        ],
        relatedTools: [
            { slug: "currency-converter", name: "Currency Converter" },
            {
                slug: "percentage-calculator",
                name: "Percentage Calculator",
            },
        ],
    },
}
