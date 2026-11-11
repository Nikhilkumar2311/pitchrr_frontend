/**
 * Demo Mode State Store (localStorage-backed)
 *
 * Persists demo edits (created ideas, edited pitch decks, community posts,
 * credit balance, etc.) across page reloads while allowing instant reset.
 */

import type { Idea } from '@/hooks';
import type { CommunityPost, PostComment, Achievement, UserPublicProfile } from '@/hooks/useCommunity';
import type { DeckRecord } from '@/hooks/useDeckEditor';
import {
    DEMO_USER,
    DEMO_INITIAL_CREDITS,
    DEMO_IDEAS,
    DEMO_MODULES_BY_IDEA,
    DEMO_COMMUNITY_POSTS,
    DEMO_COMMENTS_BY_POST,
    DEMO_ACHIEVEMENTS,
    DEMO_PROFILES,
    createInitialDemoDecks,
} from './demoData';
import { convertAIToDeckDocument, type AISlide } from '@/utils/deckConverter';

const DEMO_MODE_KEY = 'pitchrr_demo_mode';
const DEMO_STORE_KEY = 'pitchrr_demo_store_v1';

export interface DemoStoreState {
    user: typeof DEMO_USER;
    credits: typeof DEMO_INITIAL_CREDITS;
    ideas: Idea[];
    modulesByIdea: Record<string, Record<string, { status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'; data: any }>>;
    decks: DeckRecord[];
    posts: CommunityPost[];
    commentsByPost: Record<string, PostComment[]>;
    bookmarks: string[];
    following: string[];
    achievements: Achievement[];
    profiles: Record<string, UserPublicProfile>;
    exportJobs: Record<string, { state: 'completed'; downloadUrl: string; progress: number }>;
}

function buildInitialStore(): DemoStoreState {
    const modulesByIdea: DemoStoreState['modulesByIdea'] = {};
    for (const [ideaId, modules] of Object.entries(DEMO_MODULES_BY_IDEA)) {
        modulesByIdea[ideaId] = {};
        for (const [modType, modData] of Object.entries(modules)) {
            modulesByIdea[ideaId][modType] = {
                status: 'COMPLETED',
                data: modData,
            };
        }
    }

    return {
        user: { ...DEMO_USER },
        credits: { ...DEMO_INITIAL_CREDITS },
        ideas: JSON.parse(JSON.stringify(DEMO_IDEAS)),
        modulesByIdea,
        decks: createInitialDemoDecks(),
        posts: JSON.parse(JSON.stringify(DEMO_COMMUNITY_POSTS)),
        commentsByPost: JSON.parse(JSON.stringify(DEMO_COMMENTS_BY_POST)),
        bookmarks: ['demo-post-3'],
        following: ['demo-founder-2'],
        achievements: JSON.parse(JSON.stringify(DEMO_ACHIEVEMENTS)),
        profiles: JSON.parse(JSON.stringify(DEMO_PROFILES)),
        exportJobs: {},
    };
}

let cachedStore: DemoStoreState | null = null;

export function isDemoMode(): boolean {
    try {
        return localStorage.getItem(DEMO_MODE_KEY) === 'true';
    } catch {
        return false;
    }
}

export function getDemoStore(): DemoStoreState {
    if (cachedStore) return cachedStore;
    try {
        const raw = localStorage.getItem(DEMO_STORE_KEY);
        if (raw) {
            cachedStore = JSON.parse(raw) as DemoStoreState;
            return cachedStore;
        }
    } catch {
        // Ignore parse errors and fall back to fresh seed
    }
    cachedStore = buildInitialStore();
    saveDemoStore(cachedStore);
    return cachedStore;
}

export function saveDemoStore(next: DemoStoreState): void {
    cachedStore = next;
    try {
        localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(next));
    } catch {
        // Ignore quota errors in restricted browsers
    }
}

export function enterDemoMode(): DemoStoreState {
    try {
        localStorage.setItem(DEMO_MODE_KEY, 'true');
        localStorage.setItem('pitchrr-idea-storage', JSON.stringify({
            state: { activeIdeaId: 'demo-idea-1', currentIdea: null },
            version: 0,
        }));
    } catch {
        // Ignore storage errors
    }
    const existing = getDemoStore();
    return existing;
}

export function resetDemoData(): DemoStoreState {
    const fresh = buildInitialStore();
    saveDemoStore(fresh);
    try {
        localStorage.setItem('pitchrr-idea-storage', JSON.stringify({
            state: { activeIdeaId: fresh.ideas[0]?.id || null, currentIdea: null },
            version: 0,
        }));
        // Clear any custom demo chat histories
        const toRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('pitchrr_chatbot_messages_')) {
                toRemove.push(key);
            }
        }
        toRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
        // Ignore
    }
    return fresh;
}

export function exitDemoMode(): void {
    cachedStore = null;
    try {
        localStorage.removeItem(DEMO_MODE_KEY);
        localStorage.removeItem(DEMO_STORE_KEY);
    } catch {
        // Ignore
    }
}

/**
 * Generates dynamic module data tailored to any idea (including newly created ideas in demo mode).
 */
export function buildGeneratedModuleData(idea: Idea, moduleType: string): any {
    const title = idea.title || 'Your Startup';
    const audience = idea.targetAudience || 'early adopters and growth-focused teams';
    const industry = idea.industry || 'Technology';

    // If this is one of the pre-seeded demo ideas, start from its rich template
    const seeded = DEMO_MODULES_BY_IDEA[idea.id]?.[moduleType];
    if (seeded) {
        return JSON.parse(JSON.stringify(seeded));
    }

    switch (moduleType) {
        case 'idea_validation':
            return {
                idea_score: 82,
                summary: `${title} targets a timely opportunity in ${industry}. By focusing directly on ${audience}, the concept achieves strong problem-solution fit with clear differentiation.`,
                feasibility: 'high',
                risk_heat_map: [
                    { category: 'Market', level: 'low', description: 'Clear demand signal across target buyers.' },
                    { category: 'Execution', level: 'medium', description: 'Requires disciplined MVP scoping for fast validation.' },
                    { category: 'Competition', level: 'medium', description: 'Differentiation depends on workflow speed and UX.' },
                    { category: 'Tech', level: 'low', description: 'Buildable with modern cloud and AI tooling.' },
                ],
                swot: {
                    strengths: [
                        `Focused value proposition tailored for ${audience}`,
                        `Strong timing within ${industry}`,
                        'Lean MVP path with fast user feedback loops',
                    ],
                    weaknesses: [
                        'Initial customer acquisition requires targeted community trust',
                        'Need clear ROI metrics during early pilot onboarding',
                    ],
                },
                market_demand_snapshot: [
                    { source: 'Market Trends', signal_type: `${industry} adoption`, interpretation: 'Strong growing demand', trend: 'up' },
                    { source: 'Buyer Intent', signal_type: 'Workflow automation spend', interpretation: 'Increasing budget priority', trend: 'up' },
                ],
                recommendations: [
                    `Run 15 discovery interviews with ${audience} before scaling paid acquisition.`,
                    `Launch a focused MVP around the #1 daily pain point for ${title}.`,
                    'Track Day-7 activation and referral rate as primary validation metrics.',
                ],
            };

        case 'marketing_strategy':
            return {
                timeline: [
                    {
                        phase: 'Week 1: Narrative & Waitlist',
                        activities: [
                            `Launch high-converting landing page for ${title}`,
                            `Publish founder story targeting ${audience}`,
                        ],
                    },
                    {
                        phase: 'Week 2: Community & Organic Seeding',
                        activities: [
                            `Share interactive teardown in ${industry} communities`,
                            'Launch referral incentive for early waitlist members',
                        ],
                    },
                    {
                        phase: 'Week 3: Launch Push',
                        activities: ['Coordinated Product Hunt & LinkedIn launch', 'Publish 3 customer pilot stories'],
                    },
                ],
                target_segments: [
                    { name: 'Early Adopter Segment', description: audience, size: '250,000+ reachable buyers' },
                ],
                channels: [
                    { name: 'Founder-Led LinkedIn & X', priority: 'high', tactics: ['Build-in-public threads', 'Problem teardowns'] },
                    { name: 'Targeted Communities', priority: 'high', tactics: ['Founder Slack/Discord groups', 'Niche newsletters'] },
                ],
                messaging_framework: {
                    value_proposition: `${title} helps ${audience} achieve faster outcomes with less operational friction.`,
                    key_messages: ['Built specifically for modern workflows', 'Fast onboarding with measurable ROI in week 1'],
                },
                kpis: ['Waitlist Conversion > 18%', 'D7 Retention > 50%', 'Organic Referral Share > 25%'],
            };

        case 'branding':
            return {
                taglines: [
                    `${title} — Built for what's next.`,
                    `Smarter ${industry.toLowerCase()} workflows, simplified.`,
                    `Move faster with ${title}.`,
                ],
                brand_voice: {
                    tone: 'Bold, Crisp & Trustworthy',
                    keywords: ['Modern', 'Agile', 'Human', 'Precision'],
                    description: `${title} communicates with clarity, warmth, and founder-grade pragmatism.`,
                },
                typography: { heading_font: 'Sora', body_font: 'Inter' },
                color_palette: { primary: '#4F7DF3', secondary: '#7A5CFF', accent: '#10B981' },
                ai_logos: [],
            };

        case 'pitch_deck': {
            const slides: AISlide[] = [
                {
                    type: 'title',
                    title,
                    headline: `Reimagining ${industry} for ${audience}`,
                    content: idea.description,
                },
                {
                    type: 'problem',
                    title: 'The Problem',
                    headline: 'Legacy workflows create costly friction',
                    content: idea.problemSolved || `Current tools leave ${audience} stuck with manual workarounds.`,
                    bullet_points: ['High operational overhead', 'Fragmented legacy tools', 'Slow time-to-value'],
                },
                {
                    type: 'solution',
                    title: `The ${title} Solution`,
                    headline: 'Automated, AI-native workflow from day one',
                    content: idea.description,
                    bullet_points: ['10x faster onboarding', 'Built-in intelligence', 'Seamless team collaboration'],
                },
                {
                    type: 'business_model',
                    title: 'Business Model',
                    headline: 'High-margin recurring SaaS',
                    content: 'Freemium wedge driving self-serve team upgrades.',
                    chart: {
                        type: 'pie',
                        title: 'Revenue Mix',
                        data: [
                            { name: 'Team SaaS', value: 65 },
                            { name: 'Enterprise', value: 25 },
                            { name: 'Pro Solo', value: 10 },
                        ],
                    },
                },
                {
                    type: 'ask',
                    title: 'The Ask',
                    headline: idea.amount || '₹1 Cr Pre-Seed',
                    content: '18 months of runway to reach product-market fit and initial ARR milestones.',
                    chart: {
                        type: 'pie',
                        title: 'Use of Funds',
                        data: [
                            { name: 'Product & AI', value: 50 },
                            { name: 'GTM & Sales', value: 35 },
                            { name: 'Operations', value: 15 },
                        ],
                    },
                },
            ];
            // Also register a deck in demo decks if none exists for this idea
            const store = getDemoStore();
            if (!store.decks.some((d) => d.ideaId === idea.id)) {
                const doc = convertAIToDeckDocument({ slides }, `${title} — Pitch Deck`);
                store.decks.unshift({
                    id: `demo-deck-${Date.now()}`,
                    userId: store.user.id,
                    ideaId: idea.id,
                    title: doc.title,
                    data: doc,
                    thumbnail: null,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
                saveDemoStore(store);
            }
            return { slides };
        }

        case 'gtm_strategy':
            return {
                target_segments: [
                    { name: 'Primary ICP', description: audience, priority: 'high' },
                ],
                pricing_strategy: {
                    model: 'freemium',
                    description: 'Self-serve free tier for instant validation, converting active teams to monthly subscriptions.',
                    tiers: [
                        { name: 'Starter', price: '₹0 / month' },
                        { name: 'Growth', price: '₹999 / month' },
                        { name: 'Scale', price: '₹2,999 / month' },
                    ],
                },
                launch_plan: [
                    { phase: 'Private Beta', timeline: 'Weeks 1–3', activities: ['Onboard 20 design partners', 'Iterate core workflow'] },
                    { phase: 'Public Launch', timeline: 'Weeks 4–6', activities: ['Product Hunt & community launch', 'Enable self-serve billing'] },
                ],
                growth_strategies: [
                    { strategy: 'Product-Led Sharing', description: `Embed shareable ${title} outputs that invite collaborators organically.` },
                ],
                kpis: [
                    { metric: 'Activated Workspaces', target: '250+', timeframe: 'Quarter 1' },
                    { metric: 'Paid Conversion', target: '10%+', timeframe: 'Monthly' },
                ],
            };

        case 'competitor_analysis':
            return {
                competitors: [
                    {
                        name: 'Legacy Suites',
                        website: 'enterprise-incumbent.com',
                        pricing: '₹2,500 / seat / mo',
                        description: `Traditional ${industry} software built for large enterprises.`,
                        strengths: ['Established brand', 'Broad feature checklist'],
                        weaknesses: ['Slow onboarding', 'Clunky UX for modern teams'],
                    },
                    {
                        name: 'Manual Spreadsheets & Point Tools',
                        pricing: 'Free / Fragmented',
                        description: 'DIY stack patched together by early teams.',
                        strengths: ['Zero upfront software cost'],
                        weaknesses: ['Error-prone manual upkeep', 'No AI automation'],
                    },
                ],
                market_overview: `${industry} buyers are rapidly shifting away from bloated legacy suites toward focused, AI-native tools like ${title}.`,
                competitive_advantages: [
                    'Purpose-built AI workflow with 10x faster time-to-value',
                    'Transparent pricing tailored for agile teams',
                ],
                gaps_in_market: [
                    'Incumbents fail to serve fast-moving startups without heavy implementation fees',
                ],
                positioning_recommendations: [
                    `Anchor ${title} on speed-to-value: show tangible results inside the first 5 minutes.`,
                ],
            };

        case 'grants':
            return {
                recommendations: [
                    {
                        title: 'Startup India Seed Fund Scheme (SISFS)',
                        reason: `Strong match for ${idea.startupStage || 'early-stage'} startups building scalable products in ${industry}.`,
                        category: 'Government Grant',
                        funding: 'Up to ₹20 Lakhs',
                    },
                    {
                        title: 'AWS Activate / Google Cloud Startups',
                        reason: 'Offset infrastructure and AI API costs during MVP and beta rollout.',
                        category: 'Cloud Credits',
                        funding: 'Up to $100,000 Credits',
                    },
                ],
                roadmap: [
                    {
                        stage: idea.startupStage || 'Idea',
                        icon: 'lightbulb',
                        description: `Build proof-of-concept traction for ${title} and apply to partner incubators.`,
                        grants: ['NIDHI-PRAYAS', 'SISFS'],
                        checklist: ['Complete DPIIT Startup India registration', 'Document pilot user feedback'],
                    },
                ],
            };

        default:
            return {};
    }
}

/**
 * Generates a realistic, context-aware AI Advisor reply in Demo Mode.
 */
export function getDemoChatReply(
    userMessage: string,
    idea?: Idea | null,
    allModules?: Record<string, any> | null
): string {
    const q = userMessage.toLowerCase();
    const title = idea?.title || 'your startup';
    const score = allModules?.idea_validation?.data?.idea_score;
    const scoreNote = score ? ` (currently scoring **${score}/100** in Idea Validation)` : '';

    if (q.includes('pitch') || q.includes('deck') || q.includes('investor')) {
        return `Here is how to sharpen **${title}**'s investor narrative${scoreNote}:\n\n1. **Lead with the cost of inaction** — Quantify the exact time or money ${idea?.targetAudience || 'your target users'} lose weekly before using ${title}.\n2. **Spotlight retention proof** — Investors love early cohort engagement over raw signups. Highlight pilot retention and repeat usage.\n3. **Tighten the Ask slide** — Tie your ${idea?.amount || 'seed round'} directly to 2–3 measurable 18-month milestones (e.g., pilot conversions and ARR target).\n\nWant me to draft a 30-second elevator opener for your Title slide?`;
    }

    if (q.includes('marketing') || q.includes('growth') || q.includes('acquire') || q.includes('user')) {
        return `For **${title}**, your highest-leverage growth loop right now is **product-led distribution + founder storytelling**:\n\n- **Week 1 Quick Win**: Turn one insight from your pilot data into a crisp benchmark post on LinkedIn and niche founder/builder communities.\n- **Bottom-Up Wedge**: Give individual users immediate value in under 2 minutes, then prompt team sharing once 2+ teammates join.\n- **Track North Star**: Focus on Day-7 activation before scaling paid ads.\n\nWould you like 3 specific LinkedIn hook ideas tailored to ${title}?`;
    }

    if (q.includes('competit') || q.includes('moat') || q.includes('edge')) {
        return `Looking at **${title}**'s competitive landscape:\n\n- **Incumbent Blind Spot**: Large competitors optimize for enterprise checklists, leaving workflows bloated and passive.\n- **Your Moat**: Combining real-time context with frictionless onboarding gives ${title} a **workflow integration advantage** that generic tools can't copy overnight.\n- **Next Move**: Build a side-by-side ROI calculator on your landing page comparing time-to-value vs. legacy alternatives.`;
    }

    if (q.includes('grant') || q.includes('fund') || q.includes('raise')) {
        return `For **${title}** at the **${idea?.startupStage || 'Early'}** stage:\n\n1. **Non-Dilutive First**: Apply to **Startup India Seed Fund (SISFS)** and **AWS Activate / Google Cloud** credits to extend runway without dilution.\n2. **Angel Syndicate Readiness**: Line up 5–8 warm operator angels in ${idea?.industry || 'your sector'} before opening a formal seed round of ${idea?.amount || '₹1 Cr+'}.\n3. **One-Pager Ready**: Export your One Pager from the Pitch Deck studio to send concise updates to angels.`;
    }

    return `Great question about **${title}**${scoreNote}!\n\nBased on your workspace context:\n- **Core Focus**: ${idea?.problemSolved || idea?.description || 'Solving a high-urgency workflow bottleneck.'}\n- **Target Audience**: ${idea?.targetAudience || 'Early-stage adopters seeking measurable ROI.'}\n\nHere are three high-impact moves this week:\n1. **Validate Willingness to Pay** — Run 5 live pricing conversations using the tiers in your GTM Strategy.\n2. **Polish Your Deck** — Open the Pitch Deck Studio to customize your Problem & Traction slides.\n3. **Share in Explore** — Post a quick milestone update in the Community feed to gather founder feedback.\n\nWhich of these should we tackle first?`;
}
