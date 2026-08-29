import type { ComponentType } from "react"
import type { LucideIcon } from "lucide-react"

import { SpecialTag } from "./category"

export interface ToolHeroData {
    slug: string
    name: string

    seo: {
        title: string
        description: string
    }

    seoContent: {
        h1: string
        intro: string
    }
}

export interface Tool {
    name: string
    slug: string
    icon: LucideIcon
    tags: string[]
    primaryCategory: SpecialTag
    color?: string
    component: () => Promise<{ default: ComponentType<ToolHeroProps> }>

    seo: {
        title: string
        description: string
    }

    seoContent: {
        h1: string
        intro: string
        howToUse: string[]
        features: string[]
        benefits: string[]
        useCases: string[]
        faqs: {
            question: string
            answer: string
        }[]

        relatedTools: {
            slug: string
            name: string
        }[]
    }
}

export type ToolMetadata = Omit<Tool, "icon">

export interface ToolHeroProps {
    tool: ToolHeroData
}
