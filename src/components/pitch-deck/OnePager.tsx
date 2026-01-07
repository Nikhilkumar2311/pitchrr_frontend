import { useState, useRef } from 'react';
import { Download, Edit2, Check, X, Loader2 } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { SlideChart } from './SlideChart';
import html2canvas from 'html2canvas';

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
    onClose: () => void;
}

export function OnePager({ slides, companyName = 'Company Name', onClose }: OnePagerProps) {
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [sections, setSections] = useState(() => createSections(slides));
    const [isExporting, setIsExporting] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const chartRefs = useRef<Record<string, HTMLDivElement | null>>({});

    function createSections(slides: Slide[]) {
        const sectionsMap: Record<string, { title: string; content: string; chart?: Slide['chart']; image?: string }> = {};

        slides.forEach((slide) => {
            const type = slide.type || 'other';
            sectionsMap[type] = {
                title: slide.title,
                content: slide.content + (slide.bullet_points ? '\n• ' + slide.bullet_points.join('\n• ') : ''),
                chart: slide.chart,
                image: slide.image,
            };
        });

        return sectionsMap;
    }

    const updateSection = (key: string, field: 'title' | 'content', value: string) => {
        setSections(prev => ({
            ...prev,
            [key]: { ...prev[key], [field]: value }
        }));
    };

    const handleExportPDF = async () => {
        if (!contentRef.current) return;

        setIsExporting(true);

        try {
            // Capture charts as images
            const chartImages: Record<string, string> = {};

            for (const [key, ref] of Object.entries(chartRefs.current)) {
                if (ref) {
                    try {
                        const canvas = await html2canvas(ref, {
                            backgroundColor: '#FFFFFF',
                            scale: 2,
                            logging: false,
                        });
                        chartImages[key] = canvas.toDataURL('image/png');
                    } catch (e) {
                        console.error('Failed to capture chart:', key, e);
                    }
                }
            }

            // Generate PDF with chart images
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>${companyName} - One Pager</title>
                            <style>
                                * { box-sizing: border-box; margin: 0; padding: 0; }
                                body { font-family: system-ui, -apple-system, sans-serif; margin: 15px; font-size: 9px; }
                                .header { text-align: center; margin-bottom: 10px; border-bottom: 2px solid #3B82F6; padding-bottom: 8px; }
                                .header h1 { color: #1F2937; font-size: 20px; }
                                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
                                .section { background: #F9FAFB; padding: 8px; border-radius: 4px; break-inside: avoid; }
                                .section h3 { margin: 0 0 4px 0; color: #3B82F6; font-size: 9px; text-transform: uppercase; font-weight: 600; }
                                .section p { margin: 0; color: #374151; font-size: 8px; line-height: 1.3; white-space: pre-line; }
                                .full-width { grid-column: span 2; }
                                img { max-width: 100%; height: auto; border-radius: 2px; margin-top: 4px; }
                                .chart-img { max-width: 250px; max-height: 120px; }
                                @media print { 
                                    body { margin: 10px; } 
                                    @page { size: A4; margin: 10mm; }
                                }
                            </style>
                        </head>
                        <body>
                            <div class="header">
                                <h1>${companyName}</h1>
                            </div>
                            <div class="grid">
                                ${Object.entries(sections).map(([key, section]) => `
                                    <div class="section ${['market', 'financials'].includes(key) ? 'full-width' : ''}">
                                        <h3>${section.title}</h3>
                                        <p>${section.content.substring(0, 300)}${section.content.length > 300 ? '...' : ''}</p>
                                        ${chartImages[key] ? `<img class="chart-img" src="${chartImages[key]}" alt="Chart"/>` : ''}
                                        ${section.image ? `<img src="${section.image}" alt="${section.title}"/>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </body>
                    </html>
                `);
                printWindow.document.close();
                setTimeout(() => printWindow.print(), 500);
            }
        } catch (e) {
            console.error('Export failed:', e);
        } finally {
            setIsExporting(false);
        }
    };

    const EditableText = ({
        value,
        onChange,
        isTitle = false,
        sectionKey
    }: {
        value: string;
        onChange: (v: string) => void;
        isTitle?: boolean;
        sectionKey: string;
    }) => {
        const isEditing = editingSection === `${sectionKey}-${isTitle ? 'title' : 'content'}`;
        const [tempValue, setTempValue] = useState(value);

        if (isEditing) {
            return (
                <div className="flex items-start gap-2">
                    {isTitle ? (
                        <input
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="flex-1 px-2 py-1 border rounded text-sm font-semibold"
                            autoFocus
                        />
                    ) : (
                        <textarea
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="flex-1 px-2 py-1 border rounded text-sm resize-none"
                            rows={4}
                            autoFocus
                        />
                    )}
                    <button
                        onClick={() => {
                            onChange(tempValue);
                            setEditingSection(null);
                        }}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => {
                            setTempValue(value);
                            setEditingSection(null);
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            );
        }

        return (
            <div
                className="group cursor-pointer flex items-start gap-2"
                onClick={() => {
                    setTempValue(value);
                    setEditingSection(`${sectionKey}-${isTitle ? 'title' : 'content'}`);
                }}
            >
                {isTitle ? (
                    <h3 className="flex-1 font-semibold text-blue-600 text-sm uppercase tracking-wide">
                        {value}
                    </h3>
                ) : (
                    <p className="flex-1 text-sm text-gray-600 whitespace-pre-line">
                        {value}
                    </p>
                )}
                <Edit2 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
            </div>
        );
    };

    const sectionOrder = ['title', 'problem', 'solution', 'market', 'product', 'business_model', 'traction', 'competition', 'team', 'financials', 'ask', 'closing'];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">One Pager - {companyName}</h2>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="secondary" onClick={handleExportPDF} disabled={isExporting} leftIcon={isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}>
                            {isExporting ? 'Exporting...' : 'Export PDF'}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6" ref={contentRef}>
                    {/* Company Header */}
                    <div className="text-center mb-6 pb-4 border-b-2 border-blue-500">
                        <h1 className="text-3xl font-bold text-gray-900">{companyName}</h1>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sectionOrder.map((key) => {
                            const section = sections[key];
                            if (!section) return null;

                            const isFullWidth = ['market', 'financials', 'ask', 'title'].includes(key);

                            return (
                                <div
                                    key={key}
                                    className={`bg-gray-50 rounded-lg p-4 ${isFullWidth ? 'md:col-span-2' : ''}`}
                                >
                                    <EditableText
                                        value={section.title}
                                        onChange={(v) => updateSection(key, 'title', v)}
                                        isTitle
                                        sectionKey={key}
                                    />
                                    <div className="mt-2">
                                        <EditableText
                                            value={section.content}
                                            onChange={(v) => updateSection(key, 'content', v)}
                                            sectionKey={key}
                                        />
                                    </div>

                                    {/* Chart */}
                                    {section.chart && section.chart.type !== 'none' && section.chart.data?.length > 0 && (
                                        <div
                                            className="mt-3 bg-white rounded-lg p-3"
                                            ref={(el) => { chartRefs.current[key] = el; }}
                                        >
                                            <SlideChart
                                                type={section.chart.type}
                                                title={section.chart.title}
                                                data={section.chart.data}
                                                theme={{ textColor: '#374151', accentColor: '#3B82F6' }}
                                            />
                                        </div>
                                    )}

                                    {/* Image */}
                                    {section.image && (
                                        <img
                                            src={section.image}
                                            alt={section.title}
                                            className="mt-3 w-full max-h-40 object-contain rounded-lg"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>
        </div>
    );
}
