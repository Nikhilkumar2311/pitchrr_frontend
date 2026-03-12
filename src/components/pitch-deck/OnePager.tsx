import { useState, useEffect } from 'react';
import { Download, X, Loader2, Globe, Target, Zap, Shield, Lightbulb, Upload, /*ExternalLink,*/ Palette } from 'lucide-react';
import { Button } from '@/components/ui';
import { useExportOnePager, useExportStatus } from '@/hooks';
// import { Link } from 'react-router-dom';

interface Slide {
    title: string;
    content: string;
    type?: string;
    bullet_points?: string[];
    headline?: string;
    image?: string;
    chart?: {
        type: 'pie' | 'bar' | 'line' | 'radar' | 'none';
        title?: string;
        data: Array<{ name: string; value: number }>;
    };
}

interface OnePagerProps {
    slides: Slide[];
    companyName?: string;
    ideaId: string;
    onClose: () => void;
}

// Available templates
const TEMPLATES = [
    { id: 'one-pager-v1', name: 'Professional', description: 'Modern professional template' },
];

// Chart colors matching the HBS template
const CHART_COLORS = ['#6366F1', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#3B82F6'];

// Preset accent colors
const COLOR_PRESETS = [
    { name: 'Purple', hex: '#6366F1' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Teal', hex: '#14B8A6' },
    { name: 'Green', hex: '#22C55E' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Slate', hex: '#475569' },
];

// Lighten a hex color by a given amount (0-100)
function lightenColor(hex: string, amount: number = 25): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, ((num >> 16) & 0xFF) + Math.round(255 * amount / 100));
    const g = Math.min(255, ((num >> 8) & 0xFF) + Math.round(255 * amount / 100));
    const b = Math.min(255, (num & 0xFF) + Math.round(255 * amount / 100));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Currency formatting helper with auto-detection for INR/USD
const formatCurrency = (amount: string | number): string => {
    if (!amount) return 'Contact Us';

    // If already formatted (contains ₹, $, Cr, Lakh, etc.), return as-is
    const amountStr = String(amount);
    if (/[₹$]|Cr|Lakh|Million|Billion|cr|lakh|M\b|K\b/i.test(amountStr)) {
        return amountStr;
    }

    // Parse numeric value
    const numericValue = parseFloat(amountStr.replace(/[^\d.]/g, ''));
    if (isNaN(numericValue) || numericValue === 0) {
        return amountStr; // Return original if not parseable
    }

    // Auto-detect: amounts >= 10000 are likely INR, smaller amounts are USD
    const isINR = numericValue >= 10000;

    if (isINR) {
        // Format in Indian notation (Lakhs and Crores)
        if (numericValue >= 10000000) { // >= 1 Crore
            const crores = numericValue / 10000000;
            return `₹${crores % 1 === 0 ? crores : crores.toFixed(1)} Cr`;
        } else if (numericValue >= 100000) { // >= 1 Lakh
            const lakhs = numericValue / 100000;
            return `₹${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)} Lakhs`;
        } else {
            return `₹${numericValue.toLocaleString('en-IN')}`;
        }
    } else {
        // Format in USD notation (K, M, B)
        if (numericValue >= 1000000000) {
            return `$${(numericValue / 1000000000).toFixed(1)}B`;
        } else if (numericValue >= 1000000) {
            return `$${(numericValue / 1000000).toFixed(1)}M`;
        } else if (numericValue >= 1000) {
            return `$${(numericValue / 1000).toFixed(0)}K`;
        } else {
            return `$${numericValue.toLocaleString('en-US')}`;
        }
    }
};

export function OnePager({ slides, companyName = 'Company Name', ideaId, onClose }: OnePagerProps) {
    const [exportJobId, setExportJobId] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState('one-pager-v1');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState('#6366F1');
    const [hexInput, setHexInput] = useState('#6366F1');
    const [showColorPicker, setShowColorPicker] = useState(false);

    // Use the new export hook
    const { mutate: exportOnePager, isPending: isExporting } = useExportOnePager(ideaId);

    // Poll for export status when we have a job ID
    const { data: exportStatus } = useExportStatus(exportJobId, {
        enabled: !!exportJobId,
    });

    // Extract data from slides
    const extractedData = extractDataFromSlides(slides);

    // Auto-download when export completes - fetch the file and trigger download
    useEffect(() => {
        if (exportStatus?.state === 'completed' && exportStatus?.downloadUrl) {
            // Fetch the PDF and trigger download without opening Cloudinary URL
            fetch(exportStatus.downloadUrl)
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${companyName.replace(/[^a-zA-Z0-9]/g, '_')}_one_pager.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                })
                .catch(() => {
                    // Fallback TEMPORARILY DISABLED for AWS Activate
                    // if (exportStatus.downloadUrl) {
                    //     window.open(exportStatus.downloadUrl, '_blank');
                    // }
                })
                .finally(() => {
                    setExportJobId(null);
                });
        } else if (exportStatus?.state === 'failed') {
            setExportJobId(null);
        }
    }, [exportStatus, companyName]);

    function extractDataFromSlides(slides: Slide[]) {
        const slidesByType: Record<string, Slide> = {};
        slides.forEach((slide) => {
            const type = slide.type || 'other';
            slidesByType[type] = slide;
        });

        // Safely get content as string
        const getContentAsString = (slide: Slide | undefined): string => {
            if (!slide) return '';
            if (typeof slide.content === 'string') return slide.content;
            // Content is always a string in our interface, this is just for safety
            return String(slide.content || '');
        };

        return {
            overview: getContentAsString(slidesByType.title),
            problem: slidesByType.problem?.bullet_points || [],
            solution: slidesByType.solution?.bullet_points || [],
            traction: slidesByType.traction?.bullet_points || [],
            team: slidesByType.team?.bullet_points || [],
            askAmount: slidesByType.ask?.headline || slidesByType.financials?.headline || 'Contact Us',
            useOfFunds: slidesByType.ask?.chart?.data || [],
            businessModel: slidesByType.business_model?.chart?.data || [],
            competition: slidesByType.competition?.bullet_points?.slice(0, 4) || [],
        };
    }

    const handleExportPDF = () => {
        exportOnePager(
            {
                templateId: selectedTemplate,
                websiteUrl: websiteUrl.trim() || undefined,
                slides: slides,
                logoBase64: logoPreview || undefined,
                accentColor: selectedColor,
            },
            {
                onSuccess: (data) => {
                    setExportJobId(data.jobId);
                },
            }
        );
    };

    // Generate pie chart gradient CSS
    const getPieGradient = (data: Array<{ name: string; value: number }>) => {
        if (!data || data.length === 0) return 'transparent';
        let total = 0;
        const gradientParts = data.map((item, idx) => {
            const color = CHART_COLORS[idx % CHART_COLORS.length];
            const start = total;
            total += item.value;
            return `${color} ${start}% ${total}%`;
        });
        return `conic-gradient(${gradientParts.join(', ')})`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-5xl max-h-[95vh] flex flex-col bg-gray-100 rounded-lg overflow-hidden">
                {/* Header Controls */}
                <div className="flex flex-wrap items-center gap-3 p-3 bg-white border-b">
                    <h2 className="text-lg font-bold flex-1">One Pager Preview</h2>

                    {/* Template Selection */}
                    <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                    >
                        {TEMPLATES.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>

                    {/* Website URL */}
                    <div className="flex items-center gap-2 min-w-[180px]">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <input
                            type="url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="Website for QR code"
                            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Logo Upload */}
                    <label className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                        <Upload className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{logoFile ? logoFile.name : 'Logo'}</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setLogoFile(file);
                                    const reader = new FileReader();
                                    reader.onload = (e) => setLogoPreview(e.target?.result as string);
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </label>

                    {/* Color Picker Toggle */}
                    <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: selectedColor }} />
                        <Palette className="w-4 h-4 text-gray-500" />
                    </button>

                    {/* Export Button */}
                    <Button
                        size="sm"
                        onClick={handleExportPDF}
                        disabled={isExporting || !!exportJobId}
                        leftIcon={isExporting || exportJobId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    >
                        {exportJobId ? 'Processing...' : isExporting ? 'Starting...' : 'Export PDF (3 credits)'}
                    </Button>

                    <Button size="sm" variant="ghost" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Color Picker Panel */}
                {showColorPicker && (
                    <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 bg-gray-50 border-b">
                        {/* Preset swatches */}
                        {COLOR_PRESETS.map((preset) => (
                            <button
                                key={preset.hex}
                                onClick={() => {
                                    setSelectedColor(preset.hex);
                                    setHexInput(preset.hex);
                                }}
                                title={preset.name}
                                className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${selectedColor === preset.hex
                                    ? 'border-gray-800 ring-2 ring-offset-1 ring-gray-400 scale-110'
                                    : 'border-gray-200'
                                    }`}
                                style={{ backgroundColor: preset.hex }}
                            />
                        ))}

                        {/* Divider */}
                        <div className="w-px h-7 bg-gray-300" />

                        {/* Native color picker */}
                        <label className="relative cursor-pointer" title="Pick any color">
                            <div
                                className={`w-7 h-7 rounded-full border-2 overflow-hidden ${!COLOR_PRESETS.some(p => p.hex === selectedColor)
                                    ? 'border-gray-800 ring-2 ring-offset-1 ring-gray-400 scale-110'
                                    : 'border-gray-200'
                                    }`}
                                style={{
                                    background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                                }}
                            />
                            <input
                                type="color"
                                value={selectedColor}
                                onChange={(e) => {
                                    setSelectedColor(e.target.value.toUpperCase());
                                    setHexInput(e.target.value.toUpperCase());
                                }}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            />
                        </label>

                        {/* Hex Input */}
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500 font-mono">#</span>
                            <input
                                type="text"
                                value={hexInput.replace('#', '')}
                                onChange={(e) => {
                                    const raw = e.target.value.replace('#', '').slice(0, 6);
                                    setHexInput(`#${raw}`);
                                    if (/^[0-9A-Fa-f]{6}$/.test(raw)) {
                                        setSelectedColor(`#${raw.toUpperCase()}`);
                                    }
                                }}
                                onBlur={() => {
                                    // On blur, sync hex input back to selectedColor
                                    setHexInput(selectedColor);
                                }}
                                placeholder="6366F1"
                                className="w-20 px-2 py-1 text-xs font-mono border border-gray-300 rounded-md"
                                maxLength={6}
                            />
                        </div>
                    </div>
                )}

                {/* Export Status */}
                {exportJobId && exportStatus && (
                    <div className="bg-blue-50 text-blue-700 text-sm px-4 py-2 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>
                            {exportStatus.state === 'active' && 'Generating PDF...'}
                            {exportStatus.state === 'waiting' && 'Waiting in queue...'}
                            {exportStatus.state === 'completed' && 'Opening download...'}
                        </span>
                    </div>
                )}

                {/* A4 Preview - scaled to fit */}
                <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-gray-200">
                    <div
                        className="bg-white shadow-xl origin-top"
                        style={{
                            width: '420px', // A4 width scaled down for preview
                            height: '595px', // A4 height maintaining 1:1.414 aspect ratio
                            fontSize: '7px', // Scaled font size
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        {/* Purple Header */}
                        <div
                            className="text-white px-5 py-3 flex justify-between items-center"
                            style={{ background: `linear-gradient(135deg, ${selectedColor} 0%, ${lightenColor(selectedColor, 15)} 100%)` }}
                        >
                            <div className="flex items-center gap-2 text-lg font-bold">
                                <span>{companyName}</span>
                            </div>
                            {logoPreview && (
                                <img src={logoPreview} alt="Logo" className="h-6 object-contain" />
                            )}
                        </div>

                        {/* Overview */}
                        <div className="px-5 py-3">
                            <div className="font-bold text-sm uppercase tracking-wide border-b-2 border-amber-500 inline-block pb-1 mb-2" style={{ color: selectedColor }}>
                                OVERVIEW...
                            </div>
                            <p className="text-gray-600 text-[9px] leading-relaxed">
                                {extractedData.overview.substring(0, 400)}
                                {extractedData.overview.length > 400 && '...'}
                            </p>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-2 gap-3 px-5">
                            {/* Left Column */}
                            <div className="space-y-3">
                                {/* Problem */}
                                <div>
                                    <div
                                        className="text-white text-[9px] font-bold uppercase px-2 py-1 rounded-sm"
                                        style={{ background: `linear-gradient(90deg, ${selectedColor} 0%, ${lightenColor(selectedColor, 15)} 100%)` }}
                                    >
                                        Problem
                                    </div>
                                    <ul className="mt-1 space-y-0.5 text-[8px]">
                                        {extractedData.problem.slice(0, 4).map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-1">
                                                <span className="font-bold" style={{ color: selectedColor }}>•</span>
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Solution */}
                                <div>
                                    <div
                                        className="text-white text-[9px] font-bold uppercase px-2 py-1 rounded-sm"
                                        style={{ background: `linear-gradient(90deg, ${selectedColor} 0%, ${lightenColor(selectedColor, 15)} 100%)` }}
                                    >
                                        Solution
                                    </div>
                                    <ul className="mt-1 space-y-0.5 text-[8px]">
                                        {extractedData.solution.slice(0, 4).map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-1">
                                                <span className="font-bold" style={{ color: selectedColor }}>•</span>
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Traction */}
                                <div>
                                    <div
                                        className="text-white text-[9px] font-bold uppercase px-2 py-1 rounded-sm"
                                        style={{ background: `linear-gradient(90deg, ${selectedColor} 0%, ${lightenColor(selectedColor, 15)} 100%)` }}
                                    >
                                        Traction
                                    </div>
                                    <ul className="mt-1 space-y-0.5 text-[8px]">
                                        {extractedData.traction.slice(0, 4).map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-1">
                                                <span className="font-bold" style={{ color: selectedColor }}>•</span>
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Team */}
                                <div>
                                    <div
                                        className="text-white text-[9px] font-bold uppercase px-2 py-1 rounded-sm"
                                        style={{ background: `linear-gradient(90deg, ${selectedColor} 0%, ${lightenColor(selectedColor, 15)} 100%)` }}
                                    >
                                        Team
                                    </div>
                                    <div className="mt-1 grid grid-cols-2 gap-1 text-[8px]">
                                        {extractedData.team.slice(0, 4).map((member, idx) => (
                                            <div key={idx} className="text-gray-700">{member}</div>
                                        ))}
                                    </div>
                                </div>

                                {/* Website - moved to left column */}
                                {websiteUrl && (
                                    <div className="flex items-center gap-2 bg-gray-50 rounded p-2">
                                        <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center text-[5px] text-gray-500 flex-shrink-0">
                                            QR Code
                                        </div>
                                        <div>
                                            <div className="text-[7px] font-bold uppercase" style={{ color: selectedColor }}>Website</div>
                                            {/* TEMPORARILY DISABLED for AWS Activate
                                            <Link to={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[7px] flex items-center gap-0.5" style={{ color: selectedColor }}>
                                                {websiteUrl} <ExternalLink className="w-2 h-2" />
                                            </Link>
                                            */}
                                            <span className="text-[7px]" style={{ color: selectedColor }}>{websiteUrl}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column */}
                            <div className="space-y-3">
                                {/* Competitive Edge */}
                                <div>
                                    <div className="text-[9px] font-bold uppercase px-2 py-1 rounded-sm" style={{ color: selectedColor, border: `2px solid ${selectedColor}` }}>
                                        Competitive Edge
                                    </div>
                                    <div className="mt-1 grid grid-cols-2 gap-1">
                                        {extractedData.competition.slice(0, 4).map((item, idx) => {
                                            const IconComponent = [Target, Zap, Shield, Lightbulb][idx] || Target;
                                            const title = item.split(':')[0] || item.substring(0, 20);
                                            const subtitle = item.split(':')[1] || '';
                                            return (
                                                <div key={idx} className="bg-gray-50 p-1.5 text-center rounded">
                                                    <IconComponent className="w-4 h-4 mx-auto mb-0.5" style={{ color: selectedColor }} />
                                                    <div className="text-[7px] font-bold text-gray-800 truncate">{title}</div>
                                                    <div className="text-[6px] text-gray-500 truncate">{subtitle}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Ask */}
                                <div className="text-center py-2 bg-white border rounded">
                                    <div className="text-[8px] font-semibold uppercase" style={{ color: selectedColor }}>ASK</div>
                                    <div className="text-sm font-bold text-gray-900">{formatCurrency(extractedData.askAmount)}</div>
                                </div>

                                {/* Use of Funds Pie Chart */}
                                {extractedData.useOfFunds.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-16 h-16 rounded-full flex-shrink-0"
                                            style={{ background: getPieGradient(extractedData.useOfFunds) }}
                                        />
                                        <div className="flex-1 space-y-0.5">
                                            {extractedData.useOfFunds.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-1 text-[7px]">
                                                    <div
                                                        className="w-2 h-2 rounded-sm flex-shrink-0"
                                                        style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                                                    />
                                                    <span className="flex-1 text-gray-600 truncate">{item.name}</span>
                                                    <span className="font-semibold">{item.value}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Business Model */}
                                {extractedData.businessModel.length > 0 && (
                                    <div>
                                        <div
                                            className="text-white text-[9px] font-bold uppercase px-2 py-1 rounded-sm"
                                            style={{ background: `linear-gradient(90deg, ${selectedColor} 0%, ${lightenColor(selectedColor, 15)} 100%)` }}
                                        >
                                            Business Model
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div
                                                className="w-12 h-12 rounded-full flex-shrink-0"
                                                style={{ background: getPieGradient(extractedData.businessModel) }}
                                            />
                                            <div className="flex-1 space-y-0.5">
                                                {extractedData.businessModel.slice(0, 4).map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-1 text-[7px]">
                                                        <div
                                                            className="w-2 h-2 rounded-sm flex-shrink-0"
                                                            style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                                                        />
                                                        <span className="flex-1 text-gray-600 truncate">{item.name}</span>
                                                        <span className="font-semibold">{item.value}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-gray-50 text-gray-600 text-xs px-4 py-2 text-center border-t">
                    This is a preview. The exported PDF will include proper formatting, charts, and QR code if URL is provided.
                </div>
            </div>
        </div>
    );
}
