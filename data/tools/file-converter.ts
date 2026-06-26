import { FaFileCsv } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const file_converter: Tool = {
    name: "File Converter",
    slug: "file-converter",
    icon: FaFileCsv,
    primaryCategory: "file",
    tags: [
        "file",
        "document",
        "convert",
        "format",
        "export",
        "import",
        "compatibility",
        "documents",
        "transformation",
    ],
    component: () => import("@/components/Tools/file-converter"),
    seo: {
        title: "File Converter | Convert Files Between Formats",
        description:
            "Convert files between supported formats quickly for sharing, compatibility, and workflow convenience.",
    },
    seoContent: {
        h1: "File Converter",
        intro: "Convert files into compatible formats so they are easier to share, upload, and use across tools.",
        howToUse: [
            "Upload your source file.",
            "Choose the target format.",
            "Run conversion and download.",
        ],
        features: [
            "Straightforward format selection",
            "Quick file processing flow",
            "Browser-based usage with no install",
        ],
        benefits: [
            "Better compatibility across platforms",
            "Faster file preparation",
            "Simpler collaboration and sharing",
        ],
        useCases: [
            "Preparing files for clients",
            "Converting documents for tools that require specific formats",
            "Normalizing assets before publishing",
        ],
        faqs: [
            {
                question: "Are all formats supported?",
                answer: "Support depends on the converter setup for this tool. Use the available options shown in the UI.",
            },
            {
                question: "Can I convert large files?",
                answer: "Large files may take longer. Keep file sizes reasonable for best performance.",
            },
        ],
        relatedTools: [
            {
                slug: "pdf-image-extractor",
                name: "PDF Image Extractor",
            },
            { slug: "csv-to-json", name: "CSV to JSON" },
            { slug: "image-compressor", name: "Image Compressor" },
        ],
    },
}
