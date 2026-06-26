import { TbFavicon } from "react-icons/tb"
import { Tool } from "@/types/tool"

export const favicon_generator: Tool = {
    name: "FaviconGenerator",
    slug: "favicon-generator",
    icon: TbFavicon,
    primaryCategory: "web",
    tags: [
        "web",
        "image",
        "favicon",
        "icon",
        "branding",
        "website",
        "browser",
        "seo",
        "pwa",
        "logo",
        "design",
    ],
    component: () => import("@/components/Tools/favicon-generator"),
    seo: {
        title: "Favicon Generator",
        description: "Create and export favicons for your site.",
    },
    seoContent: {
        h1: "Favicon Generator",
        intro: "Turn an image into a multi-size favicon package for websites.",
        howToUse: [
            "Upload an image.",
            "Preview favicon sizes.",
            "Download the .ico and PNGs.",
        ],
        features: [
            "Multiple sizes",
            "ICO and PNG output",
            "Instant generation",
        ],
        benefits: [
            "Professional site branding",
            "Better bookmark display",
            "Time saver",
        ],
        useCases: ["New website launch", "Rebranding", "PWA icons"],
        faqs: [
            {
                question: "What image should I upload?",
                answer: "A square image at least 260x260 px works best.",
            },
            {
                question: "Do I need an .ico file?",
                answer: "The tool provides both .ico and modern PNG sizes.",
            },
        ],
        relatedTools: [
            { slug: "image-resizer", name: "Image Resizer" },
            { slug: "svg-converter", name: "SvgConverter" },
        ],
    },
}
