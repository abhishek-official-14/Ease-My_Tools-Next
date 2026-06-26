import { FaBeer } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const mp4_to_gif: Tool = {
    name: "Mp4ToGif",
    slug: "mp4-to-gif",
    icon: FaBeer,
    primaryCategory: "image",
    tags: [
        "media",
        "video",
        "image",
        "gif",
        "animation",
        "convert",
        "mp4",
        "social-media",
        "content",
        "editing",
        "short-video",
        "loop",
        "sharing",
    ],
    component: () => import("@/components/Tools/mp4-to-gif"),
    seo: {
        title: "MP4 to GIF",
        description: "Convert MP4 videos to optimized GIFs online.",
    },
    seoContent: {
        h1: "Mp4ToGif",
        intro: "Turn short MP4 clips into shareable, looping GIFs.",
        howToUse: [
            "Upload an MP4 video.",
            "Trim the clip and set quality.",
            "Convert and download the GIF.",
        ],
        features: ["Trim and resize", "Quality slider", "Instant preview"],
        benefits: [
            "Lightweight GIF output",
            "Perfect for social sharing",
            "No watermark",
        ],
        useCases: ["Reaction GIFs", "Product demos", "Social media posts"],
        faqs: [
            {
                question: "Is there a file size limit?",
                answer: "Large files may be processed slowly; keep videos under a few minutes for best results.",
            },
            {
                question: "Can I adjust the frame rate?",
                answer: "Yes, you can choose the FPS for the output GIF.",
            },
        ],
        relatedTools: [
            {
                slug: "video-thumbnail-generator",
                name: "Video Thumbnail Generator",
            },
            { slug: "image-compressor", name: "Image Compressor" },
        ],
    },
}
