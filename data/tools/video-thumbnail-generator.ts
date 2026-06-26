import { FaVideo } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const video_thumbnail_generator: Tool = {
    name: "Video Thumbnail Generator",
    slug: "video-thumbnail-generator",
    icon: FaVideo,
    primaryCategory: "image",
    tags: [
        "media",
        "video",
        "thumbnail",
        "preview",
        "youtube",
        "content",
        "social-media",
        "frame",
        "image",
        "creator",
        "cover",
    ],
    component: () => import("@/components/Tools/video-thumbnail-generator"),
    seo: {
        title: "Video Thumbnail Generator | Extract Thumbnails from Videos",
        description:
            "Extract high-quality thumbnails from any video. Perfect for YouTube, social media, and content creation. Supports MP4, WebM, and more.",
    },
    seoContent: {
        h1: "Video Thumbnail Generator",
        intro: "Capture a frame from your video and save it as a thumbnail image.",
        howToUse: [
            "Upload a video file.",
            "Scrub to the desired frame.",
            "Download the thumbnail.",
        ],
        features: [
            "Frame preview",
            "Common video format support",
            "Instant extraction",
        ],
        benefits: [
            "No video editing software needed",
            "Fast content preview creation",
            "Ideal for YouTube creators",
        ],
        useCases: [
            "YouTube thumbnails",
            "Video portfolio covers",
            "Social media teasers",
        ],
        faqs: [
            {
                question: "Which video formats are supported?",
                answer: "MP4, WebM, and other common browser-supported formats.",
            },
            {
                question: "Can I extract multiple thumbnails at once?",
                answer: "Currently you can extract one frame at a time.",
            },
        ],
        relatedTools: [
            { slug: "mp4-to-gif", name: "Mp4ToGif" },
            { slug: "image-resizer", name: "Image Resizer" },
        ],
    },
}
