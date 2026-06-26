import CookiePolicy from "@/components/CookiePolicy"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "EaseMyTools - Cookie Policy",
    description: "Use the Cookie Policy tool on EaseMyTools.",
}

export default function Page() {
    return <CookiePolicy />
}
