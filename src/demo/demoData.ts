/**
 * Demo Data for Backend-Free Interactive Demo Mode
 *
 * All data shapes match the exact structures expected by Pitchrr's
 * React components and React Query hooks.
 */

import type { Idea, CreditPack } from '@/hooks';
import type { CommunityPost, PostComment, Achievement, UserPublicProfile } from '@/hooks/useCommunity';
import type { DeckRecord } from '@/hooks/useDeckEditor';
import { convertAIToDeckDocument, type AISlide } from '@/utils/deckConverter';

export const DEMO_USER = {
    id: 'demo-user-001',
    email: 'founder@pulseflow.ai',
    name: 'Aarav Mehta',
    avatarUrl: null as string | null,
    emailVerified: true,
    authProvider: 'demo',
};

export const DEMO_INITIAL_CREDITS = {
    balance: 250,
    totalUsed: 85,
    lifetimeCredits: 335,
    freeLogoUsed: false,
    freeCardUsed: false,
};

export const DEMO_CREDIT_PACKS: CreditPack[] = [
    { id: 'starter', name: 'Starter Pack', credits: 50, price: 299, currency: 'INR' },
    { id: 'growth', name: 'Growth Pack', credits: 150, price: 699, currency: 'INR', popular: true },
    { id: 'pro', name: 'Founder Pro', credits: 400, price: 1499, currency: 'INR' },
    { id: 'scale', name: 'Studio Scale', credits: 1000, price: 2999, currency: 'INR' },
];

const nowIso = new Date().toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600 * 1000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400 * 1000).toISOString();

export const DEMO_IDEAS: Idea[] = [
    {
        id: 'demo-idea-1',
        title: 'PulseFlow AI',
        description:
            'An AI-powered preventive health and cognitive recovery copilot for remote engineers and knowledge workers. PulseFlow syncs wearable HRV/sleep biometrics with work calendars to trigger personalized micro-breaks, posture resets, and deep-work pacing before burnout hits.',
        industry: 'HealthTech / AI Wellness',
        targetAudience:
            'Remote software engineers, startup founders, and distributed tech teams aged 24-42 experiencing burnout and sedentary fatigue.',
        problemSolved:
            'Knowledge workers lose 6+ productive hours weekly to burnout, neck/back strain, and fragmented wellness apps that ignore real-time meeting schedules.',
        startupStage: 'Seed',
        amount: '₹1.5 Cr',
        userId: DEMO_USER.id,
        isArchived: false,
        createdAt: daysAgo(6),
        updatedAt: hoursAgo(2),
    },
    {
        id: 'demo-idea-2',
        title: 'GreenLoop',
        description:
            'A B2B circular packaging marketplace connecting Indian D2C brands with verified compostable and returnable mailer manufacturers, complete with automated carbon-savings compliance reporting.',
        industry: 'CleanTech / Supply Chain',
        targetAudience:
            'Fast-growing D2C skincare, apparel, and gourmet food brands shipping 5,000+ monthly orders.',
        problemSolved:
            'D2C brands face rising ESG pressure and 28-40% higher unit costs when sourcing sustainable packaging from fragmented regional vendors.',
        startupStage: 'Prototype',
        amount: '₹80 Lakhs',
        userId: DEMO_USER.id,
        isArchived: false,
        createdAt: daysAgo(14),
        updatedAt: daysAgo(2),
    },
];

// =============================================================================
// MODULE DATA PER IDEA
// =============================================================================

const PULSEFLOW_SLIDES: AISlide[] = [
    {
        type: 'title',
        title: 'PulseFlow AI',
        headline: 'Prevent Burnout Before It Ships',
        content:
            'PulseFlow AI is the intelligent recovery copilot for remote tech teams—combining wearable biometrics with calendar intelligence to sustain peak engineering focus.',
    },
    {
        type: 'problem',
        title: 'The Burnout Tax on Tech Teams',
        headline: '76% of remote engineers report moderate-to-high burnout',
        content: 'Existing wellness apps sit unused because they are disconnected from real work calendars and coding flow.',
        bullet_points: [
            'Remote tech teams lose ₹18L+ annually per 20 engineers to attrition and fatigue',
            'Generic meditation apps see under 9% 30-day retention among developers',
            'Back-to-back Zoom sprints leave zero recovery buffer between deep work blocks',
        ],
    },
    {
        type: 'solution',
        title: 'Calendar-Aware Biometric Copilot',
        headline: 'Right-timed micro-recovery inside your workflow',
        content: 'PulseFlow connects to Apple Watch, Garmin, Google Calendar, and Slack to protect focus and trigger 90-second recovery resets.',
        bullet_points: [
            'Real-time cognitive load score computed from HRV, sleep debt, and meeting density',
            'Auto-protects 90-minute deep-work blocks and inserts 3-minute posture/eye resets',
            'Anonymized team burnout radar for engineering managers without invading privacy',
        ],
    },
    {
        type: 'market',
        title: 'Market Opportunity',
        headline: '$14.8B Global Corporate Digital Wellness Market',
        content: 'Targeting 42M remote software and product professionals across India, North America, and Europe.',
        bullet_points: [
            'TAM: $14.8B global workplace digital health & productivity software',
            'SAM: $3.2B tech-first B2B team wellness & ergonomics tools',
            'SOM (Year 3): $24M ARR across 2,500 mid-market engineering orgs',
        ],
        chart: {
            type: 'bar',
            title: 'Target Market Segments ($M)',
            data: [
                { name: 'Mid-Market SaaS', value: 1450 },
                { name: 'Enterprise Tech', value: 1120 },
                { name: 'Remote Agencies', value: 630 },
            ],
        },
    },
    {
        type: 'traction',
        title: 'Early Traction & Pilot Proof',
        headline: '1,400+ waitlist signups & 4 paid B2B pilots live',
        content: 'Validated with fast-growing remote product teams over an 8-week closed beta.',
        bullet_points: [
            '68% weekly active retention across 210 beta engineers (7x industry average)',
            '31% reduction in self-reported afternoon fatigue within 21 days',
            '₹4.8L committed pilot ARR from 4 SaaS companies in Bengaluru & SF',
        ],
    },
    {
        type: 'business_model',
        title: 'B2B SaaS + Freemium PLG Engine',
        headline: 'High-margin recurring revenue with bottom-up adoption',
        content: 'Individual developers start free; teams upgrade for Slack/Calendar orchestration and manager insights.',
        bullet_points: [
            'Solo Pro: ₹499/month for individual wearable + calendar sync',
            'Team Plan: ₹799/seat/month for engineering teams (10–250 seats)',
            'Enterprise: Custom SSO, HRIS integration, and wellness stipend billing',
        ],
        chart: {
            type: 'pie',
            title: 'Projected Year-2 Revenue Mix',
            data: [
                { name: 'Team SaaS', value: 62 },
                { name: 'Enterprise', value: 24 },
                { name: 'Solo Pro', value: 14 },
            ],
        },
    },
    {
        type: 'competition',
        title: 'Why PulseFlow Wins',
        headline: 'Built for engineering workflows, not generic mindfulness',
        content: 'Unlike Calm or Headspace, PulseFlow acts on live work-schedule and wearable telemetry.',
        bullet_points: [
            'Zero manual check-ins — passive wearable + calendar signal fusion',
            'Privacy-first architecture: raw health metrics never shared with employers',
            'Native IDE, Slack, and Google Calendar integrations',
        ],
    },
    {
        type: 'team',
        title: 'Founding Team',
        headline: 'Ex-health-tech & developer-tools builders',
        content: 'Combining applied ML in wearable signals with B2B product-led growth.',
        bullet_points: [
            'Aarav Mehta (CEO) — Built remote developer productivity tools scaled to 40K users',
            'Dr. Kavya Nair (Co-Founder, Chief Science) — PhD in Wearable Biosignals & Stress Modeling',
            'Rohan Kulkarni (CTO) — Ex-staff backend engineer, real-time telemetry pipelines',
        ],
    },
    {
        type: 'ask',
        title: 'The Ask: ₹1.5 Cr Seed Round',
        headline: '₹1.5 Cr for 18 months runway to ₹2.5 Cr ARR',
        content: 'Fueling wearable integrations, enterprise SOC2 compliance, and B2B PLG distribution.',
        bullet_points: [
            '45% Product & Biometric AI Engineering',
            '35% B2B Growth, Developer Community & Pilots',
            '20% Security (SOC2/HIPAA) & Operations',
        ],
        chart: {
            type: 'pie',
            title: 'Use of Funds (%)',
            data: [
                { name: 'Engineering & AI', value: 45 },
                { name: 'GTM & Growth', value: 35 },
                { name: 'Compliance & Ops', value: 20 },
            ],
        },
    },
];

const GREENLOOP_SLIDES: AISlide[] = [
    {
        type: 'title',
        title: 'GreenLoop',
        headline: 'Circular Packaging Infrastructure for D2C Brands',
        content:
            'GreenLoop aggregates certified compostable and reusable packaging manufacturers so D2C brands cut plastic waste and packaging costs by 22%.',
    },
    {
        type: 'problem',
        title: 'D2C Packaging Is Broken',
        headline: '4.2M tonnes of e-commerce mailer waste annually',
        content: 'Brands want sustainable mailers but face high MOQs, inconsistent quality, and 35% price markups.',
        bullet_points: [
            'Minimum order quantities lock out emerging D2C brands',
            'Zero standardized verification for compostability and EPR compliance',
            'Manual WhatsApp/spreadsheet procurement across 10+ regional vendors',
        ],
    },
    {
        type: 'solution',
        title: 'Aggregated Sustainable Sourcing + EPR Tracking',
        headline: 'One platform for quotes, QC, and ESG compliance',
        content: 'Pool demand across 150+ D2C brands to unlock tier-1 factory pricing at low MOQs.',
        bullet_points: [
            'Instant pricing across 40+ verified eco-packaging SKUs',
            'Automated CPCB / EPR plastic-offset certificates per shipment batch',
            'Smart inventory reorder alerts synced with Shopify & Shiprocket',
        ],
    },
    {
        type: 'traction',
        title: 'Early Momentum',
        headline: '18 D2C brands onboarded in pilot batch',
        content: 'Processed 120,000 compostable mailers across beauty and apparel brands.',
        bullet_points: [
            '₹14L GMV processed in first 60 days',
            '24% average unit cost reduction for pilot brands',
            '92% repeat order rate within 45 days',
        ],
    },
    {
        type: 'business_model',
        title: 'Marketplace Take-Rate + SaaS Compliance',
        headline: '11% blended take-rate + ₹9,999/mo ESG dashboard',
        content: 'Monetizing both procurement volume and automated regulatory reporting.',
        chart: {
            type: 'pie',
            title: 'Revenue Breakdown',
            data: [
                { name: 'Marketplace Margin', value: 70 },
                { name: 'ESG SaaS', value: 20 },
                { name: 'Custom Branding', value: 10 },
            ],
        },
    },
    {
        type: 'ask',
        title: 'The Ask: ₹80 Lakhs Pre-Seed',
        headline: '₹80 Lakhs to scale supplier network to 500 D2C brands',
        content: 'Expanding vendor onboarding across Gujarat, Maharashtra, and Karnataka.',
        chart: {
            type: 'pie',
            title: 'Allocation of Funds',
            data: [
                { name: 'Supply & QC Ops', value: 40 },
                { name: 'Platform Tech', value: 35 },
                { name: 'D2C Sales', value: 25 },
            ],
        },
    },
];

export const DEMO_MODULES_BY_IDEA: Record<string, Record<string, any>> = {
    'demo-idea-1': {
        idea_validation: {
            idea_score: 86,
            summary:
                'PulseFlow AI addresses a high-urgency, budget-backed pain point among distributed engineering organizations. Pairing passive wearable telemetry with calendar-aware interventions solves the retention gap that plagues generic wellness apps.',
            feasibility: 'high',
            risk_heat_map: [
                { category: 'Market', level: 'low', description: 'Strong B2B willingness to pay for developer retention and productivity.' },
                { category: 'Execution', level: 'medium', description: 'Requires smooth cross-platform wearable & calendar sync UX.' },
                { category: 'Competition', level: 'medium', description: 'Incumbent wellness apps exist, though few integrate live calendar telemetry.' },
                { category: 'Tech', level: 'low', description: 'Apple HealthKit, Garmin API, and Google Calendar APIs are mature.' },
            ],
            swot: {
                strengths: [
                    'Zero-friction passive tracking via existing smartwatches and work calendars',
                    'Clear B2B ROI story tied to engineering retention and deep-work hours',
                    'Privacy-first design builds high employee trust and adoption',
                ],
                weaknesses: [
                    'Dependent on users owning a wearable device for peak biometric accuracy',
                    'Enterprise procurement cycles require SOC2 Type II readiness early',
                ],
            },
            market_demand_snapshot: [
                {
                    source: 'Google Trends',
                    signal_type: 'Developer burnout & recovery tools (+138% YoY)',
                    interpretation: 'Strong growing demand',
                    trend: 'up',
                },
                {
                    source: 'Gartner HR Report',
                    signal_type: 'Remote team wellbeing budgets',
                    interpretation: 'High enterprise spend priority',
                    trend: 'up',
                },
                {
                    source: 'App Store Reviews',
                    signal_type: 'Generic meditation apps',
                    interpretation: 'Declining retention for desk workers',
                    trend: 'down',
                },
            ],
            recommendations: [
                'Launch a calendar-only mode (no wearable required) as a free wedge to double top-of-funnel adoption.',
                'Publish an open-source "Engineering Focus & Burnout Benchmark" report to attract CTOs and VPs of Engineering.',
                'Prioritize Slack + Google Calendar one-click onboarding so teams see value in under 90 seconds.',
                'Bundle anonymized team stress heatmaps into the Team tier to justify B2B budget expansion.',
            ],
        },
        marketing_strategy: {
            timeline: [
                {
                    phase: 'Week 1: Positioning & Waitlist Engine',
                    activities: [
                        'Publish "The Remote Engineer Recovery Playbook" interactive microsite',
                        'Launch founder-led LinkedIn & X build-in-public series sharing beta telemetry insights',
                        'Set up referral loop offering 2 months free Pro for 3 engineering peer invites',
                    ],
                },
                {
                    phase: 'Week 2: Developer Community Seeding',
                    activities: [
                        'Run Show HN & Hacker News technical breakdown on HRV + calendar load modeling',
                        'Partner with 5 engineering leadership newsletters for sponsored deep-dives',
                        'Host live webinar with 2 remote CTOs on preventing silent team burnout',
                    ],
                },
                {
                    phase: 'Week 3: Product Hunt & PLG Push',
                    activities: [
                        'Execute coordinated Product Hunt launch with 40+ beta champion testimonials',
                        'Release free VS Code & Chrome extension showing live deep-work recovery timer',
                        'Launch retargeting ads aimed at Engineering Managers & Founders',
                    ],
                },
                {
                    phase: 'Week 4: B2B Conversion & Expansion',
                    activities: [
                        'Trigger automated Slack team-trial invitations once 3 coworkers join from the same domain',
                        'Publish 2 ROI case studies quantifying 31% fatigue reduction',
                        'Refine onboarding funnel based on Day-7 activation cohorts',
                    ],
                },
            ],
            target_segments: [
                {
                    name: 'Remote Engineering Teams (20–200 devs)',
                    description: 'Distributed SaaS companies investing heavily in developer velocity and retention.',
                    size: '48,000+ companies globally',
                },
                {
                    name: 'Wearable-First Solo Builders & Founders',
                    description: 'High-output founders using Apple Watch, Whoop, or Oura seeking sustainable pacing.',
                    size: '1.8M active power users',
                },
            ],
            channels: [
                {
                    name: 'Engineering Newsletters & Hacker News',
                    priority: 'high',
                    tactics: ['Technical deep-dives', 'Benchmark reports', 'Open-source focus timer'],
                },
                {
                    name: 'LinkedIn Founder Thought Leadership',
                    priority: 'high',
                    tactics: ['Burnout telemetry teardown posts', 'CTO interviews', 'Carousel playbooks'],
                },
                {
                    name: 'Slack & IDE Ecosystem Marketplaces',
                    priority: 'medium',
                    tactics: ['Slack App Directory SEO', 'VS Code Marketplace', 'Raycast extension'],
                },
            ],
            messaging_framework: {
                value_proposition:
                    'Protect your engineering team’s best thinking hours with automated, privacy-first recovery synced to their real calendar and wearable signals.',
                key_messages: [
                    'Wellness that works around your sprint calendar—not another app to remember.',
                    '100% employee-owned biometric privacy; managers only see opt-in team load trends.',
                    'Turn 3-minute micro-resets into 4+ extra hours of sustainable deep work every week.',
                ],
            },
            kpis: [
                'D7 Activation Rate > 55%',
                'Team Workspace Conversion >= 14%',
                'CAC Payback < 4 Months',
                'W4 Retention >= 65%',
                'Net Promoter Score > 52',
            ],
        },
        branding: {
            taglines: [
                'Sustain your sharpest hours.',
                'Calendar-aware recovery for modern builders.',
                'Prevent burnout before it ships.',
            ],
            brand_voice: {
                tone: 'Calm, Scientific & Builder-First',
                keywords: ['Restorative', 'Precision', 'Privacy-First', 'Flow-State', 'Human-Centered'],
                description:
                    'PulseFlow speaks like a trusted performance coach who respects an engineer’s time—clear, evidence-based, zero fluff, and deeply respectful of focus.',
            },
            typography: {
                heading_font: 'Sora',
                body_font: 'Inter',
            },
            color_palette: {
                primary: '#376EF9',
                secondary: '#06B6D4',
                accent: '#10B981',
            },
            ai_logos: [],
        },
        pitch_deck: {
            slides: PULSEFLOW_SLIDES,
        },
        gtm_strategy: {
            target_segments: [
                {
                    name: 'Seed-to-Series B Remote SaaS Teams',
                    description: 'Fast-moving engineering orgs with existing L&D or wellness stipends.',
                    priority: 'high',
                },
                {
                    name: 'Developer Experience (DevEx) Leaders',
                    description: 'Platform engineering leads measuring cognitive load and developer satisfaction.',
                    priority: 'high',
                },
                {
                    name: 'Tech Consultancies & Product Studios',
                    description: 'Billable engineering teams vulnerable to deadline crunch burnout.',
                    priority: 'medium',
                },
            ],
            pricing_strategy: {
                model: 'freemium',
                description:
                    'Bottom-up PLG freemium model: individual builders sync 1 calendar for free, while teams unlock automated Slack buffers, wearable fusion, and org-wide recovery analytics.',
                tiers: [
                    { name: 'Starter (Solo Focus)', price: '₹0 / month' },
                    { name: 'Pro Builder', price: '₹499 / month' },
                    { name: 'Engineering Team', price: '₹799 / seat / month' },
                    { name: 'Enterprise Org', price: '₹1,499 / seat / month' },
                ],
            },
            launch_plan: [
                {
                    phase: 'Phase 1: Private Beta',
                    timeline: 'Weeks 1–3',
                    activities: [
                        'Onboard 10 remote engineering teams (250+ engineers)',
                        'Validate wearable + calendar sync reliability',
                        'Collect baseline fatigue & focus metrics',
                    ],
                },
                {
                    phase: 'Phase 2: Public PLG Launch',
                    timeline: 'Weeks 4–6',
                    activities: [
                        'Launch on Product Hunt, Slack Directory & Raycast',
                        'Enable self-serve domain team upgrades',
                        'Release free calendar-only focus mode',
                    ],
                },
                {
                    phase: 'Phase 3: Mid-Market Sales',
                    timeline: 'Months 2–4',
                    activities: [
                        'Hire 1 Founding AE for 50–300 seat accounts',
                        'Complete SOC2 Type I certification',
                        'Partner with HR/Benefits platforms (Plum, Rippling)',
                    ],
                },
                {
                    phase: 'Phase 4: Scale & Ecosystem',
                    timeline: 'Months 5–9',
                    activities: [
                        'Launch Garmin, Whoop & Oura native integrations',
                        'Introduce team wellness stipend billing',
                        'Expand across US & EU remote-first hubs',
                    ],
                },
            ],
            growth_strategies: [
                {
                    strategy: 'Calendar Status Viral Loop',
                    description:
                        'When PulseFlow blocks a "Recovery Reset" on Google Calendar, teammates see a subtle, non-intrusive badge linking to the team benchmark.',
                },
                {
                    strategy: 'Domain-Based Team Expansion',
                    description:
                        'Once 3+ engineers from the same company domain activate Solo mode, offer the CTO a free 14-day Team Resilience Audit.',
                },
            ],
            kpis: [
                { metric: 'Weekly Active Engineers', target: '5,000+ in 6 mos', timeframe: 'Month 6' },
                { metric: 'Free-to-Team Conversion', target: '12–15%', timeframe: 'Monthly' },
                { metric: 'Net Dollar Retention', target: '118%+', timeframe: 'Annual' },
                { metric: 'Paid Pilot Close Rate', target: '40%', timeframe: 'Quarterly' },
            ],
        },
        competitor_analysis: {
            competitors: [
                {
                    name: 'Calm Business',
                    website: 'calm.com/business',
                    pricing: '₹650 / employee / mo',
                    description: 'Enterprise meditation and sleep audio library.',
                    strengths: ['Strong brand awareness', 'Large audio content library'],
                    weaknesses: ['Passive usage drops after week 2', 'Zero calendar or IDE integration'],
                },
                {
                    name: 'Clockwise',
                    website: 'getclockwise.com',
                    pricing: '₹560 / user / mo',
                    description: 'AI calendar scheduling assistant for focus time.',
                    strengths: ['Deep calendar optimization', 'Popular with engineering orgs'],
                    weaknesses: ['No biometric or fatigue awareness', 'Scheduling-only scope'],
                },
                {
                    name: 'Whoop Unite',
                    website: 'whoop.com',
                    pricing: '₹2,400 / user / mo',
                    description: 'Hardware-locked recovery tracking for teams.',
                    strengths: ['Accurate biometric tracking', 'Strong athletic community'],
                    weaknesses: ['Requires expensive proprietary band', 'Not built for knowledge-work calendars'],
                },
                {
                    name: 'Reclaim.ai',
                    website: 'reclaim.ai',
                    pricing: '₹690 / seat / mo',
                    description: 'Smart calendar time-blocking for tasks and habits.',
                    strengths: ['Flexible habit scheduling', 'Slack status sync'],
                    weaknesses: ['Ignores physiological stress & sleep debt', 'Manual habit configuration'],
                },
                {
                    name: 'Headspace Health',
                    website: 'headspace.com',
                    pricing: '₹850 / user / mo',
                    description: 'Mental health & mindfulness coaching platform.',
                    strengths: ['Clinical therapy network', 'Enterprise HR partnerships'],
                    weaknesses: ['High seat cost', 'Low developer engagement'],
                },
            ],
            market_overview:
                'The workplace wellbeing market is split between generic content libraries (Calm, Headspace) that suffer <10% retention, and calendar optimizers (Clockwise, Reclaim) that ignore human energy signals. PulseFlow owns the intersection: real-time biometric awareness embedded directly into engineering schedules.',
            competitive_advantages: [
                'Only platform fusing wearable HRV/sleep debt with live calendar density',
                'Hardware-agnostic: works with Apple Watch, Garmin, Oura, or calendar-only mode',
                'Privacy-preserving architecture built specifically for skeptical engineering teams',
            ],
            gaps_in_market: [
                'No incumbent ties break timing to actual meeting overload and coding blocks',
                'Zero affordable Indian/global SaaS pricing tailored for distributed startups',
                'Existing HR wellness tools lack actionable, non-creepy team workload visibility',
            ],
            positioning_recommendations: [
                'Position squarely in the "Developer Productivity & Retention" budget rather than generic HR perks.',
                'Lead with a 30-second Google Calendar + Slack integration demo before asking for wearable permissions.',
                'Highlight privacy guarantees on every landing page and security brief to win developer champions.',
            ],
        },
        grants: {
            recommendations: [
                {
                    title: 'Startup India Seed Fund Scheme (SISFS)',
                    reason: 'Strong fit for Seed-stage AI health & productivity software incorporated in India.',
                    category: 'Government Grant',
                    funding: 'Up to ₹20 Lakhs (Grant) / ₹50 Lakhs (Debt)',
                },
                {
                    title: 'NIDHI-PRAYAS (DST)',
                    reason: 'Ideal for validating wearable signal-processing prototypes and health telemetry algorithms.',
                    category: 'DeepTech / Prototype',
                    funding: 'Up to ₹10 Lakhs Non-Dilutive',
                },
                {
                    title: 'AWS Activate / Google for Startups Cloud',
                    reason: 'Covers real-time ML inference and telemetry pipeline hosting costs during early scale.',
                    category: 'Cloud Credits',
                    funding: 'Up to $100,000 in Credits',
                },
            ],
            roadmap: [
                {
                    stage: 'Idea',
                    icon: 'lightbulb',
                    description: 'Validate wearable-to-calendar signal accuracy and secure academic/clinical advisors.',
                    grants: ['MeitY TIDE 2.0', 'NIDHI-PRAYAS'],
                    checklist: [
                        'Incorporate DPIIT-recognized Startup India entity',
                        'Document 8-week pilot fatigue-reduction metrics',
                        'Apply to university incubator (CIIE / NSRCEL / IIT-M)',
                    ],
                },
                {
                    stage: 'Seed',
                    icon: 'sprout',
                    description: 'Scale B2B pilots and offset cloud AI inference costs with non-dilutive capital.',
                    grants: ['Startup India Seed Fund (SISFS)', 'AWS Activate'],
                    checklist: [
                        'Prepare pitch deck & 18-month financial projection',
                        'Submit SISFS application through 3 partner incubators',
                        'Complete SOC2 readiness checklist for enterprise pilots',
                    ],
                },
                {
                    stage: 'Growth',
                    icon: 'rocket',
                    description: 'Expand internationally into US/EU remote-first enterprise accounts.',
                    grants: ['BIRAC BIG / HealthTech Accelerator', 'Google AI Startup Fund'],
                    checklist: [
                        'Publish peer-reviewed whitepaper on HRV + productivity',
                        'Apply for global B2B SaaS accelerator cohorts',
                    ],
                },
            ],
        },
    },
    'demo-idea-2': {
        idea_validation: {
            idea_score: 79,
            summary:
                'GreenLoop tackles a clear regulatory and unit-economics bottleneck for Indian D2C brands. Pooling demand to lower MOQs and automating EPR compliance creates strong B2B stickiness.',
            feasibility: 'high',
            risk_heat_map: [
                { category: 'Market', level: 'low', description: 'EPR plastic compliance mandates are driving immediate D2C adoption.' },
                { category: 'Execution', level: 'medium', description: 'Requires strict supplier QC and regional warehouse logistics.' },
                { category: 'Competition', level: 'low', description: 'Traditional packaging brokers lack digital quoting and EPR analytics.' },
                { category: 'Tech', level: 'low', description: 'Standard marketplace + Shopify/Shiprocket API integrations.' },
            ],
            swot: {
                strengths: [
                    '20-25% cost savings via aggregated D2C demand pooling',
                    'Automated EPR compliance certificates act as a high-retention SaaS wedge',
                ],
                weaknesses: [
                    'Working capital cycle management across regional manufacturers',
                    'Freight costs can erode margins for long-distance bulky shipments',
                ],
            },
            market_demand_snapshot: [
                {
                    source: 'CPCB Mandate',
                    signal_type: 'D2C EPR Packaging Compliance',
                    interpretation: 'Strong regulatory tailwind',
                    trend: 'up',
                },
                {
                    source: 'D2C India Pulse',
                    signal_type: 'Compostable mailer adoption',
                    interpretation: 'Growing 64% annually',
                    trend: 'up',
                },
            ],
            recommendations: [
                'Focus initially on 3 high-density D2C hubs (Mumbai, Bengaluru, Delhi-NCR) to keep freight under 6%.',
                'Offer free custom brand-printing mockups inside the quoting flow to win D2C founders.',
            ],
        },
        marketing_strategy: {
            timeline: [
                {
                    phase: 'Week 1: D2C Sample Kit Campaign',
                    activities: [
                        'Ship 100 free "Zero-Plastic Unboxing" sample kits to top Shopify D2C founders',
                        'Launch Packaging Cost & Carbon Calculator landing page',
                    ],
                },
                {
                    phase: 'Week 2: Ecosystem Partnerships',
                    activities: [
                        'Co-host EPR compliance workshop with D2C logistics aggregators',
                        'Publish teardown of top 10 sustainable D2C unboxing experiences',
                    ],
                },
            ],
            target_segments: [
                {
                    name: 'Beauty & Personal Care D2C Brands',
                    description: 'High repeat order volume and eco-conscious Gen-Z customer base.',
                    size: '12,000+ brands in India',
                },
            ],
            channels: [
                {
                    name: 'Direct Sample Kit Outreach',
                    priority: 'high',
                    tactics: ['Physical sample boxes', 'Founder LinkedIn DMs', 'Cost comparison audits'],
                },
            ],
            messaging_framework: {
                value_proposition: 'Switch to certified sustainable packaging at 22% lower cost—with automated EPR compliance included.',
                key_messages: ['Low MOQs starting at 1,000 units', 'Zero greenwashing—lab-certified compostable stock'],
            },
            kpis: ['Sample-to-Order Rate > 28%', 'Monthly Reorder Retention > 85%'],
        },
        branding: {
            taglines: ['Unbox a cleaner future.', 'Circular packaging built for D2C scale.'],
            brand_voice: {
                tone: 'Practical, Transparent & Eco-Forward',
                keywords: ['Circular', 'Verified', 'D2C-Ready', 'Zero-Waste'],
                description: 'Grounded, metrics-driven sustainability without vague eco-jargon.',
            },
            typography: { heading_font: 'Sora', body_font: 'Inter' },
            color_palette: { primary: '#10B981', secondary: '#059669', accent: '#14B8A6' },
            ai_logos: [],
        },
        pitch_deck: { slides: GREENLOOP_SLIDES },
        gtm_strategy: {
            target_segments: [
                { name: 'Mid-Size Shopify D2C Brands', description: '5,000–50,000 shipments/month.', priority: 'high' },
            ],
            pricing_strategy: {
                model: 'subscription',
                description: '11% marketplace margin + optional ₹9,999/mo EPR Compliance Dashboard.',
                tiers: [
                    { name: 'Marketplace Sourcing', price: '11% take-rate' },
                    { name: 'EPR Pro Suite', price: '₹9,999 / month' },
                ],
            },
            launch_plan: [
                { phase: 'Cluster 1', timeline: 'Months 1–2', activities: ['Onboard 40 Bengaluru & Mumbai D2C brands'] },
                { phase: 'Cluster 2', timeline: 'Months 3–5', activities: ['Launch automated Shopify reorder app'] },
            ],
            growth_strategies: [
                { strategy: 'Co-Branded "Packed with GreenLoop" QR Badge', description: 'Turns every customer unboxing into B2B brand discovery.' },
            ],
            kpis: [{ metric: 'Monthly GMV', target: '₹50L+', timeframe: 'Month 6' }],
        },
        competitor_analysis: {
            competitors: [
                {
                    name: 'Bizongo',
                    website: 'bizongo.com',
                    pricing: 'Enterprise Custom',
                    description: 'Large B2B packaging procurement platform.',
                    strengths: ['Massive supplier network', 'Enterprise financing'],
                    weaknesses: ['High MOQs for small D2C brands', 'Limited ESG/EPR focus'],
                },
            ],
            market_overview: 'Incumbent B2B packaging platforms focus on heavy enterprise volumes, leaving growing D2C brands underserved on sustainable, low-MOQ sourcing.',
            competitive_advantages: ['Low MOQs via demand aggregation', 'Automated CPCB EPR compliance built-in'],
            gaps_in_market: ['No unified certified-compostable marketplace for sub-50k/mo D2C brands'],
            positioning_recommendations: ['Lead with instant unit-cost audit + free sample kit.'],
        },
        grants: {
            recommendations: [
                {
                    title: 'Startup India Seed Fund (SISFS)',
                    reason: 'Strong sustainability and MSME manufacturing impact.',
                    category: 'Government Grant',
                    funding: 'Up to ₹20 Lakhs',
                },
            ],
            roadmap: [
                {
                    stage: 'Prototype',
                    icon: 'star',
                    description: 'Complete supplier quality audits and onboard 50 recurring D2C brands.',
                    grants: ['SISFS', 'CIIE CleanTech Cohort'],
                    checklist: ['Verify 15 CPCB-certified manufacturers', 'Launch Shopify inventory sync'],
                },
            ],
        },
    },
};

export function createInitialDemoDecks(): DeckRecord[] {
    const pulseDoc = convertAIToDeckDocument(
        { slides: PULSEFLOW_SLIDES },
        'PulseFlow AI — Seed Pitch Deck'
    );
    const greenDoc = convertAIToDeckDocument(
        { slides: GREENLOOP_SLIDES },
        'GreenLoop — Pre-Seed Deck'
    );

    return [
        {
            id: 'demo-deck-1',
            userId: DEMO_USER.id,
            ideaId: 'demo-idea-1',
            title: pulseDoc.title,
            data: pulseDoc,
            thumbnail: null,
            createdAt: daysAgo(4),
            updatedAt: hoursAgo(3),
        },
        {
            id: 'demo-deck-2',
            userId: DEMO_USER.id,
            ideaId: 'demo-idea-2',
            title: greenDoc.title,
            data: greenDoc,
            thumbnail: null,
            createdAt: daysAgo(9),
            updatedAt: daysAgo(2),
        },
    ];
}

// =============================================================================
// COMMUNITY DEMO DATA
// =============================================================================

export const DEMO_COMMUNITY_POSTS: CommunityPost[] = [
    {
        id: 'demo-post-1',
        userId: DEMO_USER.id,
        userName: DEMO_USER.name,
        userAvatar: null,
        ideaId: 'demo-idea-1',
        ideaTitle: 'PulseFlow AI',
        industry: 'HealthTech',
        content:
            'Just wrapped an 8-week pilot with 210 remote engineers using PulseFlow AI. Pairing Apple Watch HRV trends with Google Calendar density cut afternoon fatigue by 31%—without forcing anyone to open another meditation app. Happy to share our retention teardown!',
        status: 'PUBLISHED',
        isAutoPost: false,
        aiGenerated: false,
        rejectReason: null,
        likeCount: 42,
        dislikeCount: 0,
        commentCount: 2,
        shareCount: 7,
        createdAt: hoursAgo(5),
        updatedAt: hoursAgo(5),
    },
    {
        id: 'demo-post-2',
        userId: 'demo-founder-2',
        userName: 'Ananya Verma',
        userAvatar: null,
        ideaId: 'ext-idea-1',
        ideaTitle: 'FinLedger Copilot',
        industry: 'Fintech',
        content:
            'Question for early-stage SaaS founders: did GST + TDS reconciliation automation become a top-3 pain point right after crossing ₹10L MRR? Building a 1-click AI bookkeeper for Indian SaaS startups and looking for 5 beta testers.',
        status: 'PUBLISHED',
        isAutoPost: false,
        aiGenerated: true,
        rejectReason: null,
        likeCount: 34,
        dislikeCount: 1,
        commentCount: 1,
        shareCount: 4,
        createdAt: hoursAgo(14),
        updatedAt: hoursAgo(14),
    },
    {
        id: 'demo-post-3',
        userId: 'demo-founder-3',
        userName: 'Vikramaditya Rao',
        userAvatar: null,
        ideaId: 'ext-idea-2',
        ideaTitle: 'KisanGrid AI',
        industry: 'AI/ML',
        content:
            'Cold-storage spoilage in tier-2 mandis is a 22% margin leak. Our IoT + vision sensor kit predicts shelf-life 72 hours ahead so FPOs can route produce dynamically. Seed deck review welcome!',
        status: 'PUBLISHED',
        isAutoPost: false,
        aiGenerated: false,
        rejectReason: null,
        likeCount: 58,
        dislikeCount: 0,
        commentCount: 1,
        shareCount: 11,
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1),
    },
    {
        id: 'demo-post-4',
        userId: DEMO_USER.id,
        userName: DEMO_USER.name,
        userAvatar: null,
        ideaId: 'demo-idea-2',
        ideaTitle: 'GreenLoop',
        industry: 'CleanTech',
        content:
            'Shipped 120,000 certified compostable mailers for 18 D2C skincare & apparel brands via GreenLoop! Demand pooling dropped unit packaging costs by 24% compared to solo vendor quotes.',
        status: 'PUBLISHED',
        isAutoPost: true,
        aiGenerated: true,
        rejectReason: null,
        likeCount: 29,
        dislikeCount: 0,
        commentCount: 0,
        shareCount: 5,
        createdAt: daysAgo(3),
        updatedAt: daysAgo(3),
    },
];

export const DEMO_COMMENTS_BY_POST: Record<string, PostComment[]> = {
    'demo-post-1': [
        {
            id: 'demo-comment-1',
            userId: 'demo-founder-2',
            userName: 'Ananya Verma',
            userAvatar: null,
            postId: 'demo-post-1',
            content: '68% WAU retention on wellness is wild! Love that managers only see anonymized load trends.',
            parentId: null,
            createdAt: hoursAgo(3),
            replies: [],
        },
        {
            id: 'demo-comment-2',
            userId: 'demo-founder-3',
            userName: 'Vikramaditya Rao',
            userAvatar: null,
            postId: 'demo-post-1',
            content: 'Would love to test this with our 14-person engineering squad in Bengaluru.',
            parentId: null,
            createdAt: hoursAgo(2),
            replies: [],
        },
    ],
    'demo-post-2': [
        {
            id: 'demo-comment-3',
            userId: DEMO_USER.id,
            userName: DEMO_USER.name,
            userAvatar: null,
            postId: 'demo-post-2',
            content: '100% yes—reconciling Stripe/Razorpay payouts with GST invoices was our biggest time sink.',
            parentId: null,
            createdAt: hoursAgo(10),
            replies: [],
        },
    ],
    'demo-post-3': [
        {
            id: 'demo-comment-4',
            userId: DEMO_USER.id,
            userName: DEMO_USER.name,
            userAvatar: null,
            postId: 'demo-post-3',
            content: 'Impressive unit impact! Have you looked into NIDHI-PRAYAS or BIRAC agri-tech grants?',
            parentId: null,
            createdAt: hoursAgo(18),
            replies: [],
        },
    ],
};

export const DEMO_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'ach-1',
        userId: DEMO_USER.id,
        achievementType: 'FIRST_IDEA_VALIDATED',
        earnedAt: daysAgo(5),
        metadata: {},
        description: 'Validated your first startup idea above 80/100',
        credits: 15,
    },
    {
        id: 'ach-2',
        userId: DEMO_USER.id,
        achievementType: 'PITCH_DECK_BUILDER',
        earnedAt: daysAgo(3),
        metadata: {},
        description: 'Generated an investor-ready 9-slide pitch deck',
        credits: 20,
    },
];

export const DEMO_PROFILES: Record<string, UserPublicProfile> = {
    [DEMO_USER.id]: {
        userId: DEMO_USER.id,
        userName: DEMO_USER.name,
        userAvatar: null,
        startupName: 'PulseFlow AI',
        industry: 'HealthTech / AI Wellness',
        bio: 'Building preventive health & focus infrastructure for distributed engineering teams.',
        headline: 'Founder & CEO @ PulseFlow AI | Seed Stage',
        website: 'https://pulseflow.ai',
        twitter: '@aaravmehta',
        linkedin: 'linkedin.com/in/aaravmehta',
        stats: {
            totalPosts: 2,
            totalLikes: 71,
            totalComments: 2,
            followerCount: 148,
            followingCount: 24,
        },
    },
    'demo-founder-2': {
        userId: 'demo-founder-2',
        userName: 'Ananya Verma',
        userAvatar: null,
        startupName: 'FinLedger Copilot',
        industry: 'Fintech',
        bio: 'Automating GST, TDS, and SaaS revenue recognition for Indian founders.',
        headline: 'Co-Founder @ FinLedger Copilot',
        website: 'https://finledger.in',
        twitter: '@ananyaverma',
        linkedin: 'linkedin.com/in/ananyaverma',
        stats: {
            totalPosts: 1,
            totalLikes: 34,
            totalComments: 1,
            followerCount: 92,
            followingCount: 31,
        },
    },
    'demo-founder-3': {
        userId: 'demo-founder-3',
        userName: 'Vikramaditya Rao',
        userAvatar: null,
        startupName: 'KisanGrid AI',
        industry: 'AgriTech / AI',
        bio: 'Reducing post-harvest cold-chain losses with edge computer vision.',
        headline: 'Founder @ KisanGrid AI',
        website: 'https://kisangrid.ai',
        twitter: '@vikramrao',
        linkedin: 'linkedin.com/in/vikramrao',
        stats: {
            totalPosts: 1,
            totalLikes: 58,
            totalComments: 1,
            followerCount: 215,
            followingCount: 19,
        },
    },
};

export const DEMO_DAILY_ANALYTICS = [
    { date: daysAgo(6).slice(0, 10), likes: 8, comments: 1, shares: 1, posts: 1 },
    { date: daysAgo(5).slice(0, 10), likes: 12, comments: 0, shares: 2, posts: 0 },
    { date: daysAgo(4).slice(0, 10), likes: 15, comments: 1, shares: 2, posts: 0 },
    { date: daysAgo(3).slice(0, 10), likes: 19, comments: 0, shares: 3, posts: 1 },
    { date: daysAgo(2).slice(0, 10), likes: 9, comments: 0, shares: 2, posts: 0 },
    { date: daysAgo(1).slice(0, 10), likes: 8, comments: 0, shares: 2, posts: 0 },
    { date: nowIso.slice(0, 10), likes: 14, comments: 2, shares: 1, posts: 0 },
];

// =============================================================================
// CLIENT-SIDE VALID PDF GENERATOR FOR DEMO EXPORTS
// =============================================================================

function escapePdfText(text: string): string {
    return text
        .replace(/[^\x20-\x7E]/g, ' ')
        .replace(/\\/g, '\\\\')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)');
}

function wrapLine(text: string, maxChars = 84): string[] {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
        if ((current + ' ' + word).trim().length > maxChars) {
            if (current) lines.push(current);
            current = word;
        } else {
            current = (current + ' ' + word).trim();
        }
    }
    if (current) lines.push(current);
    return lines.length ? lines : [''];
}

/**
 * Generates a real, downloadable single-page PDF Data URL in pure JS
 * so "Export PDF" / "Startup Summary" buttons work offline in Demo Mode.
 */
export function createDemoPdfDataUrl(
    title: string,
    sections: Array<{ heading: string; lines: string[] }>
): string {
    const streamOps: string[] = [
        'BT',
        '/F2 18 Tf',
        '50 755 Td',
        `(${escapePdfText(title)}) Tj`,
        '/F1 10 Tf',
        '0 -18 Td',
        '(Generated via Pitchrr Interactive Demo) Tj',
        '0 -16 Td',
    ];

    let linesUsed = 4;
    const maxLines = 44;

    for (const section of sections) {
        if (linesUsed >= maxLines) break;
        streamOps.push('/F2 12 Tf');
        streamOps.push('0 -14 Td');
        streamOps.push(`(${escapePdfText(section.heading)}) Tj`);
        linesUsed += 2;

        streamOps.push('/F1 10 Tf');
        for (const rawLine of section.lines) {
            for (const wrapped of wrapLine(rawLine)) {
                if (linesUsed >= maxLines) break;
                streamOps.push('0 -13 Td');
                streamOps.push(`(${escapePdfText(wrapped)}) Tj`);
                linesUsed += 1;
            }
        }
    }

    streamOps.push('ET');
    const contentStream = streamOps.join('\n');

    const objects = [
        '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
        '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
        '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >> endobj',
        `4 0 obj << /Length ${contentStream.length} >> stream\n${contentStream}\nendstream endobj`,
        '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
        '6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj',
    ];

    let pdf = '%PDF-1.4\n';
    const offsets: number[] = [0];
    for (const obj of objects) {
        offsets.push(pdf.length);
        pdf += obj + '\n';
    }
    const xrefPos = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    for (let i = 1; i < offsets.length; i++) {
        pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

    return `data:application/pdf;base64,${btoa(pdf)}`;
}
