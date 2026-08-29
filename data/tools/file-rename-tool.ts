import { MdOutlineDriveFileRenameOutline } from "react-icons/md"
import { Tool } from "@/types/tool"

export const file_renamer: Tool = {
    name: "File Rename Tool",
    slug: "file-rename-tool",
    icon: MdOutlineDriveFileRenameOutline,
    primaryCategory: "file",
    tags: [
        "document",
        "file",
        "rename",
        "batch",
        "organization",
        "filesystem",
        "cleanup",
        "automation",
        "naming",
        "productivity",
    ],
    component: () => import("@/components/Tools/file-rename-tool"),
    seo: {
        title: "File Rename Tool",
        description: "Batch rename files with flexible patterns.",
    },
    seoContent: {
        h1: "File Rename Tool",
        intro: "Rename multiple files at once using custom rules and patterns.",
        howToUse: [
            "Upload files.",
            "Set naming pattern.",
            "Preview and apply rename.",
        ],
        features: ["Find and replace", "Numbering sequences", "Case changes"],
        benefits: [
            "Save time on manual renaming",
            "Consistent file naming",
            "Ideal for photo sets",
        ],
        useCases: [
            "Photo organization",
            "Document archiving",
            "Project file cleanup",
        ],
        faqs: [
            {
                question: "Can I undo a rename?",
                answer: "The tool applies the new names; it’s recommended to keep backups.",
            },
            {
                question: "Does it support regular expressions?",
                answer: "Basic find-and-replace is available; regex may be added later.",
            },
        ],
        relatedTools: [
            { slug: "file-converter", name: "File Converter" },
            { slug: "csv-to-json", name: "CSV to JSON" },
        ],
    },
}
