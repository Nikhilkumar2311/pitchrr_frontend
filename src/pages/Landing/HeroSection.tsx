/**
 * Hero Section Component - Redesigned
 * Centered typography-driven layout with word swap animation, no images.
 */

import { forwardRef, useRef, useEffect, useState } from "react";
import { useUIStore } from "@/store";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Sparkles } from "lucide-react";
import { VelocityScroll } from "@/components/ui/VelocityScroll";

const swapWords = ["Idea", "Strategy", "Pitch", "Brand", "Plan"];

export const HeroSection = forwardRef<HTMLElement>((_, ref) => {
  const { setAuthModalOpen, setAuthModalView } = useUIStore();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [wordIndex, setWordIndex] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);

  // Word swap cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % swapWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleHaveIdea = () => {
    if (isSignedIn) {
      navigate("/dashboard/idea");
    } else {
      setAuthModalView("signin");
      setAuthModalOpen(true);
    }
  };

  const handleDontHaveIdea = () => {
    if (isSignedIn) {
      navigate("/dashboard?generate=true");
    } else {
      setAuthModalView("signin");
      setAuthModalOpen(true);
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden"
      style={{
        paddingTop: "100px",
        paddingBottom: "40px",
        background: "linear-gradient(135deg, #EEF2FF 0%, #F0F4FF 25%, #F8FAFF 50%, #F3EEFF 75%, #EEF2FF 100%)",
      }}
    >
      {/* Subtle mesh/grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(79,125,243,0.07) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(122,92,255,0.06) 0%, transparent 50%),
                           radial-gradient(circle at 50% 80%, rgba(79,125,243,0.04) 0%, transparent 40%)`,
        }}
      />

      {/* Fine dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.25]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Ambient gradient blobs */}
      <div
        className="hero-gradient-blob absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full opacity-30 blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(79,125,243,0.3) 0%, transparent 70%)" }}
      />
      <div
        className="hero-gradient-blob absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full opacity-25 blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(122,92,255,0.3) 0%, transparent 70%)" }}
      />

      {/* Bottom fade to blend into page bg */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--color-bg-light))" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
        {/* Small label */}
        <div
          className="hero-badge gsap-fade inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[13px] font-medium mb-8"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-muted)",
            background: "var(--color-bg-light)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary-blue)] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary-blue)]" />
          </span>
          AI-Powered Startup Platform
        </div>

        {/* Main Headline */}
        <h1
          className="hero-headline gsap-fade"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "var(--color-text-primary)",
          }}
        >
          From{" "}
          <span className="relative inline-block">
            <span
              ref={wordRef}
              key={wordIndex}
              className="gradient-text inline-block"
              style={{
                animation: "wordFadeIn 0.5s ease-out",
              }}
            >
              {swapWords[wordIndex]}
            </span>
          </span>{" "}
          to Investor Pitch
          <br />
          in One Workspace
        </h1>

        {/* Subheading */}
        <p
          className="hero-subheading gsap-fade mt-6 mx-auto max-w-[600px]"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            lineHeight: 1.7,
            color: "var(--color-text-muted)",
          }}
        >
          Pitchrr helps founders validate ideas, build strategy, craft branding,
          and create investor-ready pitch decks — all powered by AI.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta gsap-fade flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <button
            onClick={handleHaveIdea}
            className="btn-gradient magnetic-btn px-8 py-4 text-[15px] rounded-[var(--radius-lg)] inline-flex items-center gap-2"
          >
            <Lightbulb className="w-5 h-5" />
            Have an Idea
          </button>
          <button
            onClick={handleDontHaveIdea}
            className="btn-outline magnetic-btn px-8 py-4 text-[15px] rounded-[var(--radius-lg)] inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Don't Have an Idea
          </button>
        </div>
      </div>

      {/* Velocity Scroll Marquee */}
      <div className="relative z-10 w-full mt-20">
        <VelocityScroll baseVelocity={-1.5}>
          {"Validate · Brand · Pitch · Launch · Strategy · Compete · "}
        </VelocityScroll>
        <div className="mt-2">
          <VelocityScroll baseVelocity={1.5}>
            {"Ideate · Build · Grow · Fund · Scale · Disrupt · "}
          </VelocityScroll>
        </div>
      </div>

      {/* CSS keyframe for word swap */}
      <style>{`
        @keyframes wordFadeIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
