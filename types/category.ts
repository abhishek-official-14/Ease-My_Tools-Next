import { Route } from "next"
import { IconType } from "react-icons"

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
    icon: IconType
    // link: string;
    link: Route
}

export interface FeaturedCategory extends Category {
    id: string
    count: string
}
