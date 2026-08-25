// import styles from "./styles.module.css"

// const TestimonialsSection = () => {
//     const testimonials = [
//         {
//             text: "Set your custom target size and compress any image perfectly without losing quality!",
//             name: "Government Exam Aspirant",
//             role: "Verified User",
//         },
//         {
//             text: "As a student, these free tools are a lifesaver for my projects and assignments.",
//             name: "Graduate Student",
//             role: "University Student",
//         },
//         {
//             text: "The image tools are incredibly fast and produce professional-quality results.",
//             name: "Content Creator",
//             role: "Photographer",
//         },
//     ]

//     return (
//         <section className={styles["testimonials-section"]}>
//             <div className={`container`}>
//                 <h2>{"What Users Say"}</h2>
//                 <div className={styles["testimonials-grid"]}>
//                     {testimonials.map((testimonial, index) => (
//                         <div key={index} className={styles["testimonial-card"]}>
//                             <div className={styles["testimonial-content"]}>
//                                 <p>
//                                     {'"'}
//                                     {testimonial.text}
//                                     {'"'}
//                                 </p>
//                             </div>
//                             <div className={styles["testimonial-author"]}>
//                                 <strong>{testimonial.name}</strong>
//                                 <span>{testimonial.role}</span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default TestimonialsSection





// import { Card, CardContent } from "@/components/ui/card"

// const TestimonialsSection = () => {
//     const testimonials = [
//         {
//             text: "Set your custom target size and compress any image perfectly without losing quality!",
//             name: "Government Exam Aspirant",
//             role: "Verified User",
//         },
//         {
//             text: "As a student, these free tools are a lifesaver for my projects and assignments.",
//             name: "Graduate Student",
//             role: "University Student",
//         },
//         {
//             text: "The image tools are incredibly fast and produce professional-quality results.",
//             name: "Content Creator",
//             role: "Photographer",
//         },
//         {
//             text: "Instant Markdown rendering — supports text styling, quotes, lists, and code.",
//             name: "Content Editor",
//             role: "Editor",
//         },
//     ]

//     return (
//         <section className="bg-background py-16">
//             <div className="container mx-auto px-4 max-w-350">
//                 <h2 className="mb-10 text-center text-3xl font-bold">
//                     What Users Say
//                 </h2>
//                 <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//                     {testimonials.map((testimonial, index) => (
//                         <Card
//                             key={index}
//                             className="shadow-md outline-1 transition-all duration-300 hover:shadow-lg"
//                         >
//                             <CardContent className="flex h-full flex-col justify-between p-6">
//                                 <p className="mb-4 text-xl text-muted-foreground italic">
//                                     "{testimonial.text}"
//                                 </p>
//                                 <div className="mt-auto">
//                                     <strong className="block text-base text-foreground">
//                                         {testimonial.name}
//                                     </strong>
//                                     <span className="text-sm text-muted-foreground">
//                                         {testimonial.role}
//                                     </span>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default TestimonialsSection




import { Quote } from "lucide-react"

type Testimonial = {
    text: string
    name: string
    role: string
    tag: string
    tagColor: string
    iconBg: string
    iconColor: string
}

const testimonials: Testimonial[] = [
    {
        text: "Set your custom target size and compress any image perfectly without losing quality!",
        name: "Aspirant",
        role: "Govt Exam Candidate",
        tag: "Compressor",
        tagColor: "text-emerald-400/90",
        iconBg: "bg-emerald-500/10",
        iconColor: "text-emerald-400",
    },
    {
        text: "As a student, these free tools are a lifesaver for my projects and daily assignments.",
        name: "Graduate",
        role: "University Student",
        tag: "Student Life",
        tagColor: "text-orange-400/90",
        iconBg: "bg-orange-500/10",
        iconColor: "text-orange-400",
    },
    {
        text: "The image tools are incredibly fast and produce professional-quality results instantly.",
        name: "Creator",
        role: "Photographer",
        tag: "Image Tools",
        tagColor: "text-rose-400/90",
        iconBg: "bg-rose-500/10",
        iconColor: "text-rose-400",
    },
    {
        text: "Instant Markdown rendering — supports text styling, quotes, lists, and clean code blocks.",
        name: "Editor",
        role: "Content Lead",
        tag: "Markdown",
        tagColor: "text-cyan-400/90",
        iconBg: "bg-cyan-500/10",
        iconColor: "text-cyan-400",
    },
]

export default function TestimonialsSection() {
    return (
        <section className="relative overflow-hidden bg-background py-10 sm:py-16 lg:py-24">
            <div className="mx-auto max-w-[1260px] px-3 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                        What Users Say
                    </h2>
                    <p className="mt-1.5 text-sm text-muted-foreground sm:mt-3 sm:text-base lg:text-lg">
                        Real feedback from creators and developers using our tools
                    </p>
                </div>

                {/* Grid - 2 Col Mobile | 4 Col Desktop */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:mt-12 lg:grid-cols-4 lg:gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col justify-between rounded-xl border border-border/50 bg-card/60 p-3.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5 sm:rounded-2xl sm:p-5 dark:bg-[#111827]/60 dark:hover:bg-[#1f2937]/70"
                        >
                            <div>
                                {/* Quote Icon */}
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${testimonial.iconBg} ${testimonial.iconColor} sm:h-10 sm:w-10 sm:rounded-xl`}
                                >
                                    <Quote className="h-4 w-4 sm:h-5 sm:w-5" />
                                </div>

                                {/* Review Quote */}
                                <p className="mt-2.5 text-base italic leading-relaxed text-muted-foreground sm:mt-3 sm:text-lg line-clamp-3 sm:line-clamp-none">
                                    &quot;{testimonial.text}&quot;
                                </p>
                            </div>

                            {/* User Info & Category */}
                            <div className="mt-3.5 border-t border-border/40 pt-2.5 sm:mt-4 sm:pt-3">
                                <strong className="block text-xs font-semibold text-foreground sm:text-sm">
                                    {testimonial.name}
                                </strong>
                                <span className="block text-[11px] text-muted-foreground sm:text-xs truncate">
                                    {testimonial.role}
                                </span>
                                <span
                                    className={`mt-1 inline-block text-[10px] font-medium sm:text-[11px] ${testimonial.tagColor}`}
                                >
                                    {testimonial.tag}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}




