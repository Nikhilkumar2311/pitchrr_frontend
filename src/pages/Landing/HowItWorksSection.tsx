/**
 * How It Works Section - Redesigned
 * Horizontal 3-step layout with step numbers only (no icons), connecting line.
 */

const steps = [
    {
        number: "01",
        title: "Describe Your Idea",
        description:
            "Tell us about your startup idea in plain English. Our AI understands context and industry nuances.",
    },
    {
        number: "02",
        title: "Build with AI Guidance",
        description:
            "Work through each module with AI-powered suggestions, templates, and real-time feedback.",
    },
    {
        number: "03",
        title: "Launch with Confidence",
        description:
            "Export your pitch deck, brand kit, and strategy docs. Launch knowing you're investor-ready.",
    },
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="relative py-24 lg:py-32">
            <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-20">
                    <p
                        className="text-[13px] font-semibold uppercase tracking-[0.15em] mb-4"
                        style={{ color: "var(--color-primary-violet)", fontFamily: "var(--font-body)" }}
                    >
                        How It Works
                    </p>
                    <h2
                        className="gsap-reveal"
                        style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "clamp(2rem, 4vw, 3rem)",
                            fontWeight: 700,
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                            color: "var(--color-text-primary)",
                        }}
                    >
                        Three steps to your{" "}
                        <span className="gradient-text">startup</span>
                    </h2>
                </div>

                {/* Steps - Horizontal */}
                <div className="relative">
                    {/* Connecting line - desktop, vertically centered with step numbers */}
                    <div
                        className="hidden lg:block absolute left-[16.67%] right-[16.67%] h-[2px]"
                        style={{
                            top: "28px",
                            background: "linear-gradient(90deg, var(--color-primary-blue), var(--color-primary-violet))",
                            opacity: 0.15,
                        }}
                    />

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-8">
                        {steps.map((step, index) => (
                            <div key={step.number} className="step-card relative text-center">
                                {/* Step number */}
                                <div
                                    className="mb-6"
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        fontSize: "3.5rem",
                                        fontWeight: 800,
                                        lineHeight: 1,
                                        background: "var(--color-gradient)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                        opacity: 0.25,
                                    }}
                                >
                                    {step.number}
                                </div>

                                {/* Content */}
                                <h3
                                    className="mb-3"
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        fontSize: "1.25rem",
                                        fontWeight: 600,
                                        color: "var(--color-text-primary)",
                                    }}
                                >
                                    {step.title}
                                </h3>
                                <p
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "0.95rem",
                                        lineHeight: 1.7,
                                        color: "var(--color-text-muted)",
                                        maxWidth: "320px",
                                        margin: "0 auto",
                                        textAlign: "center",
                                    }}
                                >
                                    {step.description}
                                </p>

                                {/* Mobile connector */}
                                {index < 2 && (
                                    <div className="lg:hidden flex justify-center my-8">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-border)" }} />
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-border)" }} />
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-border)" }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}