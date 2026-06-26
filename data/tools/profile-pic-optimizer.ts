import { FaUserCircle } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const profile_pic_optimizer: Tool = {
    name: "Profile Picture Optimizer",
    slug: "profile-pic-optimizer",
    icon: FaUserCircle,
    primaryCategory: "image",
    tags: [
        "image",
        "photo",
        "profile-picture",
        "avatar",
        "social-media",
        "crop",
        "resize",
        "portrait",
        "optimization",
        "headshot",
        "branding",
    ],
    component: () => import("@/components/Tools/profile-pic-optimizer"),
    seo: {
        title: "Profile Picture Optimizer | Perfect Size for Social Media",
        description:
            "Create perfectly sized profile pictures for WhatsApp, Instagram, Facebook, Twitter, Snapchat, and LinkedIn with smart face detection and auto-cropping.",
    },
    seoContent: {
        h1: "Profile Picture Optimizer",
        intro: "Crop, resize, and enhance profile photos for social platforms in one click.",
        howToUse: [
            "Upload your photo.",
            "Select the platform or custom size.",
            "Adjust the crop and download.",
        ],
        features: [
            "Auto face detection",
            "Platform presets",
            "Optional background cleanup",
        ],
        benefits: [
            "Uniform profile appearance",
            "No manual cropping guesswork",
            "Ready-to-upload images",
        ],
        useCases: [
            "LinkedIn headshots",
            "Instagram profile pics",
            "Team page photos",
        ],
        faqs: [
            {
                question: "Does it work with group photos?",
                answer: "It works best with single-person shots, but you can manually adjust the crop area.",
            },
            {
                question: "Will the photo quality be reduced?",
                answer: "The output is optimized for social media use; noticeable loss is minimal.",
            },
        ],
        relatedTools: [
            { slug: "image-resizer", name: "Image Resizer" },
            { slug: "image-compressor", name: "Image Compressor" },
            { slug: "remove-background", name: "Remove Background" },
        ],
    },
}
