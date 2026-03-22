/**
 * Startup Card Generator
 *
 * Creates premium business/brand cards using AI-generated branding data.
 * 3 template styles: Modern, Minimal, Bold.
 * Supports live preview with editable fields and PNG download.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2, CreditCard, Mail, Globe, Phone, User, Briefcase, ImagePlus, Gift } from 'lucide-react';
import { toPng } from 'html-to-image';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

interface StartupCardProps {
    startupName: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor?: string;
    headingFont?: string;
    bodyFont?: string;
    tagline?: string;
    logoUrl?: string;
    brandValues?: string[];
    positioning?: string;
}

type CardTemplate = 'modern' | 'minimal' | 'bold';

const CARD_CREDIT_COST = 2;

/**
 * Slightly darken a hex color for gradient effects
 */
function darkenColor(hex: string, amount: number = 0.2): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
    const g = Math.max(0, Math.floor(((num >> 8) & 0x00ff) * (1 - amount)));
    const b = Math.max(0, Math.floor((num & 0x0000ff) * (1 - amount)));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

/**
 * Get a contrasting text color (white or dark) for a given background
 */
function getContrastText(hex: string): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = num >> 16;
    const g = (num >> 8) & 0x00ff;
    const b = num & 0x0000ff;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1a1a2e' : '#ffffff';
}

export function StartupCard({
    startupName,
    primaryColor,
    secondaryColor,
    accentColor,
    headingFont = 'Inter',
    bodyFont = 'Inter',
    tagline = '',
    logoUrl,
    brandValues = [],
    positioning = '',
}: StartupCardProps) {
    const frontCardRef = useRef<HTMLDivElement>(null);
    const backCardRef = useRef<HTMLDivElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>('modern');
    const [customLogo, setCustomLogo] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // Fetch credit stats
    const { data: creditStats } = useQuery({
        queryKey: ['credits', 'stats'],
        queryFn: async () => {
            const response = await api.get('/credits');
            return response.data;
        },
    });

    const freeCardAvailable = creditStats && !creditStats.freeCardUsed;

    // Editable fields
    const [founderName, setFounderName] = useState('');
    const [founderTitle, setFounderTitle] = useState('Founder & CEO');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [phone, setPhone] = useState('');

    // Resolved logo (custom upload overrides AI logo)
    const resolvedLogo = customLogo || logoUrl;

    // Handle logo upload
    const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be under 5MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setCustomLogo(reader.result as string);
            toast.success('Logo updated!');
        };
        reader.readAsDataURL(file);
    }, []);

    // Dynamically load fonts
    useEffect(() => {
        const fonts = [headingFont, bodyFont].filter(f => f && f !== 'Inter');
        fonts.forEach(font => {
            const fontId = `card-font-${font.replace(/\s+/g, '-').toLowerCase()}`;
            if (!document.getElementById(fontId)) {
                const link = document.createElement('link');
                link.id = fontId;
                link.rel = 'stylesheet';
                link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;600;700;800&display=swap`;
                document.head.appendChild(link);
            }
        });
    }, [headingFont, bodyFont]);

    const handleDownload = useCallback(async () => {
        if (!frontCardRef.current || !backCardRef.current) return;
        setIsDownloading(true);

        // Credit check
        const currentStats = queryClient.getQueryData<any>(['credits', 'stats']);
        const isFreeDownload = currentStats && !currentStats.freeCardUsed;

        if (isFreeDownload) {
            try {
                await api.post('/credits/use-free-card');
                queryClient.invalidateQueries({ queryKey: ['credits', 'stats'] });
                toast.success('🎉 Free card download used!');
            } catch (err: any) {
                if (err?.response?.status === 409) {
                    toast('Free download already used, deducting credits...');
                } else {
                    toast.error('Failed to process. Please try again.');
                    setIsDownloading(false);
                    return;
                }
            }
        } else {
            try {
                const { data } = await api.post('/credits/deduct', {
                    amount: CARD_CREDIT_COST,
                    reason: `Startup card download: ${selectedTemplate} front+back`,
                });
                queryClient.setQueryData(['credits', 'stats'], (old: any) => ({
                    ...old,
                    balance: data.newBalance,
                }));
                queryClient.invalidateQueries({ queryKey: ['credits', 'stats'] });
            } catch (err: any) {
                if (err?.response?.status === 402) {
                    toast.error(`Insufficient credits. Card download requires ${CARD_CREDIT_COST} credits.`);
                } else {
                    toast.error('Failed to process credits. Please try again.');
                }
                setIsDownloading(false);
                return;
            }
        }

        // Export both cards
        try {
            const [frontUrl, backUrl] = await Promise.all([
                toPng(frontCardRef.current, { quality: 1, pixelRatio: 3, cacheBust: true }),
                toPng(backCardRef.current, { quality: 1, pixelRatio: 3, cacheBust: true }),
            ]);
            const frontLink = document.createElement('a');
            frontLink.download = `${startupName || 'startup'}-card-front.png`;
            frontLink.href = frontUrl;
            frontLink.click();
            // Small delay so browser handles two downloads
            await new Promise(r => setTimeout(r, 500));
            const backLink = document.createElement('a');
            backLink.download = `${startupName || 'startup'}-card-back.png`;
            backLink.href = backUrl;
            backLink.click();
            if (!isFreeDownload) {
                toast.success('Both cards downloaded!');
            }
        } catch {
            toast.error('Failed to export cards');
        }
        setIsDownloading(false);
    }, [startupName, selectedTemplate, queryClient]);

    const accent = accentColor || secondaryColor;
    const contrastOnPrimary = getContrastText(primaryColor);

    // ─── Template definitions ─────────────────────────────────────
    const templates: { id: CardTemplate; label: string }[] = [
        { id: 'modern', label: 'Modern' },
        { id: 'minimal', label: 'Minimal' },
        { id: 'bold', label: 'Bold' },
    ];

    // ─── Card renderers ───────────────────────────────────────────
    const renderModernCard = () => (
        <div
            style={{
                width: 480,
                height: 280,
                display: 'flex',
                borderRadius: 16,
                overflow: 'hidden',
                fontFamily: `'${bodyFont}', 'Inter', sans-serif`,
                background: '#ffffff',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
        >
            {/* Left gradient sidebar */}
            <div
                style={{
                    width: 160,
                    background: `linear-gradient(180deg, ${primaryColor} 0%, ${darkenColor(primaryColor, 0.25)} 100%)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px 16px',
                    gap: 12,
                }}
            >
                {resolvedLogo ? (
                    <img
                        src={resolvedLogo}
                        alt="Logo"
                        style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'contain', background: 'rgba(255,255,255,0.15)' }}
                    />
                ) : (
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 12,
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                            fontWeight: 800,
                            color: '#fff',
                            fontFamily: `'${headingFont}', 'Inter', sans-serif`,
                        }}
                    >
                        {(startupName || 'S').charAt(0).toUpperCase()}
                    </div>
                )}
                <div style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: '#fff',
                            fontFamily: `'${headingFont}', 'Inter', sans-serif`,
                            letterSpacing: '0.5px',
                            lineHeight: 1.2,
                        }}
                    >
                        {startupName || 'Your Startup'}
                    </div>
                    {tagline && (
                        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.75)', marginTop: 4, lineHeight: 1.3 }}>
                            {tagline.length > 50 ? tagline.substring(0, 50) + '...' : tagline}
                        </div>
                    )}
                </div>
            </div>

            {/* Right content */}
            <div
                style={{
                    flex: 1,
                    padding: '28px 28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: '#1a1a2e',
                            fontFamily: `'${headingFont}', 'Inter', sans-serif`,
                            lineHeight: 1.2,
                        }}
                    >
                        {founderName || 'Your Name'}
                    </div>
                    <div style={{ fontSize: 12, color: primaryColor, fontWeight: 600, marginTop: 3 }}>
                        {founderTitle}
                    </div>
                    <div
                        style={{
                            width: 40,
                            height: 3,
                            borderRadius: 2,
                            background: `linear-gradient(90deg, ${primaryColor}, ${accent})`,
                            marginTop: 12,
                        }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#555' }}>
                            <div style={{ width: 16, height: 16, borderRadius: 4, background: `${primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 9, color: primaryColor }}>✉</span>
                            </div>
                            {email}
                        </div>
                    )}
                    {website && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#555' }}>
                            <div style={{ width: 16, height: 16, borderRadius: 4, background: `${primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 9, color: primaryColor }}>🌐</span>
                            </div>
                            {website}
                        </div>
                    )}
                    {phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#555' }}>
                            <div style={{ width: 16, height: 16, borderRadius: 4, background: `${primaryColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 9, color: primaryColor }}>📞</span>
                            </div>
                            {phone}
                        </div>
                    )}
                    {!email && !website && !phone && (
                        <div style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic' }}>
                            Add contact info below ↓
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderMinimalCard = () => (
        <div
            style={{
                width: 480,
                height: 280,
                borderRadius: 16,
                overflow: 'hidden',
                fontFamily: `'${bodyFont}', 'Inter', sans-serif`,
                background: '#ffffff',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                padding: '32px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
            }}
        >
            {/* Subtle top accent line */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${primaryColor}, ${accent})`,
                }}
            />

            {/* Top row: logo + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {resolvedLogo ? (
                    <img
                        src={resolvedLogo}
                        alt="Logo"
                        style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'contain' }}
                    />
                ) : (
                    <div
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 10,
                            background: `${primaryColor}12`,
                            border: `2px solid ${primaryColor}30`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 20,
                            fontWeight: 800,
                            color: primaryColor,
                            fontFamily: `'${headingFont}', 'Inter', sans-serif`,
                        }}
                    >
                        {(startupName || 'S').charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <div
                        style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: '#1a1a2e',
                            fontFamily: `'${headingFont}', 'Inter', sans-serif`,
                        }}
                    >
                        {startupName || 'Your Startup'}
                    </div>
                    {tagline && (
                        <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>
                            {tagline.length > 60 ? tagline.substring(0, 60) + '...' : tagline}
                        </div>
                    )}
                </div>
            </div>

            {/* Middle: founder info */}
            <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', fontFamily: `'${headingFont}', 'Inter', sans-serif` }}>
                    {founderName || 'Your Name'}
                </div>
                <div style={{ fontSize: 12, color: primaryColor, fontWeight: 600, marginTop: 2 }}>
                    {founderTitle}
                </div>
            </div>

            {/* Bottom: contact row */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {email && (
                    <div style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ color: primaryColor, fontSize: 10 }}>✉</span> {email}
                    </div>
                )}
                {website && (
                    <div style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ color: primaryColor, fontSize: 10 }}>🌐</span> {website}
                    </div>
                )}
                {phone && (
                    <div style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ color: primaryColor, fontSize: 10 }}>📞</span> {phone}
                    </div>
                )}
                {!email && !website && !phone && (
                    <div style={{ fontSize: 11, color: '#bbb', fontStyle: 'italic' }}>Add contact info below ↓</div>
                )}
            </div>
        </div>
    );

    const renderBoldCard = () => (
        <div
            style={{
                width: 480,
                height: 280,
                borderRadius: 16,
                overflow: 'hidden',
                fontFamily: `'${bodyFont}', 'Inter', sans-serif`,
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${darkenColor(primaryColor, 0.3)} 100%)`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                padding: '28px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
            }}
        >
            {/* Decorative circle */}
            <div
                style={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    width: 160,
                    height: 160,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)',
                }}
            />

            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div>
                    <div
                        style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: contrastOnPrimary,
                            fontFamily: `'${headingFont}', 'Inter', sans-serif`,
                            letterSpacing: '0.5px',
                        }}
                    >
                        {startupName || 'Your Startup'}
                    </div>
                    {tagline && (
                        <div style={{ fontSize: 10, color: `${contrastOnPrimary}99`, marginTop: 4 }}>
                            {tagline.length > 50 ? tagline.substring(0, 50) + '...' : tagline}
                        </div>
                    )}
                </div>
                {resolvedLogo ? (
                    <img
                        src={resolvedLogo}
                        alt="Logo"
                        style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'contain', background: 'rgba(255,255,255,0.15)' }}
                    />
                ) : (
                    <div
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: 10,
                            background: 'rgba(255,255,255,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                            fontWeight: 800,
                            color: contrastOnPrimary,
                            fontFamily: `'${headingFont}', 'Inter', sans-serif`,
                        }}
                    >
                        {(startupName || 'S').charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            {/* Separator */}
            <div style={{ width: 48, height: 2, background: `${contrastOnPrimary}30`, borderRadius: 1, position: 'relative', zIndex: 1 }} />

            {/* Bottom section */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: contrastOnPrimary, fontFamily: `'${headingFont}', 'Inter', sans-serif` }}>
                    {founderName || 'Your Name'}
                </div>
                <div style={{ fontSize: 11, color: `${contrastOnPrimary}88`, fontWeight: 500, marginTop: 2 }}>
                    {founderTitle}
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
                    {email && (
                        <div style={{ fontSize: 10, color: `${contrastOnPrimary}bb`, display: 'flex', alignItems: 'center', gap: 4 }}>
                            ✉ {email}
                        </div>
                    )}
                    {website && (
                        <div style={{ fontSize: 10, color: `${contrastOnPrimary}bb`, display: 'flex', alignItems: 'center', gap: 4 }}>
                            🌐 {website}
                        </div>
                    )}
                    {phone && (
                        <div style={{ fontSize: 10, color: `${contrastOnPrimary}bb`, display: 'flex', alignItems: 'center', gap: 4 }}>
                            📞 {phone}
                        </div>
                    )}
                    {!email && !website && !phone && (
                        <div style={{ fontSize: 10, color: `${contrastOnPrimary}55`, fontStyle: 'italic' }}>Add contact info below ↓</div>
                    )}
                </div>
            </div>
        </div>
    );

    const cardRenderers = {
        modern: renderModernCard,
        minimal: renderMinimalCard,
        bold: renderBoldCard,
    };

    // ─── Back side renderers ──────────────────────────────────────
    const renderModernBack = () => (
        <div
            style={{
                width: 480, height: 280, display: 'flex', borderRadius: 16,
                overflow: 'hidden', fontFamily: `'${bodyFont}', 'Inter', sans-serif`,
                background: '#ffffff', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
        >
            <div
                style={{
                    width: 160,
                    background: `linear-gradient(180deg, ${primaryColor} 0%, ${darkenColor(primaryColor, 0.25)} 100%)`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '24px 16px',
                }}
            >
                {resolvedLogo ? (
                    <img src={resolvedLogo} alt="Logo" style={{ width: 80, height: 80, borderRadius: 14, objectFit: 'contain', background: 'rgba(255,255,255,0.15)' }} />
                ) : (
                    <div style={{ width: 80, height: 80, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800, color: '#fff', fontFamily: `'${headingFont}', sans-serif` }}>
                        {(startupName || 'S').charAt(0).toUpperCase()}
                    </div>
                )}
            </div>
            <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                {tagline && (
                    <div style={{ fontSize: 13, fontWeight: 600, color: primaryColor, fontStyle: 'italic', lineHeight: 1.4, fontFamily: `'${headingFont}', sans-serif` }}>
                        "{tagline.length > 80 ? tagline.substring(0, 80) + '...' : tagline}"
                    </div>
                )}
                {brandValues.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {brandValues.slice(0, 4).map((v, i) => (
                            <span key={i} style={{ fontSize: 9, fontWeight: 600, color: primaryColor, background: `${primaryColor}10`, borderRadius: 4, padding: '3px 8px', border: `1px solid ${primaryColor}20` }}>{v}</span>
                        ))}
                    </div>
                )}
                {positioning && (
                    <div style={{ fontSize: 10, color: '#777', lineHeight: 1.5 }}>
                        {positioning.length > 120 ? positioning.substring(0, 120) + '...' : positioning}
                    </div>
                )}
                {website && <div style={{ fontSize: 11, color: primaryColor, fontWeight: 600 }}>🌐 {website}</div>}
            </div>
        </div>
    );

    const renderMinimalBack = () => (
        <div
            style={{
                width: 480, height: 280, borderRadius: 16, overflow: 'hidden',
                fontFamily: `'${bodyFont}', 'Inter', sans-serif`, background: '#ffffff',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '32px 36px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative',
            }}
        >
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${primaryColor}, ${accent})` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', fontFamily: `'${headingFont}', sans-serif` }}>
                    {startupName || 'Your Startup'}
                </div>
                {resolvedLogo && <img src={resolvedLogo} alt="Logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'contain' }} />}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, paddingTop: 8 }}>
                {tagline && <div style={{ fontSize: 14, fontWeight: 600, color: primaryColor, fontStyle: 'italic', fontFamily: `'${headingFont}', sans-serif` }}>"{tagline.length > 70 ? tagline.substring(0, 70) + '...' : tagline}"</div>}
                {brandValues.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {brandValues.slice(0, 5).map((v, i) => (
                            <span key={i} style={{ fontSize: 9, fontWeight: 600, color: primaryColor, background: `${primaryColor}08`, borderRadius: 4, padding: '3px 8px' }}>{v}</span>
                        ))}
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 10, color: '#888' }}>
                {email && <span>✉ {email}</span>}
                {website && <span>🌐 {website}</span>}
            </div>
        </div>
    );

    const renderBoldBack = () => (
        <div
            style={{
                width: 480, height: 280, borderRadius: 16, overflow: 'hidden',
                fontFamily: `'${bodyFont}', 'Inter', sans-serif`,
                background: `linear-gradient(135deg, ${darkenColor(primaryColor, 0.1)} 0%, ${darkenColor(primaryColor, 0.4)} 100%)`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)', padding: '28px 32px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative',
            }}
        >
            <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: contrastOnPrimary, fontFamily: `'${headingFont}', sans-serif`, letterSpacing: '0.5px' }}>{startupName || 'Your Startup'}</div>
                {resolvedLogo && <img src={resolvedLogo} alt="Logo" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'contain', background: 'rgba(255,255,255,0.12)' }} />}
            </div>
            <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                {tagline && <div style={{ fontSize: 14, fontWeight: 600, color: `${contrastOnPrimary}dd`, fontStyle: 'italic' }}>"{tagline.length > 60 ? tagline.substring(0, 60) + '...' : tagline}"</div>}
                {brandValues.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {brandValues.slice(0, 4).map((v, i) => (
                            <span key={i} style={{ fontSize: 9, fontWeight: 600, color: contrastOnPrimary, background: `${contrastOnPrimary}15`, borderRadius: 4, padding: '3px 8px' }}>{v}</span>
                        ))}
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 10, color: `${contrastOnPrimary}99`, position: 'relative', zIndex: 1 }}>
                {email && <span>✉ {email}</span>}
                {website && <span>🌐 {website}</span>}
                {phone && <span>📞 {phone}</span>}
            </div>
        </div>
    );

    const backRenderers = {
        modern: renderModernBack,
        minimal: renderMinimalBack,
        bold: renderBoldBack,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-5">
                <h2
                    className="text-[18px] font-bold flex items-center gap-2"
                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                >
                    <CreditCard className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                    Startup Card
                </h2>
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-[12px] font-semibold transition-all cursor-pointer"
                    style={{
                        background: freeCardAvailable
                            ? 'linear-gradient(135deg, #10B981, #059669)'
                            : `linear-gradient(135deg, ${primaryColor}, ${darkenColor(primaryColor, 0.1)})`,
                        color: freeCardAvailable ? '#fff' : contrastOnPrimary,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                        opacity: isDownloading ? 0.7 : 1,
                    }}
                >
                    {isDownloading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : freeCardAvailable ? (
                        <Gift className="w-3.5 h-3.5" />
                    ) : (
                        <Download className="w-3.5 h-3.5" />
                    )}
                    {isDownloading ? 'Exporting...' : freeCardAvailable ? 'Download FREE' : `Download (${CARD_CREDIT_COST} credits)`}
                </button>
            </div>

            {/* Template Selector + Upload */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
                <div
                    className="flex gap-1 p-1 rounded-[8px]"
                    style={{ background: 'rgba(0,0,0,0.03)' }}
                >
                    {templates.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setSelectedTemplate(t.id)}
                            className="px-4 py-2 rounded-[6px] text-[12px] font-medium transition-all cursor-pointer"
                            style={{
                                background: selectedTemplate === t.id ? 'white' : 'transparent',
                                color: selectedTemplate === t.id ? 'var(--dash-text)' : 'var(--dash-text-muted)',
                                boxShadow: selectedTemplate === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => logoInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-[12px] font-medium transition-all cursor-pointer"
                    style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--dash-text-muted)' }}
                >
                    <ImagePlus className="w-3.5 h-3.5" />
                    {customLogo ? 'Change Logo' : 'Upload Logo'}
                </button>
                <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                />
                {customLogo && (
                    <button
                        onClick={() => { setCustomLogo(null); toast.success('Reverted to AI logo'); }}
                        className="text-[11px] font-medium cursor-pointer"
                        style={{ color: '#ef4444' }}
                    >
                        Reset Logo
                    </button>
                )}
            </div>

            {/* Card Preview — Front + Back side by side */}
            <div className="flex gap-6 mb-6 flex-wrap justify-center">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--dash-text-muted)' }}>Front</span>
                    <div ref={frontCardRef} style={{ display: 'inline-block' }}>
                        {cardRenderers[selectedTemplate]()}
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--dash-text-muted)' }}>Back</span>
                    <div ref={backCardRef} style={{ display: 'inline-block' }}>
                        {backRenderers[selectedTemplate]()}
                    </div>
                </div>
            </div>

            {/* Editable Fields */}
            <div
                className="grid grid-cols-2 gap-3 p-5 rounded-[12px]"
                style={{ background: 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}
            >
                <div className="col-span-2">
                    <label className="block text-[11px] font-semibold mb-1.5" style={{ color: 'var(--dash-text-muted)' }}>
                        <User className="w-3 h-3 inline mr-1" />
                        Founder Name
                    </label>
                    <input
                        type="text"
                        value={founderName}
                        onChange={e => setFounderName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 rounded-[8px] text-[13px] outline-none transition-all"
                        style={{
                            border: '1px solid rgba(0,0,0,0.08)',
                            color: 'var(--dash-text)',
                            background: 'white',
                        }}
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-semibold mb-1.5" style={{ color: 'var(--dash-text-muted)' }}>
                        <Briefcase className="w-3 h-3 inline mr-1" />
                        Title
                    </label>
                    <input
                        type="text"
                        value={founderTitle}
                        onChange={e => setFounderTitle(e.target.value)}
                        placeholder="Founder & CEO"
                        className="w-full px-3 py-2 rounded-[8px] text-[13px] outline-none transition-all"
                        style={{
                            border: '1px solid rgba(0,0,0,0.08)',
                            color: 'var(--dash-text)',
                            background: 'white',
                        }}
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-semibold mb-1.5" style={{ color: 'var(--dash-text-muted)' }}>
                        <Phone className="w-3 h-3 inline mr-1" />
                        Phone
                    </label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 rounded-[8px] text-[13px] outline-none transition-all"
                        style={{
                            border: '1px solid rgba(0,0,0,0.08)',
                            color: 'var(--dash-text)',
                            background: 'white',
                        }}
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-semibold mb-1.5" style={{ color: 'var(--dash-text-muted)' }}>
                        <Mail className="w-3 h-3 inline mr-1" />
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="hello@startup.com"
                        className="w-full px-3 py-2 rounded-[8px] text-[13px] outline-none transition-all"
                        style={{
                            border: '1px solid rgba(0,0,0,0.08)',
                            color: 'var(--dash-text)',
                            background: 'white',
                        }}
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-semibold mb-1.5" style={{ color: 'var(--dash-text-muted)' }}>
                        <Globe className="w-3 h-3 inline mr-1" />
                        Website
                    </label>
                    <input
                        type="url"
                        value={website}
                        onChange={e => setWebsite(e.target.value)}
                        placeholder="www.startup.com"
                        className="w-full px-3 py-2 rounded-[8px] text-[13px] outline-none transition-all"
                        style={{
                            border: '1px solid rgba(0,0,0,0.08)',
                            color: 'var(--dash-text)',
                            background: 'white',
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
}
