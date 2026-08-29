import { TbVectorBezier } from "react-icons/tb"
import { Tool } from "@/types/tool"

export const data_uri_generator: Tool = {
    name: "Data URI Generator",
    slug: "data-uri-generator",
    icon: TbVectorBezier,
    primaryCategory: "developer",
    tags: [
        "developer",
        "file",
        "data-uri",
        "base64",
        "image",
        "embed",
        "css",
        "html",
        "web",
        "encoding",
        "inline-assets",
        "optimization",
    ],
    component: () => import("@/components/Tools/data-uri-generator"),
    seo: {
        title: "Data URI Generator",
        description: "Convert files into data URI strings.",
    },
    seoContent: {
        h1: "Data URI Generator",
        intro: "Embed images or files directly into CSS or HTML with data URIs.",
        howToUse: [
            "Upload a file.",
            "View the generated data URI.",
            "Copy the string.",
        ],
        features: ["Image to Base64 URI", "MIME type detection", "Copy button"],
        benefits: ["Fewer HTTP requests", "Inline assets", "Quick embedding"],
        useCases: ["Email signatures", "CSS backgrounds", "Single-file demos"],
        faqs: [
            {
                question: "Does it work for large files?",
                answer: "Data URIs can become very long; small files are recommended.",
            },
            {
                question: "Will the URI expire?",
                answer: "No, it’s a static string representing the file content.",
            },
        ],
        relatedTools: [
            { slug: "base64-converter", name: "Base64 Converter" },
            { slug: "image-resizer", name: "Image Resizer" },
        ],
    },
}
