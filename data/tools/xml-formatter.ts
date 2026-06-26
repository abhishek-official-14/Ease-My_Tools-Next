import { FaFileCode } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const xml_formatter: Tool = {
    name: "XML Formatter",
    slug: "xml-formatter",
    icon: FaFileCode,
    primaryCategory: "developer",
    tags: [
        "developer",
        "xml",
        "format",
        "beautify",
        "minify",
        "validate",
        "markup",
        "data",
        "api",
        "soap",
        "debugging",
    ],
    component: () => import("@/components/Tools/xml-formatter"),
    seo: {
        title: "XML Formatter",
        description: "Format and beautify XML content online.",
    },
    seoContent: {
        h1: "XML Formatter",
        intro: "Indent, validate, and minify XML documents.",
        howToUse: [
            "Paste XML data.",
            "Choose format or validate.",
            "Copy the result.",
        ],
        features: ["Pretty print", "Syntax check", "Minify output"],
        benefits: [
            "Improves readability",
            "Helps spot errors",
            "Quick developer tool",
        ],
        useCases: ["SOAP APIs", "Configuration files", "Data feeds"],
        faqs: [
            {
                question: "Can it fix invalid XML?",
                answer: "It validates but cannot automatically repair structural errors.",
            },
            {
                question: "Is there a size limit?",
                answer: "Large files may be slow; keep under a few MB.",
            },
        ],
        relatedTools: [
            { slug: "csv-to-json", name: "CSV to JSON" },
            { slug: "json-formatter", name: "JSON Formatter" },
        ],
    },
}
