import { FaCompress } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const image_compressor: Tool = {
    name: "Image Compressor",
    slug: "image-compressor",
    icon: FaCompress,
    primaryCategory: "image",
    tags: [
        "image",
        "photo",
        "compress",
        "optimize",
        "performance",
        "jpg",
        "jpeg",
        "png",
        "webp",
        "avif",
        "size-reduction",
        "web",
    ],
    component: () => import("@/components/Tools/image-compressor"),
    seo: {
        title: "Image Compressor | Compress Images to Exact Size",
        description:
            "Compress JPEG, PNG, WebP, and AVIF images to exact file sizes while preserving quality. Perfect for web optimization.",
    },
    seoContent: {
        h1: "Image Compressor",
        intro: "Compress image files to smaller sizes while keeping useful visual quality for websites, email, and sharing.",
        howToUse: [
            "Upload an image file.",
            "Choose target size, format, and mode.",
            "Compress and download the optimized result.",
        ],
        features: [
            "Target file size control",
            "JPEG, PNG, WebP, and AVIF options",
            "Compression modes for quality vs size",
        ],
        benefits: [
            "Faster upload and download speed",
            "Lower storage usage",
            "Improved web performance",
        ],
        useCases: [
            "Website image optimization",
            "Email attachment limits",
            "Content publishing workflows",
        ],
        faqs: [
            {
                question: "Which format gives the smallest files?",
                answer: "WebP and AVIF typically produce smaller files than older formats for many images.",
            },
            {
                question: "Can I keep metadata?",
                answer: "Yes, you can choose whether metadata is preserved when compressing.",
            },
        ],
        relatedTools: [
            { slug: "image-resizer", name: "Image Resizer" },
            { slug: "remove-background", name: "Remove Background" },
            { slug: "file-converter", name: "File Converter" },
        ],
    },
}
