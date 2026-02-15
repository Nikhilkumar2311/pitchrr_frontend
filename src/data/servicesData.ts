/**
 * Services Data
 *
 * Centralized definitions for all Pitchrr service categories and their
 * individual offerings. Designed for easy extension (e.g. adding booking
 * links, pricing tiers, or session types in the future).
 */

import {
    Building2,
    ShieldCheck,
    BadgeIndianRupee,
    Paintbrush,
    Scale,
    type LucideIcon,
} from "lucide-react";

export interface ServiceItem {
    id: string;
    title: string;
    description: string;
}

export interface ServiceCategory {
    id: string;
    title: string;
    icon: LucideIcon;
    color: string;         // tailwind-compatible hex for icon / accent
    bgColor: string;       // light background tint for the category badge
    services: ServiceItem[];
}

export const serviceCategories: ServiceCategory[] = [
    {
        id: "corporate",
        title: "Corporate & Business Incorporation Services",
        icon: Building2,
        color: "#3B82F6",   // blue-500
        bgColor: "#EFF6FF", // blue-50
        services: [
            {
                id: "pvt-ltd",
                title: "Private Limited Company Incorporation",
                description:
                    "End-to-end registration of your Private Limited company with MCA compliance and documentation.",
            },
            {
                id: "llp",
                title: "Limited Liability Partnership (LLP) Registration",
                description:
                    "Register your LLP with a streamlined process covering agreement drafting and filing.",
            },
            {
                id: "partnership",
                title: "Partnership Firm Registration",
                description:
                    "Quick formation and registration of partnership firms with deed preparation.",
            },
            {
                id: "ngo",
                title: "NGO & Section 8 Company Incorporation",
                description:
                    "Set up your non-profit with Section 8 incorporation, trust registration, or society formation.",
            },
            {
                id: "gem",
                title: "GeM Registration",
                description:
                    "Get registered on the Government e-Marketplace to access public procurement opportunities.",
            },
        ],
    },
    {
        id: "regulatory",
        title: "Regulatory & Certification Services",
        icon: ShieldCheck,
        color: "#10B981",   // emerald-500
        bgColor: "#ECFDF5", // emerald-50
        services: [
            {
                id: "dpiit",
                title: "Startup India Recognition (DPIIT)",
                description:
                    "Obtain DPIIT recognition to unlock tax benefits, funding access, and compliance relaxations.",
            },
            {
                id: "80g-12a",
                title: "80G & 12A Tax Exemptions",
                description:
                    "Secure tax exemption certificates for your NGO or Section 8 company under the Income Tax Act.",
            },
            {
                id: "iso",
                title: "ISO Certifications",
                description:
                    "Achieve internationally recognised quality management certifications for your business.",
            },
            {
                id: "fssai",
                title: "FSSAI License & Registration",
                description:
                    "Obtain the mandatory food safety license or registration for your food business.",
            },
        ],
    },
    {
        id: "funding",
        title: "Funding & Capital Advisory",
        icon: BadgeIndianRupee,
        color: "#F59E0B",   // amber-500
        bgColor: "#FFFBEB", // amber-50
        services: [
            {
                id: "govt-loans",
                title: "Government Loans & Grant Facilitation",
                description:
                    "Navigate and apply for MUDRA, CGTMSE, Startup India Seed Fund, and other government schemes.",
            },
            {
                id: "seed-funding",
                title: "Seed Funding & Venture Capital Support",
                description:
                    "Pitch preparation, investor connects, and due-diligence support for early-stage fundraising.",
            },
            {
                id: "invoice-discounting",
                title: "Invoice Discounting & NBFC Financing",
                description:
                    "Unlock working capital through invoice discounting and alternative financing channels.",
            },
        ],
    },
    {
        id: "branding",
        title: "Strategic Branding & Design Solutions",
        icon: Paintbrush,
        color: "#8B5CF6",   // violet-500
        bgColor: "#F5F3FF", // violet-50
        services: [
            {
                id: "brand-identity",
                title: "Brand Identity & Logo Design",
                description:
                    "Craft a distinctive visual identity with logo, typography, and brand guidelines.",
            },
            {
                id: "ui-ux",
                title: "UI/UX Design",
                description:
                    "User-centric interface design with wireframes, prototypes, and usability testing.",
            },
            {
                id: "website-ui",
                title: "Website UI Design",
                description:
                    "Modern, responsive website designs that convert visitors into customers.",
            },
            {
                id: "pitch-deck-design",
                title: "Investor Pitch Deck & Corporate Presentation Design",
                description:
                    "Compelling investor decks and corporate presentations that tell your story effectively.",
            },
            {
                id: "marketing-collaterals",
                title: "Marketing & Corporate Collaterals",
                description:
                    "Brochures, flyers, social media kits, and all marketing materials your brand needs.",
            },
            {
                id: "packaging",
                title: "Product & Packaging Design",
                description:
                    "Eye-catching packaging and product design that stands out on shelves and screens.",
            },
            {
                id: "custom-design",
                title: "Custom Design Solutions",
                description:
                    "Bespoke design work tailored to your specific business requirements.",
            },
        ],
    },
    {
        id: "ip",
        title: "Intellectual Property Advisory Services",
        icon: Scale,
        color: "#EF4444",   // red-500
        bgColor: "#FEF2F2", // red-50
        services: [
            {
                id: "trademark",
                title: "Trademark Registration",
                description:
                    "Protect your brand name, logo, and tagline with comprehensive trademark registration.",
            },
            {
                id: "patent",
                title: "Patent Filing & Advisory",
                description:
                    "Secure your inventions with patent search, drafting, and filing services.",
            },
            {
                id: "copyright",
                title: "Copyright Registration",
                description:
                    "Register copyrights for your creative works, software, and literary content.",
            },
            {
                id: "ip-strategy",
                title: "IP Strategy Consulting",
                description:
                    "Comprehensive IP portfolio strategy to maximize the value of your intellectual assets.",
            },
        ],
    },
];
