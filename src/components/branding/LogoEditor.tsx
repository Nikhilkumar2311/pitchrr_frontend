/**
 * Logo Editor Component
 * 
 * Enhanced logo creation with upload, shape, icon, and text customization.
 */

import { useState, useRef } from 'react';
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
} from 'lucide-react';
import { Button, Input } from '@/components/ui';

// Shape options for logo
type LogoShape = 'circle' | 'square' | 'rounded';

// Icon options (subset of Lucide icons)
const iconOptions = [
    { name: 'Sparkles', icon: Sparkles },
    { name: 'Circle', icon: Circle },
    { name: 'Square', icon: Square },
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
    const [fontSize, setFontSize] = useState(36);
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [useIcon, setUseIcon] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState<string>('Sparkles');
    const [fontFamily, setFontFamily] = useState('Inter');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const fonts = [
        { name: 'Inter', label: 'Modern' },
        { name: 'Georgia', label: 'Classic' },
        { name: 'Courier New', label: 'Mono' },
        { name: 'Arial Black', label: 'Bold' },
    ];

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
        }
    };

    const SelectedIconComponent = iconOptions.find(i => i.name === selectedIcon)?.icon || Sparkles;

    return (
        <div className="space-y-6">
            {/* Logo Preview */}
            <div className="flex justify-center">
                <motion.div
                    layout
                    className={`
                        w-32 h-32 flex items-center justify-center text-white shadow-lg
                        ${getShapeClass()}
                    `}
                    style={{
                        backgroundColor: primaryColor,
                        backgroundImage: customImage ? `url(${customImage})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {!customImage && (
                        useIcon ? (
                            <SelectedIconComponent className="w-16 h-16" />
                        ) : (
                            <span
                                style={{
                                    fontSize: `${fontSize}px`,
                                    fontFamily,
                                    fontWeight: 'bold',
                                }}
                            >
                                {logoText}
                            </span>
                        )
                    )}
                </motion.div>
            </div>

            {/* Shape Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setLogoShape('circle')}
                        className={`p-3 rounded-lg border-2 transition-all ${logoShape === 'circle' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                    >
                        <Circle className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setLogoShape('rounded')}
                        className={`p-3 rounded-lg border-2 transition-all ${logoShape === 'rounded' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                    >
                        <RectangleHorizontal className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setLogoShape('square')}
                        className={`p-3 rounded-lg border-2 transition-all ${logoShape === 'square' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
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
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${!useIcon && !customImage ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'
                            }`}
                    >
                        <Type className="w-4 h-4 inline mr-1" />
                        Text
                    </button>
                    <button
                        onClick={() => { setUseIcon(true); clearCustomImage(); }}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${useIcon && !customImage ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'
                            }`}
                    >
                        <Sparkles className="w-4 h-4 inline mr-1" />
                        Icon
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${customImage ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'
                            }`}
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
                            onChange={(e) => setLogoText(e.target.value.slice(0, 3))}
                            placeholder="P"
                            maxLength={3}
                        />
                        <p className="text-xs text-gray-500 mt-1">Up to 3 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                        <div className="flex flex-wrap gap-2">
                            {fonts.map((font) => (
                                <button
                                    key={font.name}
                                    onClick={() => setFontFamily(font.name)}
                                    className={`px-3 py-1 rounded-lg border text-sm transition-all ${fontFamily === font.name
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    style={{ fontFamily: font.name }}
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
                            min="20"
                            max="60"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>
            )}

            {/* Icon Selection */}
            {useIcon && !customImage && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Icon</label>
                    <div className="flex gap-2">
                        {iconOptions.map((icon) => (
                            <button
                                key={icon.name}
                                onClick={() => setSelectedIcon(icon.name)}
                                className={`p-3 rounded-lg border-2 transition-all ${selectedIcon === icon.name
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200'
                                    }`}
                            >
                                <icon.icon className="w-5 h-5" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Image Controls */}
            {customImage && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Custom image uploaded</span>
                    <button
                        onClick={clearCustomImage}
                        className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Download Button */}
            <Button
                variant="secondary"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={onDownload}
                className="w-full"
            >
                Download Logo
            </Button>
        </div>
    );
}
