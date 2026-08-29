import { Route } from "next"
import type { LucideIcon } from "lucide-react"

export type SpecialTag =
    | "image"
    | "text"
    | "developer"
    | "file"
    | "security"
    | "web"
    | "finance"
    | "misc"

export interface Category {
    tag: SpecialTag
    title: string
    description: string
    color: string
    icon: LucideIcon
    // link: string;
    link: Route
}

export interface FeaturedCategory extends Category {
    id: string
    count: string
}
