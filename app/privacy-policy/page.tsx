import PrivacyPolicy from "@/components/PrivacyPolicy"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "EaseMyTools - Privacy Policy",
    description: "Use the Privacy Policy tool on EaseMyTools.",
}

export default function Page() {
    return <PrivacyPolicy />
}
