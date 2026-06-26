import { FaFileCode } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const json_formatter: Tool = {
    name: "JSON Formatter",
    slug: "json-formatter",
    icon: FaFileCode,
    primaryCategory: "developer",
    tags: [
        "developer",
        "json",
        "api",
        "format",
        "beautify",
        "pretty-print",
        "minify",
        "validate",
        "debugging",
        "serialization",
        "data",
    ],
    component: () => import("@/components/Tools/json-formatter"),
    seo: {
        title: "JSON Formatter",
        description: "Format and validate JSON instantly.",
    },
    seoContent: {
        h1: "JSON Formatter",
        intro: "Beautify, validate, and minify JSON data with ease.",
        howToUse: [
            "Paste JSON code.",
            "Choose format or validate.",
            "Copy the output.",
        ],
        features: ["Pretty print", "Error detection", "Minify option"],
        benefits: [
            "Readable API responses",
            "Quick debugging",
            "No install needed",
        ],
        useCases: ["API development", "Configuration files", "Data inspection"],
        faqs: [
            {
                question: "What if my JSON is invalid?",
                answer: "An error message will highlight the issue.",
            },
            {
                question: "Can it handle large JSON files?",
                answer: "It works well with typical file sizes; extremely large files may slow the browser.",
            },
        ],
        relatedTools: [
            { slug: "csv-to-json", name: "CSV to JSON" },
            { slug: "xml-formatter", name: "XML Formatter" },
            { slug: "base64-converter", name: "Base64 Converter" },
        ],
    },
}
