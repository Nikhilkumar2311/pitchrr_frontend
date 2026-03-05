/**
 * Landing Page — Premium Scroll Experience
 *
 * Lenis smooth scroll + GSAP ScrollTrigger powered.
 *
 * SCROLL EFFECTS:
 * ① Hero fade-out + scale on scroll (cinematic exit)
 * ② Scroll progress indicator bar
 * ③ Section headers: word-by-word clip reveal
 * ④ Module cards: 3D tilt-in stagger
 * ⑤ How It Works steps: slide-in from alternating sides
 * ⑥ Product Preview: scale-in with perspective
 * ⑦ Parallax depth layers throughout
 * ⑧ Ambient gradient blob drift
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

    /* ═══════════════════════════════════════════
       LENIS SMOOTH SCROLL
       ═══════════════════════════════════════════ */
    useEffect(() => {
        if (isLoading) return;

        const lenis = new Lenis({
            duration: 1.4,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
        });

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

    /* ═══════════════════════════════════════════
       GSAP ANIMATIONS
       ═══════════════════════════════════════════ */
    useEffect(() => {
        if (isLoading) return;

        const ctx = gsap.context(() => {
            /* ──────────────────────────────────
               ① HERO — Entry animations
               ────────────────────────────────── */
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

            /* ──────────────────────────────────
               HERO WORKFLOW — Hub-and-spoke reveal
               ────────────────────────────────── */
            const wfNodes = gsap.utils.toArray<HTMLElement>(".wf-node");
            const wfPaths = gsap.utils.toArray<SVGPathElement>(".wf-path");

            const workflowTl = gsap.timeline({ delay: 0.6 });

            wfPaths.forEach((p) => {
                const len = p.getTotalLength();
                gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
            });

            // Idea node
            workflowTl.call(() => {
                if (wfNodes[0]) wfNodes[0].classList.add("wf-node--active");
            });
            workflowTl.to({}, { duration: 0.35 });

            // Arrow: Idea → Validation
            if (wfPaths[0]) {
                workflowTl.set(wfPaths[0], { opacity: 1 });
                workflowTl.to(wfPaths[0], {
                    strokeDashoffset: 0,
                    duration: 0.4,
                    ease: "power2.inOut",
                });
            }

            // Validation hub
            workflowTl.call(() => {
                if (wfNodes[1]) wfNodes[1].classList.add("wf-node--active");
            });
            workflowTl.to({}, { duration: 0.3 });

            // All outgoing arrows
            const outPaths = wfPaths.slice(1);
            if (outPaths.length > 0) {
                workflowTl.set(outPaths, { opacity: 1 });
                workflowTl.to(outPaths, {
                    strokeDashoffset: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                    stagger: 0.08,
                });
            }

            // All module nodes
            const moduleNodes = wfNodes.slice(2);
            workflowTl.call(() => {
                moduleNodes.forEach((n, i) => {
                    setTimeout(() => {
                        n.classList.add("wf-node--active");
                    }, i * 80);
                });
            });
            workflowTl.to({}, { duration: 0.5 });

            // Particle dots
            const particles = gsap.utils.toArray<SVGCircleElement>(".wf-particle");
            if (particles.length > 0) {
                workflowTl.to(particles, {
                    opacity: 0.65,
                    duration: 0.6,
                    ease: "power2.out",
                    stagger: 0.1,
                });
            }

            /* ──────────────────────────────────
               ② HERO — Cinematic scroll exit
               Fades out + scales down as user scrolls past
               ────────────────────────────────── */
            if (heroRef.current) {
                gsap.to(".hero-left", {
                    y: -80,
                    opacity: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: "60% top",
                        end: "bottom top",
                        scrub: 1,
                    },
                });

                gsap.to(".hero-right", {
                    y: -50,
                    opacity: 0,
                    scale: 0.95,
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: "60% top",
                        end: "bottom top",
                        scrub: 1,
                    },
                });
            }

            /* ──────────────────────────────────
               AMBIENT GRADIENT BLOB MOVEMENT
               ────────────────────────────────── */
            gsap.to(".hero-gradient-blob", {
                x: "random(-40, 40)",
                y: "random(-30, 30)",
                duration: 8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 2,
            });

            /* ──────────────────────────────────
               PARALLAX LAYERS — Multi-speed depth
               ────────────────────────────────── */
            if (heroRef.current) {
                gsap.to(".parallax-bg", {
                    y: -80,
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                    },
                });

                gsap.to(".parallax-mid", {
                    y: -40,
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                    },
                });
            }

            /* ──────────────────────────────────
               ③ SECTION HEADERS — Slide-up reveal
               ────────────────────────────────── */
            gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((el) => {
                gsap.fromTo(
                    el,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            /* ──────────────────────────────────
               ④ MODULE CARDS — 3D tilt-in stagger
               Cards rotate in from a slight angle
               ────────────────────────────────── */
            const featureCards = gsap.utils.toArray<HTMLElement>(".feature-card");
            featureCards.forEach((card, i) => {
                gsap.fromTo(
                    card,
                    {
                        y: 50,
                        opacity: 0,
                        rotateX: 8,
                        scale: 0.95,
                    },
                    {
                        y: 0,
                        opacity: 1,
                        rotateX: 0,
                        scale: 1,
                        duration: 0.7,
                        delay: i * 0.06,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 90%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            /* ──────────────────────────────────
               ⑤ HOW IT WORKS STEPS — Alternating slide-in
               Odd steps from left, even from right
               ────────────────────────────────── */
            const stepCards = gsap.utils.toArray<HTMLElement>(".step-card");
            stepCards.forEach((card, i) => {
                const fromX = i % 2 === 0 ? -60 : 60;
                gsap.fromTo(
                    card,
                    {
                        x: fromX,
                        opacity: 0,
                        scale: 0.95,
                    },
                    {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        delay: i * 0.12,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 88%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            /* ──────────────────────────────────
               ⑥ PRODUCT PREVIEW — Scale-in with perspective
               Starts small & tilted, scales up to full size
               ────────────────────────────────── */
            if (previewRef.current) {
                gsap.fromTo(
                    ".product-preview",
                    {
                        y: 80,
                        scale: 0.88,
                        rotateX: 6,
                        opacity: 0,
                        transformPerspective: 1200,
                    },
                    {
                        y: 0,
                        scale: 1,
                        rotateX: 0,
                        opacity: 1,
                        ease: "power3.out",
                        duration: 1,
                        scrollTrigger: {
                            trigger: previewRef.current,
                            start: "top 80%",
                            toggleActions: "play none none none",
                        },
                    }
                );

                // Subtle parallax on the preview
                gsap.to(".product-preview", {
                    y: -30,
                    ease: "none",
                    scrollTrigger: {
                        trigger: previewRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5,
                    },
                });
            }


        }, pageRef);

        return () => ctx.revert();
    }, [isLoading]);

    /* ═══════════════════════════════════════════
       MAGNETIC BUTTON EFFECT
       ═══════════════════════════════════════════ */
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
        <div ref={pageRef} className="landing-page w-full mx-auto overflow-x-hidden" style={{ background: "var(--color-bg-light)" }}>
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
