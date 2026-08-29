import type { ToolMetadata } from "@/types/tool"

export const ssl_checker: ToolMetadata = {
    name: "SSL Checker",
    slug: "ssl-checker",
    primaryCategory: "security",
    tags: [
        "security",
        "ssl",
        "tls",
        "certificate",
        "web",
        "domain",
        "https",
        "encryption",
        "validation",
        "website",
        "cybersecurity",
    ],
    component: () => import("@/components/Tools/ssl-checker"),
    seo: {
        title: "SSL Checker",
        description: "Check SSL certificate details for any domain.",
    },
    seoContent: {
        h1: "SSL Checker",
        intro: "Inspect the SSL certificate of a website for validity and details.",
        howToUse: [
            "Enter a domain name.",
            "Click check.",
            "View certificate info.",
        ],
        features: ["Expiry date", "Issuer details", "Certificate chain"],
        benefits: [
            "Ensure site security",
            "Avoid expired certificates",
            "Quick diagnostics",
        ],
        useCases: [
            "Website maintenance",
            "Security audits",
            "Before purchasing domains",
        ],
        faqs: [
            {
                question: "Does it check for mixed content?",
                answer: "It only retrieves certificate information, not page content.",
            },
            {
                question: "Can I check any domain?",
                answer: "Yes, as long as it has a publicly accessible SSL certificate.",
            },
        ],
        relatedTools: [
            { slug: "url-encoder", name: "URL Encoder" },
            { slug: "jwt-debugger", name: "JWT Debugger" },
        ],
    },
}
