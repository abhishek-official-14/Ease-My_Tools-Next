import { MdOutlineCurrencyExchange } from "react-icons/md"
import { Tool } from "@/types/tool"

export const currency_converter: Tool = {
    name: "Currency Converter",
    slug: "currency-converter",
    icon: MdOutlineCurrencyExchange,
    primaryCategory: "finance",
    tags: [
        "finance",
        "currency",
        "exchange-rate",
        "money",
        "convert",
        "international",
        "travel",
        "business",
        "usd",
        "eur",
        "inr",
        "calculation",
    ],
    component: () => import("@/components/Tools/currency-converter"),
    seo: {
        title: "Currency Converter",
        description: "Convert currencies with up-to-date exchange rates.",
    },
    seoContent: {
        h1: "Currency Converter",
        intro: "Get live exchange rates and convert between world currencies.",
        howToUse: [
            "Enter an amount.",
            "Select source and target currencies.",
            "View the converted value.",
        ],
        features: [
            "Live rates",
            "Wide currency support",
            "Swap currencies instantly",
        ],
        benefits: [
            "Accurate travel budgeting",
            "Quick e-commerce estimates",
            "No manual rate lookups",
        ],
        useCases: [
            "Online shopping abroad",
            "Travel planning",
            "Freelance invoicing",
        ],
        faqs: [
            {
                question: "How often are rates updated?",
                answer: "Rates are fetched from a reliable source and updated regularly.",
            },
            {
                question: "Does it include cryptocurrencies?",
                answer: "Currently only fiat currencies are supported.",
            },
        ],
        relatedTools: [
            { slug: "unit-converter", name: "Unit Converter" },
            {
                slug: "percentage-calculator",
                name: "Percentage Calculator",
            },
        ],
    },
}
