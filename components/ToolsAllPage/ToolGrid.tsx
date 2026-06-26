import type { Tool } from "@/types/tool"

import ToolCard from "./ToolCard"

type ToolGridProps = {
    tools: Tool[]
}

export default function ToolGrid({ tools }: ToolGridProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
            ))}
        </div>
    )
}
