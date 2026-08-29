import { TbFavicon } from "react-icons/tb"
import { Tool } from "@/types/tool"

export const website_cost_calculator: Tool = {
    name: "WebsiteCostCalculator",
    slug: "website-cost-calculator",
    icon: TbFavicon,
    primaryCategory: "finance",
    tags: [
        "developer",
        "web",
        "finance",
        "website",
        "development",
        "pricing",
        "budget",
        "cost",
        "business",
        "freelancing",
        "estimate",
        "agency",
    ],
    component: () => import("@/components/Tools/website-cost-calculator"),
    seo: {
        title: "Website Cost Calculator",
        description: "Estimate website development costs.",
    },
    seoContent: {
        h1: "Website Cost Calculator",
        intro: "Get a rough estimate for building a website based on features.",
        howToUse: [
            "Select desired features.",
            "Choose complexity level.",
            "View estimated cost range.",
        ],
        features: [
            "Feature-based pricing",
            "Instant estimate",
            "Transparent assumptions",
        ],
        benefits: ["Budget planning", "Compare options", "No sales calls"],
        useCases: ["Startup planning", "Client proposals", "Freelance pricing"],
        faqs: [
            {
                question: "How accurate is the estimate?",
                answer: "It provides a ballpark figure; actual costs vary by region and developer.",
            },
            {
                question: "Does it include hosting?",
                answer: "The estimate covers development; hosting and domain are separate.",
            },
        ],
        relatedTools: [
            {
                slug: "percentage-calculator",
                name: "Percentage Calculator",
            },
            { slug: "unit-converter", name: "Unit Converter" },
        ],
    },
}
