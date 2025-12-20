/**
 * Hero Section Component
 * Main headline with CTA and social proof
 */

import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui';

export const HeroSection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section
      ref={ref}
      className="relative mt-24 mb-24 lg:mt-40 lg:mb-32 overflow-hidden bg-linear-to-b from-slate-50 via-white to-white"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div 
          className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" 
          style={{ animationDuration: '4s' }} 
        />
        <div 
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" 
          style={{ animationDuration: '6s', animationDelay: '1s' }} 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div 
            className="absolute inset-0 bg-linear-to-r from-transparent via-blue-50/50 to-transparent" 
            style={{ transform: 'skewY(-6deg)' }} 
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            AI-Powered Startup Platform
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 max-w-5xl mx-auto leading-tight tracking-tight">
            Turn Your Startup Idea Into{' '}
            <span className="relative inline-block">
              <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                Reality
              </span>
              <svg 
                className="absolute -bottom-2 left-0 w-full" 
                viewBox="0 0 300 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M2 10C43.5 3.5 256.5 2 298 10" 
                  stroke="url(#gradient)" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Validate, brand, and pitch your startup with AI-powered tools.
            <span className="block mt-2 text-gray-700 font-medium">
              Go from idea to investor-ready in days, not months.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Start Free Trial
              </Button>
            </Link>
            <Link to="#features">
              <Button variant="secondary" size="lg">
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 flex-wrap">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Cancel anytime</span>
              </div>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <div className="flex -space-x-3">
                {[
                  'from-blue-400 to-blue-600',
                  'from-indigo-400 to-indigo-600',
                  'from-purple-400 to-purple-600',
                  'from-pink-400 to-pink-600',
                  'from-blue-500 to-indigo-500'
                ].map((gradient, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full bg-linear-to-br ${gradient} border-3 border-white shadow-md flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
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
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-bold text-gray-900">1,247</span> founders building with us
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';