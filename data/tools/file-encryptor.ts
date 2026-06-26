import { FaLock } from "react-icons/fa"
import { Tool } from "@/types/tool"

export const file_encryptor: Tool = {
    name: "File Encryptor & Decryptor",
    slug: "file-encryptor",
    icon: FaLock,
    primaryCategory: "security",
    tags: [
        "security",
        "encryption",
        "decryption",
        "file",
        "aes",
        "privacy",
        "password",
        "protection",
        "confidentiality",
        "cryptography",
        "secure-sharing",
    ],
    component: () => import("@/components/Tools/file-encryptor"),
    seo: {
        title: "File Encryptor & Decryptor",
        description:
            "Encrypt and decrypt files securely using AES-256 encryption directly in your browser.",
    },
    seoContent: {
        h1: "File Encryptor & Decryptor",
        intro: "Protect sensitive files with military-grade AES-256 encryption and password-based security, all processed locally in your browser.",
        howToUse: [
            "Upload one or more files.",
            "Enter a strong password.",
            "Encrypt or decrypt files instantly.",
            "Download the processed files securely.",
        ],
        features: [
            "AES-256-GCM encryption",
            "Password-protected files",
            "Batch file processing",
            "Local browser-based encryption",
            "Multiple file support",
            "Drag & drop uploads",
        ],
        benefits: [
            "Files never leave your device",
            "Strong data protection",
            "Supports all file types",
            "No account or signup required",
        ],
        useCases: [
            "Protect confidential documents",
            "Secure personal backups",
            "Encrypt files before sharing",
            "Store sensitive information safely",
        ],
        faqs: [
            {
                question: "Are my files uploaded to a server?",
                answer: "No. All encryption and decryption happen locally in your browser.",
            },
            {
                question: "Which file types are supported?",
                answer: "All common file types including images, PDFs, documents, videos, audio files, ZIP archives, and more.",
            },
        ],
        relatedTools: [
            { slug: "base64-converter", name: "Base64 Converter" },
            { slug: "hash-generator", name: "Hash Generator" },
            { slug: "file-converter", name: "File Converter" },
        ],
    },
}
