import { FaPalette } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const color_picker: Tool = {
    name: "Color Picker",
    slug: "color-picker",
    icon: FaPalette,
    primaryCategory: "image",
    tags: [
        "image",
        "design",
        "color",
        "palette",
        "hex",
        "rgb",
        "hsl",
        "css",
        "ui",
        "branding",
        "graphics",
        "web",
    ],
    component: () => import("@/components/Tools/color-picker"),
    seo: {
        title: "Color Picker",
        description: "Use the Color Picker tool on EaseMyTools.",
    },
    seoContent: {
        h1: "Color Picker",
        intro: "Pick, convert, and copy colors in multiple formats.",
        howToUse: [
            "Use the color wheel or enter a value.",
            "Adjust the shade.",
            "Copy the hex, RGB, or HSL code.",
        ],
        features: [
            "Interactive color wheel",
            "Multiple color formats",
            "Live preview",
        ],
        benefits: [
            "Quick color extraction",
            "Helpful for design workflows",
            "No install needed",
        ],
        useCases: ["UI/UX design", "Brand palette creation", "CSS styling"],
        faqs: [
            {
                question: "Can I see complementary colors?",
                answer: "The tool focuses on picking and converting; complementary generation may be added later.",
            },
            {
                question: "Is the picked color saved?",
                answer: "You can copy the value; the page does not store history.",
            },
        ],
        relatedTools: [
            { slug: "svg-converter", name: "SvgConverter" },
            { slug: "image-to-svg", name: "ImageToSvg" },
        ],
    },
}
