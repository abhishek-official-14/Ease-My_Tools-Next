import Link from "next/link"
import { ArrowRight, LayoutGrid } from "lucide-react"
import { ToolIcon } from "@/components/ToolIcon"
import { Button } from "@/components/ui/button"

type FeaturedTool = {
    title: string
    category: string
    description: string
    color: string // Icon text & border color
    bgColor: string // Icon background
    categoryColor: string // Category label color
    slug: string
}

const featuredTools: FeaturedTool[] = [
    {
        title: "Image Compressor",
        category: "Image Tools",
        description: "Compress images to exact target file size",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        categoryColor: "text-emerald-400/90",
        slug: "image-compressor",
    },
    {
        title: "Markdown Previewer",
        category: "Doc Tools",
        description: "Write and preview Markdown in real-time",
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        categoryColor: "text-orange-400/90",
        slug: "markdown-previewer",
    },
    {
        title: "Text Diff Checker",
        category: "Text Tools",
        description: "Compare two texts and highlight differences",
        color: "text-pink-400",
        bgColor: "bg-pink-500/10",
        categoryColor: "text-pink-400/90",
        slug: "text-diff-checker",
    },
    {
        title: "Password Generator",
        category: "Security",
        description: "Create strong, secure passwords",
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        categoryColor: "text-cyan-400/90",
        slug: "password-generator",
    },
    {
        title: "QR Code Generator",
        category: "Utility Tools",
        description: "Generate customized QR codes instantly",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        categoryColor: "text-purple-400/90",
        slug: "qr-code-tool",
    },
    {
        title: "JSON Formatter",
        category: "Dev Tools",
        description: "Format, validate, and beautify JSON",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        categoryColor: "text-blue-400/90",
        slug: "json-formatter",
    },
    {
        title: "Palette Generator",
        category: "Design Tools",
        description: "Extract and generate harmonic color schemes",
        color: "text-rose-400",
        bgColor: "bg-rose-500/10",
        categoryColor: "text-rose-400/90",
        slug: "color-picker",
    },
    {
        title: "Unit Converter",
        category: "Math & Units",
        description: "Convert length, area, speed, and weights",
        color: "text-indigo-400",
        bgColor: "bg-indigo-500/10",
        categoryColor: "text-indigo-400/90",
        slug: "unit-converter",
    },
]

export default function FeaturedTools() {
    return (
        <section className="relative overflow-hidden bg-background py-5 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-[1260px] px-3 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                        Most Popular Tools
                    </h2>
                    <p className="mt-1.5 text-xs text-muted-foreground sm:mt-3 sm:text-base lg:text-lg">
                        Try our most loved tools trusted by thousands
                    </p>
                </div>

                {/* Grid - 2 Column on Mobile (TinyWow Style) | 4 Column on Desktop */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 md:grid-cols-3 lg:mt-12 lg:grid-cols-4 lg:gap-6">
                    {featuredTools.map((tool) => (
                        <Link
                            key={tool.slug}
                            href={`/tools/tool/${tool.slug}`}
                            className="group relative flex flex-col justify-between rounded-xl border border-border/50 bg-card/60 p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5 sm:rounded-2xl sm:p-5 dark:bg-[#111827]/60 dark:hover:bg-[#1f2937]/70"
                        >
                            <div>
                                {/* Icon Box */}
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${tool.bgColor} ${tool.color} sm:h-12 sm:w-12 sm:rounded-xl`}
                                >
                                    <ToolIcon
                                        slug={tool.slug}
                                        className="h-5 w-5 stroke-[2] sm:h-6 sm:w-6 sm:stroke-[1.75]"
                                    />
                                </div>

                                {/* Title */}
                                <h3 className="mt-3 text-sm leading-snug font-bold text-foreground transition-colors group-hover:text-primary sm:mt-4 sm:text-base lg:text-lg">
                                    {tool.title}
                                </h3>

                                {/* Desktop-only Short Description */}
                                <p className="mt-1 hidden text-xs leading-relaxed text-muted-foreground sm:block">
                                    {tool.description}
                                </p>
                            </div>

                            {/* Category Tag (TinyWow Style) */}
                            <div className="mt-2.5 sm:mt-4">
                                <span
                                    className={`text-[11px] font-medium sm:text-xs ${tool.categoryColor}`}
                                >
                                    {tool.category}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-8 flex justify-center sm:mt-14">
                    <Button
                        asChild
                        size="lg"
                        className="w-full max-w-[280px] rounded-xl shadow-sm sm:w-auto sm:px-8"
                    >
                        <Link
                            href="/tools"
                            className="flex items-center justify-center gap-2"
                        >
                            <LayoutGrid className="h-4 w-4" />
                            <span>See All Tools</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
