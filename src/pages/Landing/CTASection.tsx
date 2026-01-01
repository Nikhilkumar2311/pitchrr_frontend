/**
 * CTA Section Component
 * Final call to action with professional design
 */

import { Link } from "react-router-dom";
import { ArrowRight, /*Sparkles, Check,*/ Zap /*Shield*/ } from "lucide-react";
import { useUIStore } from '@/store';
import { Button } from "@/components/ui";

// const features = [
//     'No credit card required',
//     '14-day free trial',
//     'Cancel anytime',
//     'Full access to all features',
// ];

export function CTASection() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="relative bg-linear-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-3xl overflow-hidden shadow-2xl">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-linear(to_right,#ffffff08_1px,transparent_1px),linear-linear(to_bottom,#ffffff08_1px,transparent_1px)]" />

        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative px-8 py-16 lg:px-16 lg:py-24 text-center">
          {/* Badge */}
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white text-sm font-medium mb-8">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span>Limited Time Offer</span>
                        </div> */}

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Build Your{" "}
            <span className="relative inline-block">
              <span className="bg-linear-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Startup?
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M2 10C43.5 3.5 256.5 2 298 10"
                  stroke="url(#ctalinear)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="ctalinear"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="50%" stopColor="#22D3EE" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Join thousands of founders who are turning their ideas into reality
            with Pitchrr. Start building today with AI-powered tools designed
            for success.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              onClick={() => {
                const { setAuthModalOpen, setAuthModalView } = useUIStore.getState();
                setAuthModalView('signup');
                setAuthModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-6 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Building Now
            </Button>
            <Link to="#how-it-works">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200">
                <Zap className="w-5 h-5" />
                See How It Works
              </button>
            </Link>
          </div>

          {/* Features list */}
          {/* <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="shrink-0 w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-green-400" />
                                    </div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div> */}

          {/* Social proof */}
          <div className="mt-12 pt-12 border-t border-white/10">
            <div className="flex items-center justify-center gap-3">
              <div className="flex -space-x-3">
                {[
                  "from-blue-400 to-blue-600",
                  "from-indigo-400 to-indigo-600",
                  "from-purple-400 to-purple-600",
                  "from-pink-400 to-pink-600",
                  "from-cyan-400 to-blue-600",
                ].map((linear, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-full bg-linear-to-br ${linear} border-3 border-gray-900 shadow-lg flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300">
                  <span className="font-bold text-white">1,247+</span> founders
                  already building
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-linear-to-br from-blue-500/20 to-transparent rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-linear-to-tl from-purple-500/20 to-transparent rounded-tl-full" />
      </div>

      {/* Trust badges below */}
      {/* <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-500">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        <span className="text-sm font-medium">Bank-level security</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">GDPR compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm font-medium">24/7 AI support</span>
                    </div>
                </div> */}
    </section>
  );
}
