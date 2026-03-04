/**
 * Landing Page - Redesigned
 *
 * Premium SaaS landing page with Lenis smooth scroll,
 * GSAP animations, and velocity scroll effects.
 *
 * SECTIONS:
 * 1. Hero - Centered headline with word swap, two CTAs, velocity marquee
 * 2. Modules - 6 interactive hover-expand panels
 * 3. How It Works - Horizontal 3-step layout
 * 4. Product Preview - CSS-rendered dashboard mock
 * 5. CTA - Final minimal call to action
 * 6. Footer
 *
 * ANIMATIONS:
 * - Lenis smooth scrolling
 * - Hero text reveals on load
 * - Word swap in headline
 * - Scroll-based fade-up for all sections
 * - Magnetic button hover effect
 * - Ambient gradient blob movement
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Header } from "@/layout/Header";
import { HeroSection } from "./Landing/HeroSection";
import { ModulesSection } from "./Landing/ModulesSection";
import { HowItWorksSection } from "./Landing/HowItWorksSection";
import { ProductPreviewSection } from "./Landing/ProductPreviewSection";
import { Footer } from "@/layout/Footer";
import { LandingSkeleton } from "@/components/skeletons/LandingSkeleton";
import { SEO } from "@/components/common";
import "@/styles/landing.css";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
    const pageRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const modulesRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Initialize Lenis smooth scroll
    useEffect(() => {
        if (isLoading) return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
        });

        // Integrate Lenis with GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf as unknown as gsap.TickerCallback);
        };
    }, [isLoading]);

    // GSAP Animations
    useEffect(() => {
        if (isLoading) return;

        const ctx = gsap.context(() => {
            /**
             * HERO ANIMATIONS
             */
            const heroTl = gsap.timeline({ delay: 0.2 });

            heroTl.fromTo(
                ".hero-badge",
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
            );

            heroTl.fromTo(
                ".hero-headline",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                "-=0.2"
            );

            heroTl.fromTo(
                ".hero-subheading",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                "-=0.4"
            );

            heroTl.fromTo(
                ".hero-cta",
                { y: 25, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
                "-=0.3"
            );

            /**
             * AMBIENT GRADIENT BLOB MOVEMENT
             */
            gsap.to(".hero-gradient-blob", {
                x: "random(-40, 40)",
                y: "random(-30, 30)",
                duration: 8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 2,
            });

            /**
             * SCROLL-TRIGGERED FADE-UP FOR ALL SECTIONS
             */
            gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((el) => {
                gsap.fromTo(
                    el,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.7,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 88%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            /**
             * MODULE CARDS STAGGER
             */
            const featureCards = gsap.utils.toArray<HTMLElement>(".feature-card");
            featureCards.forEach((card, i) => {
                gsap.fromTo(
                    card,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        delay: i * 0.08,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 90%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            /**
             * STEP CARDS SEQUENTIAL
             */
            const stepCards = gsap.utils.toArray<HTMLElement>(".step-card");
            stepCards.forEach((card, i) => {
                gsap.fromTo(
                    card,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        delay: i * 0.15,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 90%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            /**
             * PRODUCT PREVIEW PARALLAX
             */
            if (previewRef.current) {
                gsap.fromTo(
                    ".product-preview",
                    { y: 40 },
                    {
                        y: -20,
                        ease: "none",
                        scrollTrigger: {
                            trigger: previewRef.current,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1,
                        },
                    }
                );
            }
        }, pageRef);

        return () => ctx.revert();
    }, [isLoading]);

    // Magnetic button effect
    useEffect(() => {
        if (isLoading) return;

        const buttons = document.querySelectorAll<HTMLElement>(".magnetic-btn");

        const handleMouseMove = (e: MouseEvent) => {
            const btn = e.currentTarget as HTMLElement;
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        };

        const handleMouseLeave = (e: MouseEvent) => {
            const btn = e.currentTarget as HTMLElement;
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.4,
                ease: "elastic.out(1, 0.5)",
            });
        };

        buttons.forEach((btn) => {
            btn.addEventListener("mousemove", handleMouseMove);
            btn.addEventListener("mouseleave", handleMouseLeave);
        });

        return () => {
            buttons.forEach((btn) => {
                btn.removeEventListener("mousemove", handleMouseMove);
                btn.removeEventListener("mouseleave", handleMouseLeave);
            });
        };
    }, [isLoading]);

    if (isLoading) {
        return <LandingSkeleton />;
    }

    return (
        <div ref={pageRef} className="landing-page bg-white w-full mx-auto overflow-x-hidden">
            <SEO
                title="AI-Powered Startup Tools"
                description="Build investor-ready pitch decks, validate startup ideas, and create winning strategies with AI. Transform your vision into a fundable startup in minutes."
                keywords="pitch deck, startup, AI, idea validation, marketing strategy, branding, investor, fundraising"
                canonical="/"
            />

            {/* Navigation */}
            <Header />

            {/* Hero Section */}
            <div ref={heroRef}>
                <HeroSection />
            </div>

            {/* Modules Section */}
            <ModulesSection ref={modulesRef} />

            {/* How It Works */}
            <HowItWorksSection />

            {/* Product Preview */}
            <ProductPreviewSection ref={previewRef} />

            {/* Footer */}
            <Footer />
        </div>
    );
}
