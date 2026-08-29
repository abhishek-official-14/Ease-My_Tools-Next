import { FaTextHeight } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const text_extractor: Tool = {
    name: "Text Extractor",
    slug: "text-extractor",
    icon: FaTextHeight,
    primaryCategory: "text",
    tags: [
        "text",
        "document",
        "extract",
        "ocr",
        "image",
        "pdf",
        "scan",
        "recognition",
        "content",
        "documents",
        "conversion",
    ],
    component: () => import("@/components/Tools/text-extractor"),
    seo: {
        title: "Text Extractor",
        description: "Extract text from supported file formats.",
    },
    seoContent: {
        h1: "Text Extractor",
        intro: "Pull plain text from documents, images (via OCR), or code files.",
        howToUse: [
            "Upload a file.",
            "Wait for extraction.",
            "Copy or download the text.",
        ],
        features: ["OCR support", "Plain text output", "Multiple formats"],
        benefits: [
            "Recover editable text",
            "No manual retyping",
            "Broad file support",
        ],
        useCases: [
            "Scanning printed documents",
            "Extracting code comments",
            "Reusing old PDFs",
        ],
        faqs: [
            {
                question: "Does it keep formatting?",
                answer: "It extracts raw text; formatting may be lost.",
            },
            {
                question: "Which image formats work for OCR?",
                answer: "JPG and PNG with clear text yield best results.",
            },
        ],
        relatedTools: [
            {
                slug: "pdf-image-extractor",
                name: "PDF Image Extractor",
            },
            { slug: "word-counter", name: "Word Counter" },
        ],
    },
}
