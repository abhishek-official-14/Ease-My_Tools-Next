import { MdOutlineImage } from "react-icons/md"
import { Tool } from "@/types/tool"

export const image_resizer: Tool = {
    name: "Image Resizer",
    slug: "image-resizer",
    icon: MdOutlineImage,
    primaryCategory: "image",
    tags: [
        "image",
        "photo",
        "resize",
        "crop",
        "dimensions",
        "social-media",
        "thumbnail",
        "web",
        "optimization",
        "scaling",
        "aspect-ratio",
    ],
    component: () => import("@/components/Tools/image-resizer"),
    seo: {
        title: "Image Resizer | Resize Images for Web and Social",
        description:
            "Resize JPG, PNG, WebP, and AVIF images quickly for websites, social media, and documents.",
    },
    seoContent: {
        h1: "Image Resizer",
        intro: "Resize images to exact dimensions in seconds while keeping visual quality suitable for web and sharing.",
        howToUse: [
            "Upload an image.",
            "Set width and height or choose a preset.",
            "Apply resize and download the result.",
        ],
        features: [
            "Custom width and height controls",
            "Common social and web presets",
            "Supports popular image formats",
        ],
        benefits: [
            "Faster page load times",
            "Consistent media dimensions",
            "Better fit across platforms",
        ],
        useCases: [
            "Blog and landing page assets",
            "Marketplace product photos",
            "Social media post images",
        ],
        faqs: [
            {
                question: "Will resizing reduce image quality?",
                answer: "Resizing can affect detail, but the tool is optimized to keep results clear for normal web use.",
            },
            {
                question: "Can I resize for specific platforms?",
                answer: "Yes, you can enter exact dimensions to match any platform requirement.",
            },
        ],
        relatedTools: [
            { slug: "image-compressor", name: "Image Compressor" },
            { slug: "remove-background", name: "Remove Background" },
            {
                slug: "profile-pic-optimizer",
                name: "Profile Picture Optimizer",
            },
        ],
    },
}
