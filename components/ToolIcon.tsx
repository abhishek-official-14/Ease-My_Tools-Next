import { createElement, type SVGProps } from "react"

import { getToolIcon } from "@/lib/tool-icons"

export type ToolIconProps = SVGProps<SVGSVGElement> & {
    slug: string
}

export function ToolIcon({ slug, className, ...props }: ToolIconProps) {
    return createElement(getToolIcon(slug), { className, ...props })
}
