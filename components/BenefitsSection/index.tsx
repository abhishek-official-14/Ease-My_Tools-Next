// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// type Benefit = {
//     icon: string
//     title: string
//     description: string
// }

// const benefits: Benefit[] = [
//     {
//         icon: "🔒",
//         title: "100% Secure",
//         description: "Files processed locally, never stored on servers",
//     },
//     {
//         icon: "⚡",
//         title: "Lightning Fast",
//         description: "Process files in seconds with our optimized tools",
//     },
//     {
//         icon: "🎯",
//         title: "No Watermarks",
//         description: "Get clean results without any branding",
//     },
//     {
//         icon: "💯",
//         title: "Completely Free",
//         description: "No hidden costs or subscription fees",
//     },
// ]

// export default function BenefitsSection() {
//     return (
//         <section className="bg-background py-16 dark:bg-background">
//             {/* 
//         Kept the exact same container pattern as FeaturedTools:
//         Clamped mobile width (-10%), unlocks to full screen-2xl on desktop.
//       */}
//             <div className="mx-auto max-w-[360px] px-3 sm:max-w-screen-2xl sm:px-6 lg:px-8">
//                 <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
//                     Why Choose EaseMyTools?
//                 </h2>

//                 <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//                     {benefits.map((benefit, index) => (
//                         <Card
//                             key={index}
//                             className="group relative flex h-full w-full flex-col rounded-2xl border-border/50 bg-card/80 p-8 outline-1 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/5"
//                         >
//                             <CardHeader className="flex flex-col items-center p-0 pb-4">
//                                 {/* Bigger icon (text-5xl = 3rem) exactly like the original */}
//                                 <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-5xl transition-colors group-hover:bg-primary/20">
//                                     {benefit.icon}
//                                 </div>
//                                 <CardTitle className="text-center text-xl font-bold">
//                                     {benefit.title}
//                                 </CardTitle>
//                             </CardHeader>

//                             <CardContent className="flex flex-1 flex-col items-center p-0 text-center">
//                                 <p className="text-base leading-relaxed text-muted-foreground">
//                                     {benefit.description}
//                                 </p>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     )
// }




import Link from "next/link"
import {
    Zap,
    ShieldCheck,
    Sparkles,
    CheckCircle2,
    Smartphone,
    Globe2,
    RotateCw,
    Layers,
    ArrowRight,
    LayoutGrid,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description:
            "Process files in seconds with optimized algorithms and browser-based processing.",
    },
    {
        icon: ShieldCheck,
        title: "100% Secure",
        description:
            "All processing happens locally in your browser. Your files never leave your device.",
    },
    {
        icon: Sparkles,
        title: "Completely Free",
        description:
            "No hidden costs, no watermarks, no subscription fees. Everything is free forever.",
    },
    {
        icon: CheckCircle2,
        title: "No Watermarks",
        description:
            "Get clean, professional results without any branding, badges, or watermarks.",
    },
    {
        icon: Smartphone,
        title: "Fully Responsive",
        description:
            "Optimized experience across desktop, tablet, and mobile browsers seamlessly.",
    },
    {
        icon: Globe2,
        title: "No Installation",
        description:
            "Use all tools directly in your browser without installing heavy software.",
    },
    {
        icon: RotateCw,
        title: "Real-time Processing",
        description:
            "See changes instantly with fast live preview and continuous feedback.",
    },
    {
        icon: Layers,
        title: "Professional Quality",
        description:
            "High-standard tools that produce crisp, production-grade output files.",
    },
]

export default function Features() {
    return (
        <section className="relative overflow-hidden bg-background">
            <div className="mx-auto max-w-[1260px] px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                        Powerful Features
                    </h1>
                    <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg">
                        Everything you need to simplify your digital workflow
                    </p>
                </div>

                {/* Grid */}
                <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                className="group relative flex flex-col items-center justify-start rounded-2xl border border-border/60 bg-card/60 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5 dark:bg-card/30 dark:hover:bg-card/60"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                                    <Icon className="h-7 w-7 stroke-[1.75]" />
                                </div>

                                <h3 className="mt-5 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}