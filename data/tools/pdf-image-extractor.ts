import { VscFilePdf } from "react-icons/vsc"
import { Tool } from "@/types/tool"

export const pdf_image_extractor: Tool = {
    name: "PDFImageExtractor",
    slug: "pdf-image-extractor",
    icon: VscFilePdf,
    primaryCategory: "image",
    tags: [
        "document",
        "pdf",
        "image",
        "extract",
        "graphics",
        "assets",
        "export",
        "pdf-tools",
        "documents",
        "illustrations",
        "reuse",
    ],
    component: () => import("@/components/Tools/pdf-image-extractor"),
    seo: {
        title: "PDF Image Extractor | Extract Images from PDF Files",
        description:
            "Extract embedded images from PDF files quickly for reuse in presentations, documents, and design tasks.",
    },
    seoContent: {
        h1: "PDF Image Extractor",
        intro: "Pull images out of PDF documents without manually taking screenshots page by page.",
        howToUse: [
            "Upload your PDF file.",
            "Run extraction to detect embedded images.",
            "Download selected images.",
        ],
        features: [
            "Extracts images from uploaded PDF files",
            "Simple upload and export flow",
            "Useful for document asset reuse",
        ],
        benefits: [
            "Saves manual capture time",
            "Keeps extracted visuals reusable",
            "Reduces repetitive editing work",
        ],
        useCases: [
            "Reusing report graphics",
            "Preparing training documents",
            "Collecting assets from PDF brochures",
        ],
        faqs: [
            {
                question: "Does it extract every visible graphic?",
                answer: "It extracts embedded images. Some vector-only content may need separate handling.",
            },
            {
                question: "Is my upload stored permanently?",
                answer: "The page is designed for quick processing workflows rather than long-term storage.",
            },
        ],
        relatedTools: [
            { slug: "file-converter", name: "File Converter" },
            { slug: "image-compressor", name: "Image Compressor" },
            { slug: "image-resizer", name: "Image Resizer" },
        ],
    },
}
