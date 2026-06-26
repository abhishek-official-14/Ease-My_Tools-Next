import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"

import type { Tool } from "@/types/tool"

type ToolCardProps = {
    tool: Tool
}

export default function ToolCard({ tool }: ToolCardProps) {
    const Icon = tool.icon

    return (
        <Link href={`/tools/tool/${tool.slug}`}>
            <Card className="h-full cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="space-y-4 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                        </div>

                        <h3 className="text-lg font-semibold">{tool.name}</h3>
                    </div>

                    <p className="line-clamp-3 text-sm text-muted-foreground">
                        {tool.seo.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {tool.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-secondary px-2 py-1 text-xs"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
