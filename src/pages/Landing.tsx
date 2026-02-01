/**
 * Landing Page
 * 
 * The main entry point for visitors.
 * Features GSAP animations for engaging visuals.
 * 
 * SECTIONS:
 * 1. Hero - Main headline with CTA
 * 2. Features - The 7-step process
 * 3. How It Works - Visual step-by-step guide
 * 4. Benefits - Why choose Pitchrr + Testimonial
 * 5. CTA - Final call to action
 * 6. Footer - Links and info
 * 
 * GSAP ANIMATIONS:
 * - Hero text reveals on load
 * - Feature cards stagger in on scroll
 * - Benefits animate on scroll
 */

import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from '@/layout/Header';
import { HeroSection } from './Landing/HeroSection';
import { FeaturesSection } from './Landing/FeaturesSection';
import { LandingSkeleton } from '@/components/skeletons/LandingSkeleton';
import { SEO } from '@/components/common';

// Lazy load below-the-fold sections for faster initial page load
const HowItWorksSection = lazy(() => import('./Landing/HowItWorksSection').then(m => ({ default: m.HowItWorksSection })));
const BenefitsSection = lazy(() => import('./Landing/BenefitsSection').then(m => ({ default: m.BenefitsSection })));
// const CTASection = lazy(() => import('./Landing/CTASection').then(m => ({ default: m.CTASection })));
const Footer = lazy(() => import('../layout/Footer').then(m => ({ default: m.Footer })));

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
    // Refs for GSAP animations
    const heroRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const benefitsRef = useRef<HTMLDivElement>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate initial loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const ctx = gsap.context(() => {
            /**
             * HERO ANIMATION
             */
            const heroTimeline = gsap.timeline();

            // Entrance sequence
            heroTimeline.fromTo('.ai-badge',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
            );

            heroTimeline.fromTo('.hero-heading',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
                '-=0.3'
            );

            // Underline animation (drawing effect)
            heroTimeline.fromTo('.hero-underline',
                { opacity: 0, scaleX: 0 },
                { opacity: 1, scaleX: 1, duration: 0.8, transformOrigin: 'left center', ease: 'power2.out' },
                '-=0.4'
            );

            heroTimeline.fromTo('.hero-description',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
                '-=0.5'
            );

            heroTimeline.fromTo('.hero-cta',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
                '-=0.4'
            );

            heroTimeline.fromTo('.hero-trust',
                { opacity: 0 },
                { opacity: 1, duration: 0.5, ease: 'power1.out' },
                '-=0.3'
            );

            // Image entrance
            gsap.fromTo('.hero-image-container',
                { x: 50, scale: 0.95, opacity: 0 },
                { x: 0, scale: 1, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.3 }
            );

            /**
             * CONTINUOUS FLOATING ANIMATIONS
             */
            // Main image floating
            gsap.to('.hero-image-floating', {
                y: -15,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            // Decorative icons floating
            gsap.to('.hero-float-1', {
                y: -20,
                rotate: 5,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            gsap.to('.hero-float-2', {
                y: 15,
                rotate: -5,
                duration: 3.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 0.5
            });

            gsap.to('.hero-float-3', {
                y: 10,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 0.8
            });

            /**
             * FEATURE CARDS ANIMATION
             */
            gsap.from('.feature-card', {
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
            });

            /**
             * BENEFITS SECTION ANIMATION
             */
            gsap.from('.benefit-item', {
                scrollTrigger: {
                    trigger: benefitsRef.current,
                    start: 'top 80%',
                },
                x: -30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.15,
                ease: 'power2.out',
            });

        }, heroRef);

        return () => ctx.revert();
    }, [isLoading]);

    if (isLoading) {
        return <LandingSkeleton />;
    }

    return (
        <div className="bg-white w-full mx-auto overflow-x-hidden">
            <SEO
                title="AI-Powered Startup Tools"
                description="Build investor-ready pitch decks, validate startup ideas, and create winning strategies with AI. Transform your vision into a fundable startup in minutes."
                keywords="pitch deck, startup, AI, idea validation, marketing strategy, branding, investor, fundraising"
                canonical="/"
            />

            {/* Navigation Header */}
            <Header />

            {/* Hero Section */}
            <HeroSection ref={heroRef} />

            {/* Features Section */}
            <FeaturesSection ref={featuresRef} />

            {/* Below-the-fold sections - lazy loaded */}
            <Suspense fallback={null}>
                {/* How It Works Section */}
                <HowItWorksSection />

                {/* Benefits Section */}
                <BenefitsSection ref={benefitsRef} />

                {/* CTA Section */}
                {/* <CTASection /> */}

                {/* Footer */}
                <Footer />
            </Suspense>
        </div>
    );
}
