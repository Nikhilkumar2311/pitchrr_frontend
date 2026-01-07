/**
 * Enhanced Logo Editor Component
 * 
 * Full-featured logo creation with colors, fonts, icons, and export.
 */

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Circle,
    Square,
    RectangleHorizontal,
    Type,
    Download,
    Sparkles,
    Image as ImageIcon,
    X,
    Zap,
    Target,
    Rocket,
    Star,
    Heart,
    Shield,
    Crown,
    Flame,
    Globe,
    Leaf,
    Diamond,
    Sun,
    Moon,
    Cloud,
    Palette,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import toast from 'react-hot-toast';

// Shape options for logo
type LogoShape = 'circle' | 'square' | 'rounded' | 'hexagon';
type LogoSize = 64 | 128 | 256 | 512;

// Expanded icon options
const iconOptions = [
    { name: 'Sparkles', icon: Sparkles },
    { name: 'Zap', icon: Zap },
    { name: 'Target', icon: Target },
    { name: 'Rocket', icon: Rocket },
    { name: 'Star', icon: Star },
    { name: 'Heart', icon: Heart },
    { name: 'Shield', icon: Shield },
    { name: 'Crown', icon: Crown },
    { name: 'Flame', icon: Flame },
    { name: 'Globe', icon: Globe },
    { name: 'Leaf', icon: Leaf },
    { name: 'Diamond', icon: Diamond },
    { name: 'Sun', icon: Sun },
    { name: 'Moon', icon: Moon },
    { name: 'Cloud', icon: Cloud },
];

// Expanded font options (web-safe + Google Fonts)
const fonts = [
    { name: 'Inter', label: 'Modern', weight: '700' },
    { name: 'Poppins', label: 'Friendly', weight: '700' },
    { name: 'Montserrat', label: 'Bold', weight: '800' },
    { name: 'Playfair Display', label: 'Elegant', weight: '700' },
    { name: 'Roboto', label: 'Clean', weight: '700' },
    { name: 'Space Grotesk', label: 'Tech', weight: '700' },
    { name: 'Outfit', label: 'Sleek', weight: '700' },
    { name: 'Georgia', label: 'Classic', weight: '700' },
    { name: 'Arial Black', label: 'Impact', weight: '900' },
    { name: 'Courier New', label: 'Mono', weight: '700' },
];

// Preset colors
const colorPresets = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#14B8A6', // Teal
    '#6366F1', // Indigo
    '#1F2937', // Dark
    '#FFFFFF', // White
];

interface LogoEditorProps {
    startupName: string;
    primaryColor: string;
    secondaryColor?: string;
    onDownload?: () => void;
}

export function LogoEditor({
    startupName,
    primaryColor,
    onDownload,
}: LogoEditorProps) {
    const [logoShape, setLogoShape] = useState<LogoShape>('rounded');
    const [logoText, setLogoText] = useState(startupName ? startupName[0]?.toUpperCase() : 'P');
    const [fontSize, setFontSize] = useState(48);
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [useIcon, setUseIcon] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState<string>('Sparkles');
    const [fontFamily, setFontFamily] = useState('Inter');
    const [backgroundColor, setBackgroundColor] = useState(primaryColor);
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [logoSize, setLogoSize] = useState<LogoSize>(128);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomImage(reader.result as string);
                setUseIcon(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearCustomImage = () => {
        setCustomImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getShapeClass = () => {
        switch (logoShape) {
            case 'circle': return 'rounded-full';
            case 'square': return 'rounded-none';
            case 'rounded': return 'rounded-2xl';
            case 'hexagon': return 'rounded-xl';
        }
    };

    const getClipPath = () => {
        if (logoShape === 'hexagon') {
            return 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        }
        return 'none';
    };

    const SelectedIconComponent = iconOptions.find(i => i.name === selectedIcon)?.icon || Sparkles;

    // Export logo as PNG
    const downloadLogo = useCallback(async () => {
        const canvas = document.createElement('canvas');
        canvas.width = logoSize;
        canvas.height = logoSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            toast.error('Failed to create canvas');
            return;
        }

        // Draw background
        ctx.fillStyle = backgroundColor;

        if (logoShape === 'circle') {
            ctx.beginPath();
            ctx.arc(logoSize / 2, logoSize / 2, logoSize / 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (logoShape === 'rounded') {
            const radius = logoSize * 0.15;
            ctx.beginPath();
            ctx.roundRect(0, 0, logoSize, logoSize, radius);
            ctx.fill();
        } else {
            ctx.fillRect(0, 0, logoSize, logoSize);
        }

        // Draw content
        if (customImage) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                ctx.drawImage(img, 0, 0, logoSize, logoSize);
                downloadCanvas(canvas);
            };
            img.src = customImage;
        } else {
            ctx.fillStyle = textColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const scaledFontSize = (fontSize / 128) * logoSize;
            ctx.font = `bold ${scaledFontSize}px ${fontFamily}`;
            ctx.fillText(logoText, logoSize / 2, logoSize / 2);

            downloadCanvas(canvas);
        }
    }, [logoSize, backgroundColor, logoShape, customImage, textColor, fontSize, fontFamily, logoText]);

    const downloadCanvas = (canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = `logo-${logoSize}x${logoSize}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success(`Logo downloaded (${logoSize}x${logoSize})`);
        onDownload?.();
    };

    return (
        <div className="space-y-6">
            {/* Logo Preview */}
            <div className="flex justify-center">
                <motion.div
                    ref={logoRef}
                    layout
                    className={`
                        flex items-center justify-center shadow-xl
                        ${getShapeClass()}
                    `}
                    style={{
                        width: `${Math.min(logoSize, 160)}px`,
                        height: `${Math.min(logoSize, 160)}px`,
                        backgroundColor: customImage ? 'transparent' : backgroundColor,
                        backgroundImage: customImage ? `url(${customImage})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        clipPath: getClipPath(),
                    }}
                >
                    {!customImage && (
                        useIcon ? (
                            <SelectedIconComponent
                                className="w-1/2 h-1/2"
                                style={{ color: textColor }}
                            />
                        ) : (
                            <span
                                style={{
                                    fontSize: `${(fontSize / 128) * Math.min(logoSize, 160)}px`,
                                    fontFamily,
                                    fontWeight: 'bold',
                                    color: textColor,
                                }}
                            >
                                {logoText}
                            </span>
                        )
                    )}
                </motion.div>
            </div>

            {/* Export Size Selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Size</label>
                <div className="flex gap-2">
                    {([64, 128, 256, 512] as LogoSize[]).map((size) => (
                        <button
                            key={size}
                            onClick={() => setLogoSize(size)}
                            className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all ${logoSize === size
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {size}px
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Palette className="w-4 h-4 inline mr-1" />
                        Background
                    </label>
                    <div className="flex flex-wrap gap-1">
                        {colorPresets.map((color) => (
                            <button
                                key={color}
                                onClick={() => setBackgroundColor(color)}
                                className={`w-7 h-7 rounded-lg border-2 transition-all ${backgroundColor === color
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-gray-200'
                                    }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                        <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-7 h-7 rounded-lg cursor-pointer"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Type className="w-4 h-4 inline mr-1" />
                        Text/Icon Color
                    </label>
                    <div className="flex flex-wrap gap-1">
                        {['#FFFFFF', '#000000', '#1F2937', '#F3F4F6'].map((color) => (
                            <button
                                key={color}
                                onClick={() => setTextColor(color)}
                                className={`w-7 h-7 rounded-lg border-2 transition-all ${textColor === color
                                    ? 'border-blue-500 ring-2 ring-blue-200'
                                    : 'border-gray-300'
                                    }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                        <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-7 h-7 rounded-lg cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Shape Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setLogoShape('circle')}
                        className={`p-3 rounded-lg border-2 transition-all ${logoShape === 'circle' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                        <Circle className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setLogoShape('rounded')}
                        className={`p-3 rounded-lg border-2 transition-all ${logoShape === 'rounded' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                        <RectangleHorizontal className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setLogoShape('square')}
                        className={`p-3 rounded-lg border-2 transition-all ${logoShape === 'square' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                        <Square className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content Type Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => { setUseIcon(false); clearCustomImage(); }}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${!useIcon && !customImage ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'}`}
                    >
                        <Type className="w-4 h-4 inline mr-1" />
                        Text
                    </button>
                    <button
                        onClick={() => { setUseIcon(true); clearCustomImage(); }}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${useIcon && !customImage ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'}`}
                    >
                        <Sparkles className="w-4 h-4 inline mr-1" />
                        Icon
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${customImage ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'}`}
                    >
                        <ImageIcon className="w-4 h-4 inline mr-1" />
                        Image
                    </button>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>

            {/* Text Options */}
            {!useIcon && !customImage && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo Text</label>
                        <Input
                            value={logoText}
                            onChange={(e) => setLogoText(e.target.value.slice(0, 4))}
                            placeholder="P"
                            maxLength={4}
                        />
                        <p className="text-xs text-gray-500 mt-1">Up to 4 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                        <div className="flex flex-wrap gap-2">
                            {fonts.map((font) => (
                                <button
                                    key={font.name}
                                    onClick={() => setFontFamily(font.name)}
                                    className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${fontFamily === font.name
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    style={{ fontFamily: font.name, fontWeight: font.weight }}
                                >
                                    {font.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Font Size: {fontSize}px
                        </label>
                        <input
                            type="range"
                            min="24"
                            max="72"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>
                </div>
            )}

            {/* Icon Selection */}
            {useIcon && !customImage && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Icon</label>
                    <div className="flex flex-wrap gap-2">
                        {iconOptions.map((icon) => (
                            <button
                                key={icon.name}
                                onClick={() => setSelectedIcon(icon.name)}
                                className={`p-2.5 rounded-lg border-2 transition-all ${selectedIcon === icon.name
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                title={icon.name}
                            >
                                <icon.icon className="w-5 h-5" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Image Controls */}
            {customImage && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700 flex-1">Custom image uploaded</span>
                    <button
                        onClick={clearCustomImage}
                        className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Download Button */}
            <Button
                variant="primary"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={downloadLogo}
                className="w-full"
            >
                Download Logo ({logoSize}x{logoSize}px)
            </Button>

            {/* Hidden canvas for export */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}
