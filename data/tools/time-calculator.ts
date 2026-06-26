import { FaCalculator } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const time_calculator: Tool = {
    name: "Time Calculator",
    slug: "time-calculator",
    icon: FaCalculator,
    primaryCategory: "misc",
    tags: [
        "misc",
        "time",
        "duration",
        "hours",
        "minutes",
        "seconds",
        "date",
        "calculation",
        "difference",
        "schedule",
        "productivity",
    ],
    component: () => import("@/components/Tools/time-calculator"),
    seo: {
        title: "Time Calculator",
        description: "Add, subtract, and convert time values.",
    },
    seoContent: {
        h1: "Time Calculator",
        intro: "Perform time addition, subtraction, and conversion between units.",
        howToUse: [
            "Enter time values.",
            "Choose operation.",
            "Get the result.",
        ],
        features: [
            "Add/subtract hours and minutes",
            "Convert to decimal",
            "Clear reset",
        ],
        benefits: [
            "Simplify timesheet calculations",
            "Avoid time math mistakes",
            "Quick project estimates",
        ],
        useCases: ["Work hour tracking", "Event planning", "Cooking timers"],
        faqs: [
            {
                question: "Can I mix hours and minutes?",
                answer: "Yes, enter values in separate fields.",
            },
            {
                question: "Does it handle seconds?",
                answer: "Currently it focuses on hours and minutes.",
            },
        ],
        relatedTools: [
            { slug: "age-calculator", name: "Age Calculator" },
            {
                slug: "percentage-calculator",
                name: "Percentage Calculator",
            },
        ],
    },
}
