/**
 * Logo Presets Component
 * 
 * 25 pre-made SVG logo templates that dynamically adapt to the user's
 * startup name and selected colors. A random subset of 15 is shown
 * each time the component mounts, so users see variety across ideas.
 * 
 * First logo download is FREE, subsequent downloads cost 2 credits.
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Download, Loader2, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { CreditCost } from '@/components/common';

interface LogoTemplateProps {
    name: string;
    primaryColor: string;
    secondaryColor: string;
}

const PRESET_CREDIT_COST = 2;
const DISPLAY_COUNT = 15; // show this many from the full pool

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 1: Circle Lettermark — first letter in a filled circle
// ═══════════════════════════════════════════════════════════════
const CircleLettermark = ({ name, primaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="85" fill={primaryColor} />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="80" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 2: Rounded Square — letter in a rounded rect
// ═══════════════════════════════════════════════════════════════
const RoundedSquare = ({ name, primaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="160" height="160" rx="32" fill={primaryColor} />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="76" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 3: Dual Letter — first two letters side by side
// ═══════════════════════════════════════════════════════════════
const DualLetter = ({ name, primaryColor, secondaryColor }: LogoTemplateProps) => {
    const letters = (name || 'Pi').substring(0, 2).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="40" width="85" height="120" rx="16" fill={primaryColor} />
            <rect x="105" y="40" width="85" height="120" rx="16" fill={secondaryColor} />
            <text
                x="52" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="56" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letters[0]}
            </text>
            <text
                x="148" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="56" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letters[1] || ''}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 4: Hexagon Mark — letter inside a hexagon
// ═══════════════════════════════════════════════════════════════
const HexagonMark = ({ name, primaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <polygon
                points="100,10 180,55 180,145 100,190 20,145 20,55"
                fill={primaryColor}
            />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="72" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 5: Gradient Ring — ring with gradient + letter
// ═══════════════════════════════════════════════════════════════
const GradientRing = ({ name, primaryColor, secondaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    const id = `ring-grad-${primaryColor.replace('#', '')}`;
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={primaryColor} />
                    <stop offset="100%" stopColor={secondaryColor} />
                </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="85" fill="none" stroke={`url(#${id})`} strokeWidth="14" />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill={primaryColor} fontSize="72" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 6: Stacked — abstract shape + name below
// ═══════════════════════════════════════════════════════════════
const StackedMark = ({ name, primaryColor, secondaryColor }: LogoTemplateProps) => {
    const displayName = (name || 'Startup').substring(0, 10);
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M100 20 L140 70 L120 70 L120 110 L80 110 L80 70 L60 70 Z"
                fill={primaryColor}
            />
            <circle cx="100" cy="90" r="12" fill={secondaryColor} />
            <text
                x="100" y="160"
                textAnchor="middle" dominantBaseline="middle"
                fill={primaryColor} fontSize={displayName.length > 7 ? 20 : 26} fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
                letterSpacing="2"
            >
                {displayName.toUpperCase()}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 7: Bold Text — thick text with underline bar
// ═══════════════════════════════════════════════════════════════
const BoldText = ({ name, primaryColor }: LogoTemplateProps) => {
    const displayName = (name || 'Startup').substring(0, 8);
    const fontSize = displayName.length > 6 ? 28 : displayName.length > 4 ? 34 : 42;
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <text
                x="100" y="95"
                textAnchor="middle" dominantBaseline="middle"
                fill={primaryColor} fontSize={fontSize} fontWeight="800"
                fontFamily="Inter, system-ui, sans-serif"
                letterSpacing="3"
            >
                {displayName.toUpperCase()}
            </text>
            <rect x="30" y="118" width="140" height="6" rx="3" fill={primaryColor} />
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 8: Diamond — letter inside a rotated square
// ═══════════════════════════════════════════════════════════════
const DiamondMark = ({ name, primaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect
                x="42" y="42" width="116" height="116" rx="16"
                fill={primaryColor}
                transform="rotate(45 100 100)"
            />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="64" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 9: Split Circle — half-and-half circle with letter
// ═══════════════════════════════════════════════════════════════
const SplitCircle = ({ name, primaryColor, secondaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 15 A85 85 0 0 0 100 185 Z" fill={primaryColor} />
            <path d="M100 15 A85 85 0 0 1 100 185 Z" fill={secondaryColor} />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="72" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 10: Minimal Dot — small dot accent + clean text
// ═══════════════════════════════════════════════════════════════
const MinimalDot = ({ name, primaryColor, secondaryColor }: LogoTemplateProps) => {
    const displayName = (name || 'Startup').substring(0, 8);
    const fontSize = displayName.length > 6 ? 26 : displayName.length > 4 ? 32 : 38;
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <text
                x="100" y="105"
                textAnchor="middle" dominantBaseline="middle"
                fill={primaryColor} fontSize={fontSize} fontWeight="600"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {displayName}
            </text>
            <circle cx="168" cy="75" r="10" fill={secondaryColor} />
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 11: Shield Badge — letter inside a shield shape
// ═══════════════════════════════════════════════════════════════
const ShieldBadge = ({ name, primaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M100 15 L175 50 L175 120 C175 155 140 180 100 195 C60 180 25 155 25 120 L25 50 Z"
                fill={primaryColor}
            />
            <text
                x="100" y="115"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="72" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 12: Gradient Fill — letter on a gradient circle
// ═══════════════════════════════════════════════════════════════
const GradientFill = ({ name, primaryColor, secondaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    const id = `fill-grad-${primaryColor.replace('#', '')}`;
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={primaryColor} />
                    <stop offset="100%" stopColor={secondaryColor} />
                </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="85" fill={`url(#${id})`} />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="78" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 13: Corner Bracket — letter framed by corner brackets
// ═══════════════════════════════════════════════════════════════
const CornerBracket = ({ name, primaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            {/* Top-left bracket */}
            <path d="M30 70 L30 30 L70 30" fill="none" stroke={primaryColor} strokeWidth="10" strokeLinecap="round" />
            {/* Top-right bracket */}
            <path d="M130 30 L170 30 L170 70" fill="none" stroke={primaryColor} strokeWidth="10" strokeLinecap="round" />
            {/* Bottom-left bracket */}
            <path d="M30 130 L30 170 L70 170" fill="none" stroke={primaryColor} strokeWidth="10" strokeLinecap="round" />
            {/* Bottom-right bracket */}
            <path d="M130 170 L170 170 L170 130" fill="none" stroke={primaryColor} strokeWidth="10" strokeLinecap="round" />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill={primaryColor} fontSize="72" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 14: Wave Banner — name text on a curved wave
// ═══════════════════════════════════════════════════════════════
const WaveBanner = ({ name, primaryColor, secondaryColor }: LogoTemplateProps) => {
    const displayName = (name || 'Startup').substring(0, 8);
    const fontSize = displayName.length > 6 ? 26 : displayName.length > 4 ? 32 : 38;
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            {/* Wave shape */}
            <path
                d="M0 90 Q50 60 100 90 Q150 120 200 90 L200 200 L0 200 Z"
                fill={primaryColor} opacity="0.12"
            />
            <path
                d="M0 110 Q50 80 100 110 Q150 140 200 110 L200 200 L0 200 Z"
                fill={secondaryColor} opacity="0.08"
            />
            <text
                x="100" y="85"
                textAnchor="middle" dominantBaseline="middle"
                fill={primaryColor} fontSize={fontSize} fontWeight="800"
                fontFamily="Inter, system-ui, sans-serif"
                letterSpacing="2"
            >
                {displayName.toUpperCase()}
            </text>
            <rect x="70" y="108" width="60" height="4" rx="2" fill={primaryColor} />
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 15: Monogram Ring — two-letter monogram in a thin ring
// ═══════════════════════════════════════════════════════════════
const MonogramRing = ({ name, primaryColor }: LogoTemplateProps) => {
    const letters = (name || 'Pi').substring(0, 2).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="85" fill="none" stroke={primaryColor} strokeWidth="4" />
            <circle cx="100" cy="100" r="75" fill="none" stroke={primaryColor} strokeWidth="1.5" opacity="0.3" />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill={primaryColor} fontSize="58" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
                letterSpacing="4"
            >
                {letters}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 16: Layered Circles — overlapping circles with letter
// ═══════════════════════════════════════════════════════════════
const LayeredCircles = ({ name, primaryColor, secondaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="80" cy="100" r="65" fill={primaryColor} opacity="0.8" />
            <circle cx="120" cy="100" r="65" fill={secondaryColor} opacity="0.6" />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="60" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 17: Star Badge — letter inside a 6-point star
// ═══════════════════════════════════════════════════════════════
const StarBadge = ({ name, primaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <polygon
                points="100,10 120,70 185,70 130,110 150,175 100,135 50,175 70,110 15,70 80,70"
                fill={primaryColor}
            />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="52" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 18: Pill Badge — name inside a pill shape
// ═══════════════════════════════════════════════════════════════
const PillBadge = ({ name, primaryColor }: LogoTemplateProps) => {
    const displayName = (name || 'Startup').substring(0, 7);
    const fontSize = displayName.length > 5 ? 24 : displayName.length > 3 ? 30 : 36;
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="55" width="170" height="90" rx="45" fill={primaryColor} />
            <text
                x="100" y="105"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize={fontSize} fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
                letterSpacing="2"
            >
                {displayName.toUpperCase()}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 19: Diagonal Split — diagonally split rectangle
// ═══════════════════════════════════════════════════════════════
const DiagonalSplit = ({ name, primaryColor, secondaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 20 L180 20 L180 180 L20 20 Z" fill={primaryColor} />
            <path d="M20 20 L180 180 L20 180 L20 20 Z" fill={secondaryColor} />
            <text
                x="100" y="120"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="72" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 20: Circle Outline — outlined circle with bold letter
// ═══════════════════════════════════════════════════════════════
const CircleOutline = ({ name, primaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="none" stroke={primaryColor} strokeWidth="8" />
            <circle cx="100" cy="100" r="65" fill="none" stroke={primaryColor} strokeWidth="2" opacity="0.3" />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill={primaryColor} fontSize="80" fontWeight="800"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 21: Ribbon — letter on a ribbon/banner shape
// ═══════════════════════════════════════════════════════════════
const RibbonMark = ({ name, primaryColor, secondaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 60 L170 60 L185 100 L170 140 L30 140 L15 100 Z" fill={primaryColor} />
            <path d="M30 60 L15 100 L30 140" fill="none" stroke={secondaryColor} strokeWidth="3" />
            <path d="M170 60 L185 100 L170 140" fill="none" stroke={secondaryColor} strokeWidth="3" />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="60" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 22: Octagon — letter inside an octagon
// ═══════════════════════════════════════════════════════════════
const OctagonMark = ({ name, primaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <polygon
                points="65,20 135,20 180,65 180,135 135,180 65,180 20,135 20,65"
                fill={primaryColor}
            />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="72" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 23: Three Bars — abstract bars + name
// ═══════════════════════════════════════════════════════════════
const ThreeBars = ({ name, primaryColor, secondaryColor }: LogoTemplateProps) => {
    const displayName = (name || 'Startup').substring(0, 8);
    const fontSize = displayName.length > 6 ? 22 : displayName.length > 4 ? 26 : 32;
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="30" width="20" height="80" rx="10" fill={primaryColor} />
            <rect x="90" y="50" width="20" height="60" rx="10" fill={secondaryColor} />
            <rect x="140" y="20" width="20" height="90" rx="10" fill={primaryColor} opacity="0.6" />
            <text
                x="100" y="160"
                textAnchor="middle" dominantBaseline="middle"
                fill={primaryColor} fontSize={fontSize} fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
                letterSpacing="2"
            >
                {displayName.toUpperCase()}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 24: Slash Mark — letter with a diagonal slash accent
// ═══════════════════════════════════════════════════════════════
const SlashMark = ({ name, primaryColor, secondaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <line x1="140" y1="30" x2="60" y2="170" stroke={secondaryColor} strokeWidth="20" strokeLinecap="round" opacity="0.25" />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill={primaryColor} fontSize="90" fontWeight="800"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE 25: Concentric Squares — nested rounded squares with letter
// ═══════════════════════════════════════════════════════════════
const ConcentricSquares = ({ name, primaryColor, secondaryColor }: LogoTemplateProps) => {
    const letter = (name || 'P').charAt(0).toUpperCase();
    return (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="15" width="170" height="170" rx="24" fill="none" stroke={primaryColor} strokeWidth="5" />
            <rect x="35" y="35" width="130" height="130" rx="18" fill="none" stroke={secondaryColor} strokeWidth="3" opacity="0.5" />
            <rect x="55" y="55" width="90" height="90" rx="14" fill={primaryColor} />
            <text
                x="100" y="108"
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="52" fontWeight="700"
                fontFamily="Inter, system-ui, sans-serif"
            >
                {letter}
            </text>
        </svg>
    );
};

// ═══════════════════════════════════════════════════════════════
// TEMPLATE REGISTRY
// ═══════════════════════════════════════════════════════════════

interface PresetTemplate {
    id: string;
    label: string;
    category: string;
    Component: React.FC<LogoTemplateProps>;
}

const allTemplates: PresetTemplate[] = [
    { id: 'circle', label: 'Circle', category: 'Lettermark', Component: CircleLettermark },
    { id: 'rounded', label: 'Rounded', category: 'Lettermark', Component: RoundedSquare },
    { id: 'dual', label: 'Duo', category: 'Lettermark', Component: DualLetter },
    { id: 'hexagon', label: 'Hexagon', category: 'Geometric', Component: HexagonMark },
    { id: 'ring', label: 'Ring', category: 'Geometric', Component: GradientRing },
    { id: 'stacked', label: 'Stacked', category: 'Minimal', Component: StackedMark },
    { id: 'bold', label: 'Bold', category: 'Bold', Component: BoldText },
    { id: 'diamond', label: 'Diamond', category: 'Geometric', Component: DiamondMark },
    { id: 'split', label: 'Split', category: 'Geometric', Component: SplitCircle },
    { id: 'minimal', label: 'Minimal', category: 'Minimal', Component: MinimalDot },
    { id: 'shield', label: 'Shield', category: 'Badge', Component: ShieldBadge },
    { id: 'gradient', label: 'Gradient', category: 'Lettermark', Component: GradientFill },
    { id: 'bracket', label: 'Bracket', category: 'Minimal', Component: CornerBracket },
    { id: 'wave', label: 'Wave', category: 'Banner', Component: WaveBanner },
    { id: 'monogram', label: 'Monogram', category: 'Lettermark', Component: MonogramRing },
    // ── NEW TEMPLATES ──
    { id: 'layered', label: 'Layered', category: 'Geometric', Component: LayeredCircles },
    { id: 'star', label: 'Star', category: 'Badge', Component: StarBadge },
    { id: 'pill', label: 'Pill', category: 'Bold', Component: PillBadge },
    { id: 'diagonal', label: 'Diagonal', category: 'Geometric', Component: DiagonalSplit },
    { id: 'outline', label: 'Outline', category: 'Minimal', Component: CircleOutline },
    { id: 'ribbon', label: 'Ribbon', category: 'Banner', Component: RibbonMark },
    { id: 'octagon', label: 'Octagon', category: 'Geometric', Component: OctagonMark },
    { id: 'bars', label: 'Bars', category: 'Abstract', Component: ThreeBars },
    { id: 'slash', label: 'Slash', category: 'Minimal', Component: SlashMark },
    { id: 'concentric', label: 'Concentric', category: 'Geometric', Component: ConcentricSquares },
];

// ═══════════════════════════════════════════════════════════════
// SHUFFLE UTIL (Fisher-Yates)
// ═══════════════════════════════════════════════════════════════

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ═══════════════════════════════════════════════════════════════
// SVG → PNG DOWNLOAD UTIL
// ═══════════════════════════════════════════════════════════════

function svgToPng(svgElement: SVGSVGElement, size: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (!ctx) { reject('No canvas context'); return; }
            ctx.drawImage(img, 0, 0, size, size);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject('Image load failed'); };
        img.src = url;
    });
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

interface LogoPresetsProps {
    startupName: string;
    primaryColor: string;
    secondaryColor: string;
    onSelect?: (templateId: string) => void;
}

export function LogoPresets({
    startupName,
    primaryColor,
    secondaryColor,
}: LogoPresetsProps) {
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // Fetch credit stats to check freeLogoUsed flag
    const { data: creditStats } = useQuery({
        queryKey: ['credits', 'stats'],
        queryFn: async () => {
            const response = await api.get('/credits');
            return response.data;
        },
    });

    const freeLogoAvailable = creditStats && !creditStats.freeLogoUsed;

    // Shuffle templates once on mount — useMemo with [] ensures stable randomization
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const templates = useMemo(() => shuffleArray(allTemplates).slice(0, DISPLAY_COUNT), []);

    const handleDownload = useCallback(async (templateId: string, svgContainer: HTMLDivElement) => {
        const svgEl = svgContainer.querySelector('svg');
        if (!svgEl) { toast.error('Logo not found'); return; }

        setDownloadingId(templateId);

        // Check if user still has free logo available
        const currentStats = queryClient.getQueryData<any>(['credits', 'stats']);
        const isFreeDownload = currentStats && !currentStats.freeLogoUsed;

        if (isFreeDownload) {
            // Use free logo endpoint — no credits deducted
            try {
                await api.post('/credits/use-free-logo');
                queryClient.invalidateQueries({ queryKey: ['credits', 'stats'] });
                toast.success('🎉 Free logo download used!');
            } catch (err: any) {
                if (err?.response?.status === 409) {
                    // Race condition: free logo already used, fall through to paid path
                    toast('Free download already used, deducting credits...');
                } else {
                    toast.error('Failed to process. Please try again.');
                    setDownloadingId(null);
                    return;
                }
            }
        } else {
            // Deduct credits for subsequent downloads
            try {
                const { data } = await api.post('/credits/deduct', {
                    amount: PRESET_CREDIT_COST,
                    reason: `Logo preset download: ${templateId}`,
                });
                queryClient.setQueryData(['credits', 'stats'], (old: any) => ({
                    ...old,
                    balance: data.newBalance,
                }));
                queryClient.invalidateQueries({ queryKey: ['credits', 'stats'] });
            } catch (err: any) {
                if (err?.response?.status === 402) {
                    toast.error(`Insufficient credits. Logo download requires ${PRESET_CREDIT_COST} credits.`);
                } else {
                    toast.error('Failed to process credits. Please try again.');
                }
                setDownloadingId(null);
                return;
            }
        }

        // Convert SVG → PNG and download
        try {
            const pngDataUrl = await svgToPng(svgEl, 512);
            const link = document.createElement('a');
            link.download = `${startupName || 'logo'}-${templateId}.png`;
            link.href = pngDataUrl;
            link.click();
            if (!isFreeDownload) {
                toast.success('Logo downloaded! (512×512)');
            }
        } catch {
            toast.error('Failed to export logo. Please try again.');
        }

        setDownloadingId(null);
    }, [startupName, queryClient]);

    return (
        <div>
            {/* Free logo banner */}
            {freeLogoAvailable && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-[10px] mb-4"
                    style={{
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(5,150,105,0.06))',
                        border: '1px solid rgba(16,185,129,0.15)',
                    }}
                >
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                    >
                        <Gift className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <span className="text-[13px] font-semibold" style={{ color: '#065F46' }}>
                            Your first logo download is FREE!
                        </span>
                        <span className="text-[12px] ml-1" style={{ color: '#047857' }}>
                            Click any logo to download it at no cost.
                        </span>
                    </div>
                </motion.div>
            )}

            <div className="flex items-center justify-between mb-4">
                <p
                    className="text-[13px]"
                    style={{ color: 'var(--dash-text-muted)' }}
                >
                    Click any logo to download as PNG
                </p>
                {freeLogoAvailable ? (
                    <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                        style={{
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            color: 'white',
                        }}
                    >
                        1 FREE
                    </span>
                ) : (
                    <CreditCost cost={PRESET_CREDIT_COST} />
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {templates.map((tmpl, i) => {
                    const { Component } = tmpl;
                    const isDownloading = downloadingId === tmpl.id;
                    return (
                        <motion.div
                            key={tmpl.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.02 * i }}
                            className="group relative flex flex-col items-center gap-2 p-3 rounded-[12px] cursor-pointer transition-all"
                            style={{
                                background: 'rgba(0,0,0,0.015)',
                                border: '1px solid var(--dash-border-solid, #E8ECF4)',
                                opacity: isDownloading ? 0.6 : 1,
                                pointerEvents: isDownloading ? 'none' : 'auto',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = freeLogoAvailable ? '#10B981' : '#8B5CF6';
                                e.currentTarget.style.boxShadow = freeLogoAvailable
                                    ? '0 0 0 3px rgba(16,185,129,0.08)'
                                    : '0 0 0 3px rgba(139,92,246,0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--dash-border-solid, #E8ECF4)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            onClick={(e) => {
                                const container = e.currentTarget.querySelector('.svg-container') as HTMLDivElement;
                                if (container) handleDownload(tmpl.id, container);
                            }}
                        >
                            {/* Download overlay on hover */}
                            <div
                                className="absolute inset-0 rounded-[12px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                style={{
                                    background: 'rgba(255,255,255,0.92)',
                                    backdropFilter: 'blur(4px)',
                                }}
                            >
                                {isDownloading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#8B5CF6' }} />
                                ) : (
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{
                                                background: freeLogoAvailable
                                                    ? 'linear-gradient(135deg, #10B981, #059669)'
                                                    : 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                                            }}
                                        >
                                            {freeLogoAvailable ? (
                                                <Gift className="w-5 h-5 text-white" />
                                            ) : (
                                                <Download className="w-5 h-5 text-white" />
                                            )}
                                        </div>
                                        <span
                                            className="text-[11px] font-bold"
                                            style={{
                                                color: freeLogoAvailable ? '#059669' : '#7C3AED',
                                            }}
                                        >
                                            {freeLogoAvailable ? 'FREE' : `${PRESET_CREDIT_COST} credits`}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="svg-container w-full aspect-square flex items-center justify-center">
                                <div className="w-[80%] h-[80%]">
                                    <Component
                                        name={startupName}
                                        primaryColor={primaryColor}
                                        secondaryColor={secondaryColor}
                                    />
                                </div>
                            </div>
                            <div className="text-center">
                                <div
                                    className="text-[12px] font-medium"
                                    style={{ color: 'var(--dash-text)' }}
                                >
                                    {tmpl.label}
                                </div>
                                <div
                                    className="text-[10px]"
                                    style={{ color: 'var(--dash-text-muted)' }}
                                >
                                    {tmpl.category}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
