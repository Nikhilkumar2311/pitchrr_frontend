/**
 * Module 3: Branding Page
 * 
 * Helps founders create a brand identity.
 * 
 * FEATURES:
 * - Logo creation/upload
 * - AI-generated taglines
 * - Font suggestions
 * - Brand tone selection
 * - Brand kit preview
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Palette,
    Save,
    Download,
    Sparkles,
    Type,
    Paintbrush,
} from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    Button,
    Input,
} from '@/components/ui';
import toast from 'react-hot-toast';
import { useIdeaStore } from '@/store';
import { BrandingSkeleton } from '@/components/skeletons/BrandingSkeleton';

/**
 * Brand tone options
 */
const brandTones = ['Professional', 'Friendly', 'Bold', 'Minimalist', 'Playful'];

/**
 * Color preset options
 */
const colorPresets = [
    { name: 'Ocean', primary: '#376EF9', secondary: '#06B6D4', accent: '#10B981' },
    { name: 'Sunset', primary: '#F59E0B', secondary: '#EF4444', accent: '#EC4899' },
    { name: 'Forest', primary: '#10B981', secondary: '#059669', accent: '#14B8A6' },
    { name: 'Royal', primary: '#8B5CF6', secondary: '#6366F1', accent: '#A855F7' },
    { name: 'Monochrome', primary: '#1F2937', secondary: '#4B5563', accent: '#9CA3AF' },
];

export default function Branding() {
    const STORAGE_KEY = 'pitchrr_branding';

    // Form state
    const [startupName, setStartupName] = useState('');
    const [selectedTone, setSelectedTone] = useState('Professional');
    const [selectedColorPreset, setSelectedColorPreset] = useState(colorPresets[0]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Generated branding state
    const [branding, setBranding] = useState({
        taglines: [
            'Turn ideas into reality',
            'From concept to launch',
            'Your startup journey starts here',
        ],
        fonts: {
            primary: 'Inter',
            secondary: 'DM Sans',
        },
    });

    /**
     * Load saved data from localStorage
     */
    const { currentIdea } = useIdeaStore();

    /**
     * Load saved data from localStorage OR autofill from store
     */
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);

                // Prioritize saved name, otherwise use global idea title
                if (data.startupName) {
                    setStartupName(data.startupName);
                } else if (currentIdea?.title) {
                    setStartupName(currentIdea.title);
                }

                setSelectedTone(data.selectedTone || 'Professional');
                if (data.selectedColorPreset) {
                    setSelectedColorPreset(data.selectedColorPreset);
                }
                if (data.branding) {
                    setBranding(data.branding);
                    setHasGenerated(true);
                }
            } catch (e) {
                console.error('Failed to load saved data:', e);
            }
        } else if (currentIdea?.title) {
            // No local save, autofill from global idea
            setStartupName(currentIdea.title);
        }

        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [currentIdea]);

    /**
     * Save to localStorage
     */
    const saveToLocalStorage = () => {
        const data = {
            startupName,
            selectedTone,
            selectedColorPreset,
            branding: hasGenerated ? branding : null,
            lastSaved: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        toast.success('Saved!', { duration: 1500 });
    };

    /**
     * Generate branding with AI (mock)
     */
    const generateBranding = async () => {
        if (!startupName.trim()) {
            toast.error('Please enter your startup name');
            return;
        }

        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate mock taglines based on name
        const mockTaglines = [
            `${startupName} - Where ideas take flight`,
            `Build smarter with ${startupName}`,
            `${startupName}: Your path to success`,
        ];

        setBranding({
            taglines: mockTaglines,
            fonts: {
                primary: selectedTone === 'Professional' ? 'Inter' : selectedTone === 'Playful' ? 'Poppins' : 'DM Sans',
                secondary: 'Inter',
            },
        });

        setHasGenerated(true);
        setIsGenerating(false);
        saveToLocalStorage();
        toast.success('Brand identity generated!');
    };

    if (isLoading) {
        return <BrandingSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Palette className="w-7 h-7 text-[#8B5CF6]" />
                        Branding
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Give your startup an identity
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        leftIcon={<Save className="w-4 h-4" />}
                        onClick={saveToLocalStorage}
                    >
                        Save
                    </Button>
                    <Button
                        variant="secondary"
                        leftIcon={<Download className="w-4 h-4" />}
                        disabled={!hasGenerated}
                    >
                        Download Brand Kit
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Input */}
                <div className="space-y-6">
                    {/* Startup Name */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Startup Name</CardTitle>
                            <CardDescription>
                                Enter your startup name to generate branding
                            </CardDescription>
                        </CardHeader>
                        <Input
                            placeholder="e.g., Pitchrr"
                            value={startupName}
                            onChange={(e) => setStartupName(e.target.value)}
                            className="mt-4"
                        />
                    </Card>

                    {/* Brand Tone */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Brand Tone</CardTitle>
                            <CardDescription>
                                How should your brand feel?
                            </CardDescription>
                        </CardHeader>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {brandTones.map((tone) => (
                                <button
                                    key={tone}
                                    onClick={() => setSelectedTone(tone)}
                                    className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${selectedTone === tone
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }
                  `}
                                >
                                    {tone}
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Color Palette */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Paintbrush className="w-5 h-5" />
                                Color Palette
                            </CardTitle>
                            <CardDescription>
                                Choose a color scheme for your brand
                            </CardDescription>
                        </CardHeader>
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {colorPresets.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => setSelectedColorPreset(preset)}
                                    className={`
                    p-3 rounded-lg border-2 transition-all
                    ${selectedColorPreset.name === preset.name
                                            ? 'border-blue-600 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }
                  `}
                                >
                                    <div className="flex gap-1 mb-2">
                                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.primary }} />
                                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.secondary }} />
                                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.accent }} />
                                    </div>
                                    <div className="text-xs font-medium text-gray-700)]">
                                        {preset.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Generate Button */}
                    <Button
                        onClick={generateBranding}
                        isLoading={isGenerating}
                        leftIcon={<Sparkles className="w-4 h-4" />}
                        className="w-full"
                    >
                        Generate Brand Identity
                    </Button>
                </div>

                {/* Right Column: Preview */}
                <div className="space-y-6">
                    {/* Brand Preview Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Brand Preview</CardTitle>
                        </CardHeader>
                        <div
                            className="mt-4 p-6 rounded-xl text-center"
                            style={{ backgroundColor: selectedColorPreset.primary + '10' }}
                        >
                            {/* Logo placeholder */}
                            <div
                                className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4"
                                style={{ backgroundColor: selectedColorPreset.primary }}
                            >
                                {startupName ? startupName[0]?.toUpperCase() : 'P'}
                            </div>
                            <h2
                                className="text-2xl font-bold mb-2"
                                style={{ color: selectedColorPreset.primary }}
                            >
                                {startupName || 'Your Startup'}
                            </h2>
                            {hasGenerated && branding.taglines[0] && (
                                <p className="text-gray-600">
                                    {branding.taglines[0]}
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* Taglines */}
                    {hasGenerated && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Type className="w-5 h-5" />
                                        Tagline Suggestions
                                    </CardTitle>
                                </CardHeader>
                                <div className="mt-4 space-y-3">
                                    {branding.taglines.map((tagline, i) => (
                                        <div
                                            key={i}
                                            className="p-3 rounded-lg bg-gray-50 text-[var(--color-gray-700)] italic"
                                        >
                                            "{tagline}"
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Font Recommendations */}
                    {hasGenerated && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Font Recommendations</CardTitle>
                                </CardHeader>
                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <span className="text-sm text-[var(--color-gray-600)]">Primary Font</span>
                                        <span className="font-semibold" style={{ fontFamily: branding.fonts.primary }}>
                                            {branding.fonts.primary}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-gray-50)]">
                                        <span className="text-sm text-[var(--color-gray-600)]">Secondary Font</span>
                                        <span className="font-semibold" style={{ fontFamily: branding.fonts.secondary }}>
                                            {branding.fonts.secondary}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
