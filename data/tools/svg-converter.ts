import { BsFiletypeSvg } from "react-icons/bs"
import { Tool } from "@/types/tool"

export const svg_converter: Tool = {
    name: "SvgConverter",
    slug: "svg-converter",
    icon: BsFiletypeSvg,
    primaryCategory: "image",
    tags: [
        "image",
        "svg",
        "vector",
        "convert",
        "graphics",
        "icon",
        "illustration",
        "design",
        "scalable",
        "export",
        "format",
    ],
    component: () => import("@/components/Tools/svg-converter"),
    seo: {
        title: "Svg Converter",
        description: "Use the SVG Converter tool on EaseMyTools.",
    },
    seoContent: {
        h1: "Svg Converter",
        intro: "Convert SVG files to other image formats and vice versa.",
        howToUse: [
            "Upload or paste SVG code.",
            "Choose the output format.",
            "Download the converted file.",
        ],
        features: [
            "SVG to PNG/JPEG",
            "Basic format conversion",
            "Preview before download",
        ],
        benefits: [
            "Makes vector graphics more shareable",
            "Quick raster fallback",
            "Browser-based",
        ],
        useCases: [
            "Preparing icons for websites",
            "Sharing vector art",
            "Exporting for presentations",
        ],
        faqs: [
            {
                question: "Will the SVG lose quality when converted to PNG?",
                answer: "The output resolution matches your chosen size; scaling down preserves sharpness.",
            },
            {
                question: "Can I convert PNG to SVG?",
                answer: "This tool is primarily SVG to raster; for raster to SVG, try the Image to SVG tool.",
            },
        ],
        relatedTools: [
            { slug: "image-to-svg", name: "ImageToSvg" },
            { slug: "color-picker", name: "Color Picker" },
            { slug: "image-resizer", name: "Image Resizer" },
        ],
    },
}
