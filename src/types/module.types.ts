/**
 * TypeScript Type Definitions for Modules
 * 
 * Each of the 7 Pitchrr modules has its own data structure.
 * This file defines those structures for type safety.
 */

/**
 * Module status - tracks progress of each module
 */
export type ModuleStatus = 'not-started' | 'in-progress' | 'completed';

/**
 * Base module interface - shared by all modules
 */
export interface BaseModule {
    id: string;
    status: ModuleStatus;
    lastUpdated: string;
    progress: number; // 0-100
}

/* ============================================
   MODULE 1: IDEA VALIDATION
   ============================================ */
export interface IdeaValidation extends BaseModule {
    ideaSummary: string;
    ideaScore: number; // 0-100
    riskHeatMap: {
        market: 'low' | 'medium' | 'high';
        execution: 'low' | 'medium' | 'high';
        competition: 'low' | 'medium' | 'high';
        tech: 'low' | 'medium' | 'high';
    };
    feasibility: 'low' | 'medium' | 'high';
    swot: {
        strengths: string[];
        weaknesses: string[];
    };
    marketDemand: {
        level: 'low' | 'medium' | 'high';
        trend: 'growing' | 'stable' | 'declining';
    };
}

/* ============================================
   MODULE 2: MARKETING STRATEGY
   ============================================ */
export interface MarketingWeek {
    week: number;
    tasks: string[];
}

export interface MarketingStrategy extends BaseModule {
    thirtyDayPlan: MarketingWeek[];
    marketingFunnel: {
        awareness: string[];
        interest: string[];
        conversion: string[];
    };
    channelStrategy: {
        online: string[];
        offline: string[];
    };
    customerPersona: {
        name: string;
        age: string;
        occupation: string;
        painPoints: string[];
        goals: string[];
    };
    adsStrategy: {
        platforms: string[];
        adAngles: string[];
    };
    socialMediaImprovements: string[];
}

/* ============================================
   MODULE 3: BRANDING
   ============================================ */
export interface Branding extends BaseModule {
    logoUrl?: string;
    taglines: string[];
    fonts: {
        primary: string;
        secondary: string;
    };
    brandTone: 'professional' | 'friendly' | 'bold' | 'minimalist' | 'playful';
    colorPalette: {
        primary: string;
        secondary: string;
        accent: string;
    };
}

/* ============================================
   MODULE 4: PITCH DECK
   ============================================ */
export interface PitchSlide {
    id: string;
    type: 'problem' | 'solution' | 'market' | 'traction' | 'vision' | 'team' | 'custom';
    title: string;
    content: string;
    order: number;
}

export interface PitchDeck extends BaseModule {
    templateId: string;
    slides: PitchSlide[];
}

/* ============================================
   MODULE 5: GTM STRATEGY
   ============================================ */
export interface GTMStrategy extends BaseModule {
    targetUsers: {
        primaryAudience: string;
        earlyAdopters: string[];
    };
    pricingStrategy: 'free' | 'paid' | 'freemium' | 'subscription';
    pricingDetails: string;
    launchPlan: {
        phase: string;
        timeline: string;
        tasks: string[];
    }[];
    growthLoops: string[];
    keyMetrics: string[];
}

/* ============================================
   MODULE 6: COMPETITOR ANALYSIS
   ============================================ */
export interface Competitor {
    name: string;
    website?: string;
    features: string[];
    pricing: string;
    strengths: string[];
    weaknesses: string[];
}

export interface CompetitorAnalysis extends BaseModule {
    competitors: Competitor[];
    featureComparison: {
        feature: string;
        yourStartup: boolean;
        competitors: { [name: string]: boolean };
    }[];
    pricingComparison: {
        competitor: string;
        pricing: string;
        positioning: string;
    }[];
}

/* ============================================
   MODULE 7: STARTUP AI CHATBOT
   ============================================ */
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface StartupChatbot extends BaseModule {
    messages: ChatMessage[];
    predefinedPrompts: string[];
}

/* ============================================
   COMBINED STARTUP DATA
   ============================================ */
export interface Startup {
    id: string;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    modules: {
        ideaValidation?: IdeaValidation;
        marketingStrategy?: MarketingStrategy;
        branding?: Branding;
        pitchDeck?: PitchDeck;
        gtmStrategy?: GTMStrategy;
        competitorAnalysis?: CompetitorAnalysis;
        chatbot?: StartupChatbot;
    };
}
