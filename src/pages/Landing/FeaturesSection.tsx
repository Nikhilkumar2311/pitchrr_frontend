/**
 * Features Section Component
 * Shows the 7 modules available in Pitchrr with professional styling
 */

import { forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lightbulb,
  Megaphone,
  Palette,
  Presentation,
  Rocket,
  Users,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useUIStore } from "@/store";

/**
 * The 7 modules shown in the features section
 */
const modules = [
  {
    icon: Lightbulb,
    title: "Idea Validation",
    path: "/dashboard/idea",
    description:
      "Get an AI-powered viability score, SWOT analysis, and risk heat map for your startup idea.",
    color: "#376EF9",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Megaphone,
    title: "Marketing Strategy",
    path: "/dashboard/marketing",
    description:
      "30-day marketing plan, funnel strategy, and customer personas tailored to your startup.",
    color: "#10B981",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: Palette,
    title: "Branding",
    path: "/dashboard/branding",
    description:
      "AI-generated logos, taglines, brand colors, and a complete brand kit for your startup.",
    color: "#8B5CF6",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: Presentation,
    title: "Pitch Deck",
    path: "/dashboard/pitch",
    description:
      "Professional pitch deck templates with AI-generated slides and easy editing.",
    color: "#F59E0B",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Rocket,
    title: "GTM Strategy",
    path: "/dashboard/gtm",
    description:
      "Go-to-market plan with target users, pricing strategy, and launch timeline.",
    color: "#EF4444",
    gradient: "from-red-500 to-rose-600",
  },
  {
    icon: Users,
    title: "Competitor Analysis",
    path: "/dashboard/competitors",
    description:
      "Compare your startup with competitors, analyze features, and find your edge.",
    color: "#06B6D4",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: MessageSquare,
    title: "AI Mentor",
    path: "/dashboard/chat",
    description:
      "Context-aware AI chatbot that knows your startup and provides personalized guidance.",
    color: "#EC4899",
    gradient: "from-pink-500 to-rose-600",
  },
];

export const FeaturesSection = forwardRef<HTMLElement>((_, ref) => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  /**
   * Handle "Learn more" click
   * - If authenticated: navigate to the module page
   * - If not authenticated: navigate to register with redirect back to module
   */
  const handleLearnMore = (modulePath: string) => {
    if (isSignedIn) {
      navigate(modulePath);
    } else {
      // Redirect to register with state to redirect back after login
      navigate("/register", { state: { from: { pathname: modulePath } } });
    }
  };

  return (
    <section
      id="features"
      ref={ref}
      className="relative py-20 lg:py-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6">
            <Rocket className="w-4 h-4" />
            <span>Powerful Features</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Everything You Need{" "}
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              to Launch
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Seven powerful modules that guide you from raw idea to
            investor-ready startup.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div
                key={module.title}
                className="feature-card group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div
                    className={`w-14 h-14 rounded-xl bg-linear-to-br ${module.gradient} flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Floating dots decoration */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-gray-900 group-hover:to-gray-700 group-hover:bg-clip-text transition-all duration-300">
                    {module.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {module.description}
                  </p>

                  {/* Learn more link - appears on hover */}
                  <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleLearnMore(module.path)}
                      className="inline-flex items-center gap-1 text-sm font-semibold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer hover:gap-2 transition-all"
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 lg:mt-20">
          <p className="text-lg text-gray-600 mb-6">
            Ready to transform your startup idea?
          </p>
          {isSignedIn ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <button
              onClick={() => {
                useUIStore.getState().setAuthModalView('signup');
                useUIStore.getState().setAuthModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = "FeaturesSection";
