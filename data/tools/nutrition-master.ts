import { FaTextHeight } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const nutrition_master: Tool = {
    name: "Nutrition Master",
    slug: "nutrition-master",
    icon: FaTextHeight,
    primaryCategory: "misc",
    tags: [
        "misc",
        "health",
        "nutrition",
        "diet",
        "calories",
        "protein",
        "carbohydrates",
        "fat",
        "meal-planning",
        "fitness",
        "wellness",
        "macros",
        "food",
    ],
    component: () => import("@/components/Tools/nutrition-master"),
    seo: {
        title: "Nutrition Master",
        description: "Plan and track nutrition with smart insights.",
    },
    seoContent: {
        h1: "Nutrition Master",
        intro: "Log meals and view macro breakdowns to stay on track.",
        howToUse: [
            "Search for food items.",
            "Add to daily log.",
            "Review nutritional totals.",
        ],
        features: ["Food database", "Macro tracking", "Daily summary"],
        benefits: [
            "Achieve health goals",
            "Awareness of eating habits",
            "Convenient tracking",
        ],
        useCases: ["Weight management", "Meal prep", "Fitness planning"],
        faqs: [
            {
                question: "Is the food database comprehensive?",
                answer: "It includes common foods; you can add custom items.",
            },
            {
                question: "Can I track micronutrients?",
                answer: "The focus is on macros; vitamin tracking may be added later.",
            },
        ],
        relatedTools: [
            {
                slug: "percentage-calculator",
                name: "Percentage Calculator",
            },
            { slug: "age-calculator", name: "Age Calculator" },
        ],
    },
}
