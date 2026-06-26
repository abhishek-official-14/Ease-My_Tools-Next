import { FaFile } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const csv_to_json: Tool = {
    name: "CSV to JSON",
    slug: "csv-to-json",
    icon: FaFile,
    primaryCategory: "developer",
    tags: [
        "developer",
        "csv",
        "json",
        "convert",
        "data",
        "tabular-data",
        "api",
        "database",
        "spreadsheet",
        "serialization",
        "import",
        "export",
    ],
    component: () => import("@/components/Tools/csv-to-json"),
    seo: {
        title: "CSV to JSON",
        description: "Convert CSV files into JSON format instantly.",
    },
    seoContent: {
        h1: "CSV to JSON",
        intro: "Transform comma-separated data into structured JSON objects.",
        howToUse: [
            "Upload a CSV file or paste content.",
            "Set delimiter if needed.",
            "Copy or download the JSON.",
        ],
        features: [
            "Auto-detect delimiter",
            "Preview output",
            "Download as .json",
        ],
        benefits: [
            "Data interchange ready",
            "API-friendly format",
            "Quick migration",
        ],
        useCases: [
            "Database seeding",
            "Configuration generation",
            "Data analysis prep",
        ],
        faqs: [
            {
                question: "What if my CSV uses semicolons?",
                answer: "You can specify the custom delimiter.",
            },
            {
                question: "Does it handle nested JSON?",
                answer: "It creates flat JSON arrays from rows.",
            },
        ],
        relatedTools: [
            { slug: "json-formatter", name: "JSON Formatter" },
            { slug: "xml-formatter", name: "XML Formatter" },
            { slug: "file-converter", name: "File Converter" },
        ],
    },
}
