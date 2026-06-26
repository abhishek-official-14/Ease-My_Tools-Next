import Register from "@/components/Register"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "EaseMyTools - Register",
    description: "Create your EaseMyTools account.",
}

export default function Page() {
    return <Register />
}
