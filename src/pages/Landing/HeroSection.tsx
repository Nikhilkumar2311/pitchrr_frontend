/**
 * Hero Section Component
 * Split layout: Text on left, Image on right with micro-animations
 */

import { forwardRef } from "react";
import { useUIStore } from '@/store';
import { Button } from "@/components/ui";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Sparkles } from "lucide-react";

export const HeroSection = forwardRef<HTMLElement>((_, ref) => {
  const { setAuthModalOpen, setAuthModalView } = useUIStore();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleHaveIdea = () => {
    if (isSignedIn) {
      navigate('/dashboard/idea');
    } else {
      setAuthModalView('signin');
      setAuthModalOpen(true);
    }
  };

  const handleDontHaveIdea = () => {
    if (isSignedIn) {
      navigate('/dashboard?generate=true');
    } else {
      setAuthModalView('signin');
      setAuthModalOpen(true);
    }
  };

  return (
    <section ref={ref} className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge with pulse animation */}
            <div
              className="ai-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6 opacity-0"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AI-Powered Startup Platform
            </div>

            {/* Main Headline with stagger animation */}
            <h1 className="hero-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight opacity-0">
              Turn Your Startup Idea Into{" "}
              <span className="relative inline-block">
                <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                  Reality
                </span>
                {/* Animated underline */}
                <svg
                  className="hero-underline absolute -bottom-2 left-0 w-full opacity-0"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 10C43.5 3.5 256.5 2 298 10"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="hero-description mt-6 text-lg lg:text-xl text-gray-600 leading-relaxed opacity-0">
              Validate, brand, and pitch your startup with AI-powered tools.
              <span className="block mt-2 text-gray-700 font-medium">
                Go from idea to investor-ready in days, not months.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mt-8 opacity-0">
              <Button
                size="lg"
                leftIcon={<Lightbulb className="w-5 h-5" />}
                onClick={handleHaveIdea}
              >
                Have Idea
              </Button>
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Sparkles className="w-5 h-5" />}
                onClick={handleDontHaveIdea}
              >
                Don't Have Idea
              </Button>
            </div>

            {/* Trust indicators */}
            <div
              className="hero-trust mt-10 opacity-0"
            >
              {/* <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
                                {['No credit card required', '14-day free trial', 'Cancel anytime'].map((text, i) => (
                                    <motion.div
                                        key={text}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 + i * 0.1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4 text-green-600" />
                                        <span>{text}</span>
                                    </motion.div>
                                ))}
                            </div> */}

              {/* Social proof */}
              <div
                className="flex items-center justify-center lg:justify-start gap-3 mt-6"
              >
                <div className="flex -space-x-3">
                  {[
                    "from-blue-400 to-blue-600",
                    "from-indigo-400 to-indigo-600",
                    "from-purple-400 to-purple-600",
                    "from-pink-400 to-pink-600",
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-full bg-linear-to-br ${gradient} border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">1,247</span>{" "}
                    founders building
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div
            className="hero-image-container relative opacity-0"
          >
            {/* Floating animation wrapper */}
            <div
              className="hero-image-floating relative"
            >
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-400/20 to-indigo-400/20 rounded-3xl blur-3xl transform scale-95" />

              {/* Hero Image */}
              <img
                src="/landing/hero.png"
                alt="Pitchrr Dashboard Preview"
                className="relative z-10 w-full h-auto rounded-2xl shadow-2xl border border-gray-200"
              />

              {/* Decorative floating elements */}
              <div
                className="hero-float-1 absolute -top-4 -right-4 w-16 h-16 bg-blue-500 rounded-2xl shadow-lg flex items-center justify-center z-20"
              >
                <span className="text-white text-2xl">🚀</span>
              </div>

              <div
                className="hero-float-2 absolute -bottom-4 -left-4 w-14 h-14 bg-green-500 rounded-xl shadow-lg flex items-center justify-center z-20"
              >
                <span className="text-white text-xl">✓</span>
              </div>

              <div
                className="hero-float-3 absolute top-1/2 -right-6 w-12 h-12 bg-purple-500 rounded-full shadow-lg flex items-center justify-center z-20"
              >
                <span className="text-white text-lg">💡</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
