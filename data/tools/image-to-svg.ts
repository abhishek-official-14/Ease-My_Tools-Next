import { TbVectorTriangle } from "react-icons/tb"
import { Tool } from "@/types/tool"

export const image_to_svg: Tool = {
    name: "ImageToSvg",
    slug: "image-to-svg",
    icon: TbVectorTriangle,
    primaryCategory: "image",
    tags: [
        "image",
        "svg",
        "vector",
        "convert",
        "trace",
        "logo",
        "icon",
        "illustration",
        "design",
        "graphics",
        "scalable",
    ],
    component: () => import("@/components/Tools/image-to-svg"),
    seo: {
        title: "Image to SVG",
        description: "Convert raster images into SVG format instantly.",
    },
    seoContent: {
        h1: "Image to SVG",
        intro: "Convert PNG, JPG, WEBP and other raster images into scalable SVG vectors with advanced tracing.",
        howToUse: [
            "Upload your image.",
            "Choose a conversion mode.",
            "Adjust SVG quality if needed.",
            "Download the generated SVG.",
        ],
        features: [
            "Advanced vector tracing",
            "Multiple conversion modes",
            "Supports common image formats",
            "Live SVG preview",
            "Editable SVG output",
        ],
        benefits: [
            "Scale images without quality loss",
            "Generate editable SVG files",
            "Perfect for logos and icons",
        ],
        useCases: [
            "Logo vectorization",
            "Converting sketches",
            "Creating SVG graphics",
        ],
        faqs: [
            {
                question: "Does it work for photographs?",
                answer: "Yes, but best results are achieved with logos, icons and illustrations.",
            },
            {
                question: "Which image formats are supported?",
                answer: "PNG, JPG, JPEG, WEBP, GIF, BMP and other common formats are supported.",
            },
        ],
        relatedTools: [
            { slug: "svg-converter", name: "SvgConverter" },
            { slug: "remove-background", name: "RemoveBackground" },
            { slug: "color-picker", name: "Color Picker" },
        ],
    },
}
