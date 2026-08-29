import { ToolIcon } from "@/components/ToolIcon"
import { cn } from "@/lib/utils"
import { ToolHeroProps } from "@/types/tool"

export default function ToolHero({ tool }: ToolHeroProps) {
    if (!tool) return null

    const title = tool.seoContent?.h1 || tool.name
    const description = tool.seoContent?.intro || tool.seo?.description

    return (
        <section>
            <div className="mx-auto mb-10 max-w-7xl text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:h-16 sm:w-16">
                    <ToolIcon
                        slug={tool.slug}
                        className="h-7 w-7 stroke-[2] sm:h-8 sm:w-8 sm:stroke-[1.75]"
                    />
                </div>
                {/* Decorative subtle glow behind title (optional UI polish) */}

                <h1
                    className={cn(
                        "mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-blue-500",
                        "sm:text-4xl md:text-5xl lg:text-6xl"
                    )}
                >
                    {title}
                </h1>

                {description && (
                    <p
                        className={cn(
                            "mx-auto mt-4 max-w-xs text-base text-slate-600",
                            "sm:text-lg md:text-lg",
                            "dark:text-slate-300",
                            "sm:max-w-4xl"
                        )}
                    >
                        {description}
                    </p>
                )}
            </div>
        </section>
    )
}
