interface FAQItem {
    question: string
    answer: string
}

interface WebApplicationOptions {
    name: string
    url: string
    description: string
}

export const createOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EaseMyTools",
    url: "https://easemytools.com",
    logo: "https://easemytools.com/EaseMyTools.svg",
})

export const createWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EaseMyTools",
    url: "https://easemytools.com",
    potentialAction: {
        "@type": "SearchAction",
        target: "https://easemytools.com/tools?query={search_term_string}",
        "query-input": "required name=search_term_string",
    },
})

export const createFAQSchema = (items: FAQItem[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
        },
    })),
})

export const createWebApplicationSchema = ({
    name,
    url,
    description,
}: WebApplicationOptions) => ({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    description,
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
})
