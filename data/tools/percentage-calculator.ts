import { FaCalculator } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const percentage_calculator: Tool = {
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    icon: FaCalculator,
    primaryCategory: "finance",
    tags: [
        "finance",
        "percentage",
        "math",
        "calculation",
        "discount",
        "profit",
        "growth",
        "ratio",
        "statistics",
        "numbers",
        "business",
    ],
    component: () => import("@/components/Tools/percentage-calculator"),
    seo: {
        title: "Percentage Calculator",
        description: "Calculate percentages quickly and accurately.",
    },
    seoContent: {
        h1: "Percentage Calculator",
        intro: "Find percentages, percentage increases, and more with a simple interface.",
        howToUse: [
            "Enter the values.",
            "Choose the calculation type.",
            "View the result.",
        ],
        features: [
            "Multiple percentage formulas",
            "Clear input fields",
            "Instant result",
        ],
        benefits: [
            "Avoid manual math errors",
            "Fast discounts and tips",
            "Easy to use",
        ],
        useCases: [
            "Shopping discounts",
            "Tip calculation",
            "Grade percentages",
        ],
        faqs: [
            {
                question: "Can it calculate percentage change?",
                answer: "Yes, select the increase/decrease option.",
            },
            {
                question: "Does it show the formula?",
                answer: "The calculation uses standard formulas behind the scenes.",
            },
        ],
        relatedTools: [
            { slug: "age-calculator", name: "Age Calculator" },
            { slug: "time-calculator", name: "Time Calculator" },
            { slug: "unit-converter", name: "Unit Converter" },
        ],
    },
}
