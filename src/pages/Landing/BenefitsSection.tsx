/**
 * Benefits Section Component
 * Why founders choose Pitchrr + Testimonial (Light theme)
 */

import { forwardRef } from "react";
import { Zap, Star, Shield, CheckCircle2 } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Launch Faster",
    description: "Go from idea to investor-ready in days, not months.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Star,
    title: "AI-Powered Insights",
    description: "Get smart recommendations based on successful startups.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Shield,
    title: "Build Confidence",
    description: "Validate your idea before investing time and money.",
    gradient: "from-green-500 to-emerald-500",
  },
];

export const BenefitsSection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6">
              <CheckCircle2 className="w-4 h-4" />
              <span>Why Choose Us</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why Founders Choose{" "}
              <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Pitchrr
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-10">
              Join thousands of founders who are building faster and smarter with
              AI-powered tools.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="benefit-item group flex gap-4 p-5 rounded-xl bg-gray-50 border border-gray-200 hover:bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div
                      className={`shrink-0 w-14 h-14 rounded-xl bg-linear-to-br ${benefit.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Testimonial */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 lg:p-10 border border-gray-200 shadow-xl">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                "Pitchrr helped me validate my idea and create a professional
                pitch deck in just 2 days. I went from 'maybe I should build this'
                to pitching investors with confidence."
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">AP</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Ajit</div>
                  <div className="text-gray-500">Founder, Aarthik</div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  2 Days
                </div>
                <div className="text-sm text-gray-500">Time Saved</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">$50K</div>
                <div className="text-sm text-gray-500">Raised</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">5/5</div>
                <div className="text-sm text-gray-500">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

BenefitsSection.displayName = "BenefitsSection";
