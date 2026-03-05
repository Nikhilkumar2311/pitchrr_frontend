/**
 * Hero Section Component
 * Split layout: left copy + right premium animated workflow scene.
 * Hub-and-spoke workflow with animated SVG arrows, flowing particles,
 * gradient icon backgrounds, pulsing hub, and depth-based styling.
 */

import { forwardRef } from "react";
import { useUIStore } from "@/store";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Sparkles } from "lucide-react";
import { VelocityScroll } from "@/components/ui/VelocityScroll";
import {
  Zap,
  CheckCircle,
  TrendingUp,
  Palette,
  FileText,
  Target,
  Search,
  BookOpen,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Workflow Node Definitions
   Hub layout: Idea at top → Validation center → modules fan out
   ──────────────────────────────────────────── */
const workflowNodes = [
  // Entry point — special "start" style
  { id: "idea", label: "Idea", icon: Zap, color: "#4F7DF3", gradient: "linear-gradient(135deg, #4F7DF3, #6B8FF8)", x: 210, y: 15, tier: "start" as const },
  // Central hub — larger, glowing
  { id: "validation", label: "Idea Validation", icon: CheckCircle, color: "#7A5CFF", gradient: "linear-gradient(135deg, #7A5CFF, #9B7EFF)", x: 175, y: 130, tier: "hub" as const },
  // Fan-out modules — 3 columns, 2 rows
  { id: "competitor", label: "Competitor\nAnalysis", icon: Search, color: "#8B5CF6", gradient: "linear-gradient(135deg, #8B5CF6, #A78BFA)", x: 10, y: 255, tier: "module" as const },
  { id: "marketing", label: "Marketing\nStrategy", icon: TrendingUp, color: "#4F7DF3", gradient: "linear-gradient(135deg, #4F7DF3, #6B8FF8)", x: 360, y: 255, tier: "module" as const },
  { id: "branding", label: "Branding", icon: Palette, color: "#F59E0B", gradient: "linear-gradient(135deg, #F59E0B, #FBBF24)", x: 185, y: 265, tier: "module" as const },
  { id: "gtm", label: "GTM\nStrategy", icon: Target, color: "#EF4444", gradient: "linear-gradient(135deg, #EF4444, #F87171)", x: 10, y: 380, tier: "module" as const },
  { id: "pitchdeck", label: "Pitch Deck", icon: FileText, color: "#10B981", gradient: "linear-gradient(135deg, #10B981, #34D399)", x: 185, y: 390, tier: "module" as const },
  { id: "grants", label: "Grants", icon: BookOpen, color: "#0EA5E9", gradient: "linear-gradient(135deg, #0EA5E9, #38BDF8)", x: 360, y: 380, tier: "module" as const },
];

/* SVG arrow paths — curved connections */
const workflowPaths = [
  { id: "p-idea-val", d: "M 242 52  C 242 70, 230 100, 228 128", color1: "#4F7DF3", color2: "#7A5CFF" },
  { id: "p-val-comp", d: "M 198 168  C 150 200, 90 220, 72 253", color1: "#7A5CFF", color2: "#8B5CF6" },
  { id: "p-val-mkt", d: "M 290 168  C 340 200, 390 220, 402 253", color1: "#7A5CFF", color2: "#4F7DF3" },
  { id: "p-val-brand", d: "M 242 168  C 242 200, 232 230, 232 263", color1: "#7A5CFF", color2: "#F59E0B" },
  { id: "p-val-gtm", d: "M 198 168  C 140 230, 70 310, 62 378", color1: "#7A5CFF", color2: "#EF4444" },
  { id: "p-val-pitch", d: "M 242 168  C 242 250, 232 320, 232 388", color1: "#7A5CFF", color2: "#10B981" },
  { id: "p-val-grants", d: "M 290 168  C 350 250, 400 320, 402 378", color1: "#7A5CFF", color2: "#0EA5E9" },
];

export const HeroSection = forwardRef<HTMLElement>((_, ref) => {
  const { setAuthModalOpen, setAuthModalView } = useUIStore();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

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
      className="relative overflow-hidden"
      style={{
        minHeight: "92vh",
        paddingTop: "110px",
        paddingBottom: "40px",
        background:
          "linear-gradient(135deg, #EEF2FF 0%, #F0F4FF 25%, #F8FAFF 50%, #F3EEFF 75%, #EEF2FF 100%)",
      }}
    >
      {/* ── Parallax Background Layer ── */}
      <div className="parallax-bg absolute inset-0 pointer-events-none">
        <div
          className="hero-gradient-blob absolute rounded-full blur-[120px] opacity-30"
          style={{
            width: 600, height: 600, top: "-15%", left: "5%",
            background: "radial-gradient(circle, rgba(79,125,243,0.35) 0%, transparent 70%)",
          }}
        />
        <div
          className="hero-gradient-blob absolute rounded-full blur-[100px] opacity-25"
          style={{
            width: 500, height: 500, bottom: "-10%", right: "2%",
            background: "radial-gradient(circle, rgba(122,92,255,0.3) 0%, transparent 70%)",
          }}
        />
        <div
          className="hero-gradient-blob absolute rounded-full blur-[90px] opacity-20"
          style={{
            width: 400, height: 400, top: "40%", left: "55%",
            background: "radial-gradient(circle, rgba(79,125,243,0.25) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Parallax Mid Layer ── */}
      <div className="parallax-mid absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full opacity-[0.06]"
          style={{ width: 180, height: 180, top: "20%", right: "10%", background: "var(--color-gradient)" }}
        />
        <div
          className="absolute rounded-full opacity-[0.05]"
          style={{ width: 120, height: 120, bottom: "25%", left: "8%", background: "var(--color-gradient)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── Bottom fade ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--color-bg-light))" }}
      />

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="relative z-10 mx-auto px-6 lg:px-12" style={{ maxWidth: 1280 }}>
        <div className="hero-grid flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

          {/* ── LEFT COLUMN — Copy ── */}
          <div className="hero-left flex-1 max-w-[600px] text-center lg:text-left">
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

            <h1
              className="hero-headline gsap-fade"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "var(--color-text-primary)",
              }}
            >
              Turn Startup Ideas
              <br />
              Into <span className="gradient-text">Investor-Ready</span> Companies
            </h1>

            <p
              className="hero-subheading gsap-fade mt-6"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                lineHeight: 1.7,
                color: "var(--color-text-muted)",
                maxWidth: 520,
              }}
            >
              Pitchrr helps founders validate ideas, build strategy, craft
              branding, and create investor-ready pitch decks — all powered by AI.
            </p>

            <div className="hero-cta gsap-fade flex flex-col sm:flex-row items-center lg:items-start gap-4 mt-10">
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

          {/* ── RIGHT COLUMN — Premium Workflow Scene ── */}
          <div className="hero-right flex-1 flex items-center justify-center">
            <div className="hero-workflow" style={{ perspective: "1000px" }}>
              <div
                className="hero-workflow__inner"
                style={{
                  transform: "rotateX(4deg) rotateY(-3deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Decorative orbital ring behind hub */}
                <div className="wf-orbital-ring" />
                <div className="wf-orbital-ring wf-orbital-ring--2" />

                {/* SVG layer — arrows + flowing particles */}
                <svg
                  className="hero-workflow__svg"
                  viewBox="0 0 500 460"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Per-path gradients */}
                    {workflowPaths.map((p) => (
                      <linearGradient key={`g-${p.id}`} id={`g-${p.id}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={p.color1} />
                        <stop offset="100%" stopColor={p.color2} />
                      </linearGradient>
                    ))}
                    {/* Arrowhead marker */}
                    <marker
                      id="arrowHead"
                      markerWidth="8"
                      markerHeight="6"
                      refX="7"
                      refY="3"
                      orient="auto"
                      markerUnits="userSpaceOnUse"
                    >
                      <path d="M 0 0.5 L 7.5 3 L 0 5.5 L 1.5 3 Z" fill="#7A5CFF" opacity="0.7" />
                    </marker>
                    {/* Glow filter */}
                    <filter id="pathGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Glow layer behind paths */}
                  {workflowPaths.map((p) => (
                    <path
                      key={`glow-${p.id}`}
                      d={p.d}
                      stroke={p.color1}
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.08"
                      filter="url(#pathGlow)"
                    />
                  ))}

                  {/* Main paths */}
                  {workflowPaths.map((p) => (
                    <path
                      key={p.id}
                      className="wf-path"
                      d={p.d}
                      stroke={`url(#g-${p.id})`}
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                      markerEnd="url(#arrowHead)"
                    />
                  ))}

                  {/* Flowing particle dots along each path */}
                  {workflowPaths.map((p, i) => (
                    <circle
                      key={`dot-${p.id}`}
                      className="wf-particle"
                      r="3"
                      fill={p.color2}
                      opacity="0"
                    >
                      <animateMotion
                        dur={`${2.5 + i * 0.3}s`}
                        repeatCount="indefinite"
                        begin={`${i * 0.4}s`}
                        path={p.d}
                      />
                    </circle>
                  ))}
                </svg>

                {/* Workflow nodes */}
                {workflowNodes.map((node) => {
                  const Icon = node.icon;
                  return (
                    <div
                      key={node.id}
                      className={`wf-node wf-node--${node.tier}`}
                      data-node-id={node.id}
                      style={{
                        left: node.x,
                        top: node.y,
                        "--node-color": node.color,
                        "--node-gradient": node.gradient,
                      } as React.CSSProperties}
                    >
                      {/* Colored left accent bar */}
                      <div className="wf-node__accent" style={{ background: node.gradient }} />

                      <div className="wf-node__icon" style={{ background: node.gradient }}>
                        <Icon size={16} strokeWidth={2.2} color="white" />
                      </div>
                      <span className="wf-node__label">{node.label}</span>

                      {/* Glow ring */}
                      <div
                        className="wf-node__glow"
                        style={{
                          background: `radial-gradient(circle, ${node.color}20 0%, transparent 70%)`,
                        }}
                      />

                      {/* Pulse ring for hub node */}
                      {node.tier === "hub" && (
                        <>
                          <div className="wf-node__pulse" style={{ borderColor: `${node.color}30` }} />
                          <div className="wf-node__pulse wf-node__pulse--delayed" style={{ borderColor: `${node.color}20` }} />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
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
