/**
 * Generate Idea Modal
 * A popup that asks questions to help users without an idea
 * get AI-suggested startup ideas based on their interests.
 *
 * Generates 3 ideas and lets the user pick their favourite.
 * Redesigned to match dashboard design system.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button, Textarea } from '@/components/ui';
import { CreditCost } from '@/components/common';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface GenerateIdeaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onIdeaGenerated?: (idea: GeneratedIdea) => void;
}

interface GeneratedIdea {
    title: string;
    description: string;
    problem: string;
    solution: string;
    targetMarket: string;
    industry?: string;
}

// Questions to gather user preferences
const questions = [
    {
        id: 'interests',
        title: 'What are your interests?',
        description: 'Select areas you are passionate about or have experience in.',
        type: 'multiselect' as const,
        options: [
            'Technology', 'Healthcare', 'Education', 'Finance', 'E-commerce',
            'Entertainment', 'Food & Beverage', 'Travel', 'Real Estate', 'Sustainability',
            'Fashion', 'Fitness', 'Social Impact', 'B2B Services', 'Gaming'
        ],
    },
    {
        id: 'skills',
        title: 'What are your skills?',
        description: 'What can you bring to your startup?',
        type: 'multiselect' as const,
        options: [
            'Software Development', 'Design/UX', 'Marketing', 'Sales',
            'Operations', 'Finance/Accounting', 'Content Creation', 'Data Analysis',
            'Product Management', 'Leadership', 'Domain Expertise', 'Networking'
        ],
    },
    {
        id: 'problemArea',
        title: 'Any problem you want to solve?',
        description: 'Describe a frustration or inefficiency you\'ve noticed (optional)',
        type: 'textarea' as const,
        placeholder: 'e.g., "I find it hard to track my fitness goals across multiple apps..."',
    },
    {
        id: 'resources',
        title: 'What resources do you have?',
        description: 'This helps us suggest realistic ideas',
        type: 'multiselect' as const,
        options: [
            'Limited budget (bootstrapping)', 'Some savings to invest',
            'Access to investors', 'Technical team', 'Industry connections',
            'Full-time commitment', 'Part-time/Side project'
        ],
    },
];

export function GenerateIdeaModal({ isOpen, onClose, onIdeaGenerated }: GenerateIdeaModalProps) {
    const queryClient = useQueryClient();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const currentQuestion = questions[currentStep];
    const isLastStep = currentStep === questions.length - 1;
    const progress = ((currentStep + 1) / questions.length) * 100;

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleOptionToggle = (option: string) => {
        const current = (answers[currentQuestion.id] as string[]) || [];
        if (current.includes(option)) {
            setAnswers({ ...answers, [currentQuestion.id]: current.filter(o => o !== option) });
        } else {
            setAnswers({ ...answers, [currentQuestion.id]: [...current, option] });
        }
    };

    const handleTextChange = (value: string) => {
        setAnswers({ ...answers, [currentQuestion.id]: value });
    };

    const handleNext = () => {
        if (isLastStep) {
            generateIdeas();
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const generateIdeas = async () => {
        setIsGenerating(true);

        try {
            // Import API service
            const { default: api } = await import('@/services/api');

            // Call Core Service to generate ideas using AI
            const { data } = await api.post('/ideas/generate', {
                interests: answers.interests || [],
                skills: answers.skills || [],
                problemArea: answers.problemArea || '',
                resources: answers.resources || [],
            });

            // Invalidate credits cache to refresh balance after deduction
            queryClient.invalidateQueries({ queryKey: ['credits', 'stats'] });

            // Parse response — data may be { ideas: [...] } or a single idea object
            let ideasArray: any[] = [];
            if (data?.ideas && Array.isArray(data.ideas)) {
                ideasArray = data.ideas;
            } else if (Array.isArray(data)) {
                ideasArray = data;
            } else if (data && typeof data === 'object') {
                // Single idea (backward compat)
                ideasArray = [data];
            }

            // Derive industry from user's selected interests
            const industryFromInterests = Array.isArray(answers.interests)
                ? (answers.interests as string[]).join(', ')
                : '';

            // Map to GeneratedIdea format
            const mapped: GeneratedIdea[] = ideasArray.map((item: any) => ({
                title: item.title || 'AI-Generated Idea',
                description: item.description || '',
                problem: item.problem || '',
                solution: item.solution || '',
                targetMarket: item.target_market || item.targetMarket || '',
                industry: industryFromInterests,
            }));

            setGeneratedIdeas(mapped);
            // Auto-select the first idea
            setSelectedIndex(0);
            toast.success(`${mapped.length} idea${mapped.length > 1 ? 's' : ''} generated!`);
        } catch (error: any) {
            console.error('Failed to generate ideas:', error);

            // Handle insufficient credits (402 Payment Required)
            if (error.response?.status === 402) {
                const { required, available } = error.response.data;
                toast.error(
                    `Insufficient credits. You need ${required} credits but only have ${available}. Please purchase more credits.`,
                    { duration: 5000 }
                );
                return;
            }

            // Handle other errors
            toast.error('Failed to generate ideas. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUseIdea = () => {
        if (selectedIndex !== null && generatedIdeas[selectedIndex] && onIdeaGenerated) {
            onIdeaGenerated(generatedIdeas[selectedIndex]);
        }
        onClose();
    };

    const resetAndClose = () => {
        setCurrentStep(0);
        setAnswers({});
        setGeneratedIdeas([]);
        setSelectedIndex(null);
        setIsGenerating(false);
        onClose();
    };

    if (!isOpen) return null;

    // Detail sections config for selected idea
    const detailSections = [
        { key: 'problem', label: 'Problem', emoji: '⚡', color: '#EF4444' },
        { key: 'solution', label: 'Solution', emoji: '✅', color: '#10B981' },
        { key: 'targetMarket', label: 'Target Market', emoji: '🎯', color: '#4F7DF3' },
    ] as const;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                }}
                onClick={resetAndClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="rounded-[14px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                    style={{
                        background: 'white',
                        boxShadow: '0 24px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between p-5 shrink-0"
                        style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, #4F7DF3, #7A5CFF)',
                                    boxShadow: '0 4px 12px rgba(79,125,243,0.25)',
                                }}
                            >
                                <Sparkles className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                            </div>
                            <div>
                                <h2
                                    className="text-[16px] font-bold"
                                    style={{ color: 'var(--dash-text, #0F172A)', fontFamily: 'var(--dash-font-heading, Sora, sans-serif)' }}
                                >
                                    Generate Startup Idea
                                </h2>
                                <p className="text-[12px]" style={{ color: 'var(--dash-text-muted, #64748B)' }}>
                                    Let AI help you find your next big thing
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={resetAndClose}
                            className="p-1.5 rounded-[8px] transition-all duration-150 cursor-pointer"
                            style={{ color: '#94A3B8' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#64748B';
                                e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#94A3B8';
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <X className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                        </button>
                    </div>

                    {/* Progress strip (questions phase only) */}
                    {generatedIdeas.length === 0 && !isGenerating && (
                        <div className="px-5 pt-4 shrink-0">
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className="text-[12px] font-medium"
                                    style={{ color: 'var(--dash-text-muted)' }}
                                >
                                    Step {currentStep + 1} of {questions.length}
                                </span>
                                <span
                                    className="text-[12px] font-semibold"
                                    style={{ color: '#4F7DF3' }}
                                >
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.04)' }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: 'linear-gradient(90deg, #4F7DF3, #7A5CFF)' }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Content - scrollable */}
                    <div className="p-5 overflow-y-auto flex-1">
                        {isGenerating ? (
                            /* Generating state */
                            <div className="text-center py-12">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="w-14 h-14 mx-auto mb-5 rounded-[12px] flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(135deg, #4F7DF3, #7A5CFF)',
                                        boxShadow: '0 8px 24px rgba(79,125,243,0.3)',
                                    }}
                                >
                                    <Sparkles className="w-7 h-7 text-white" />
                                </motion.div>
                                <h3
                                    className="text-[16px] font-semibold mb-1.5"
                                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                                >
                                    Generating ideas for you...
                                </h3>
                                <p className="text-[13px]" style={{ color: 'var(--dash-text-muted)' }}>
                                    Our AI is analyzing market trends and your preferences
                                </p>
                            </div>
                        ) : generatedIdeas.length > 0 ? (
                            /* Generated Ideas Selection */
                            <div className="space-y-2">
                                <div className="text-center mb-4">
                                    <span
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold mb-2"
                                        style={{
                                            background: 'rgba(16,185,129,0.06)',
                                            color: '#059669',
                                            border: '1px solid rgba(16,185,129,0.1)',
                                        }}
                                    >
                                        <Sparkles style={{ width: 14, height: 14 }} />
                                        Ideas Generated!
                                    </span>
                                    <p className="text-[12px] mt-2" style={{ color: 'var(--dash-text-muted)' }}>
                                        Click on an idea to see details, then choose one to get started.
                                    </p>
                                </div>

                                {generatedIdeas.map((idea, index) => {
                                    const isSelected = selectedIndex === index;
                                    return (
                                        <motion.button
                                            key={index}
                                            type="button"
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.08 }}
                                            onClick={() => setSelectedIndex(index)}
                                            className="group w-full text-left rounded-[12px] transition-all duration-200"
                                            style={{
                                                padding: '14px 16px',
                                                background: isSelected ? 'rgba(79,125,243,0.03)' : 'rgba(0,0,0,0.015)',
                                                border: isSelected
                                                    ? '1.5px solid rgba(79,125,243,0.2)'
                                                    : '1.5px solid transparent',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.background = 'rgba(0,0,0,0.025)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.background = 'rgba(0,0,0,0.015)';
                                                }
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Number / check */}
                                                <div
                                                    className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200"
                                                    style={{
                                                        background: isSelected
                                                            ? 'linear-gradient(135deg, #4F7DF3, #7A5CFF)'
                                                            : 'rgba(0,0,0,0.04)',
                                                    }}
                                                >
                                                    {isSelected
                                                        ? <Check className="text-white" style={{ width: 14, height: 14 }} />
                                                        : <span
                                                            className="text-[12px] font-bold"
                                                            style={{ color: 'var(--dash-text-muted)' }}
                                                        >
                                                            {index + 1}
                                                        </span>
                                                    }
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4
                                                        className="font-semibold text-[14px]"
                                                        style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                                                    >
                                                        {idea.title}
                                                    </h4>
                                                    <p
                                                        className="text-[12px] mt-1 leading-relaxed"
                                                        style={{ color: 'var(--dash-text-muted)' }}
                                                    >
                                                        {idea.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Expanded Details */}
                                            <AnimatePresence>
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-3 ml-11 space-y-2">
                                                            {detailSections.map(({ key, label, emoji, color }) => {
                                                                const value = idea[key];
                                                                if (!value) return null;
                                                                return (
                                                                    <div
                                                                        key={key}
                                                                        className="rounded-[8px] p-3"
                                                                        style={{
                                                                            background: `${color}06`,
                                                                            border: `1px solid ${color}10`,
                                                                        }}
                                                                    >
                                                                        <span
                                                                            className="text-[10px] font-bold uppercase tracking-wider"
                                                                            style={{ color }}
                                                                        >
                                                                            {emoji} {label}
                                                                        </span>
                                                                        <p
                                                                            className="text-[12px] mt-1 leading-relaxed"
                                                                            style={{ color: 'var(--dash-text-secondary)' }}
                                                                        >
                                                                            {value}
                                                                        </p>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Question display */
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3
                                    className="text-[18px] font-semibold mb-1.5"
                                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                                >
                                    {currentQuestion.title}
                                </h3>
                                <p
                                    className="text-[13px] mb-5"
                                    style={{ color: 'var(--dash-text-muted)' }}
                                >
                                    {currentQuestion.description}
                                </p>

                                {currentQuestion.type === 'multiselect' && (
                                    <div className="flex flex-wrap gap-2">
                                        {currentQuestion.options?.map(option => {
                                            const isOptionSelected = ((answers[currentQuestion.id] as string[]) || []).includes(option);
                                            return (
                                                <button
                                                    key={option}
                                                    onClick={() => handleOptionToggle(option)}
                                                    className="transition-all duration-150 cursor-pointer"
                                                    style={{
                                                        padding: '7px 14px',
                                                        borderRadius: 8,
                                                        fontSize: 13,
                                                        fontWeight: 500,
                                                        fontFamily: "var(--dash-font-body, 'Inter', sans-serif)",
                                                        background: isOptionSelected
                                                            ? 'linear-gradient(135deg, #4F7DF3, #7A5CFF)'
                                                            : 'rgba(0,0,0,0.03)',
                                                        color: isOptionSelected ? '#fff' : 'var(--dash-text-secondary, #475569)',
                                                        border: isOptionSelected
                                                            ? '1.5px solid transparent'
                                                            : '1.5px solid var(--dash-border-solid, #E8ECF4)',
                                                        boxShadow: isOptionSelected
                                                            ? '0 2px 8px rgba(79,125,243,0.25)'
                                                            : 'none',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!isOptionSelected) {
                                                            e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
                                                            e.currentTarget.style.borderColor = '#D1D5DB';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!isOptionSelected) {
                                                            e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                                                            e.currentTarget.style.borderColor = 'var(--dash-border-solid, #E8ECF4)';
                                                        }
                                                    }}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {currentQuestion.type === 'textarea' && (
                                    <Textarea
                                        placeholder={currentQuestion.placeholder}
                                        value={(answers[currentQuestion.id] as string) || ''}
                                        onChange={e => handleTextChange(e.target.value)}
                                        rows={4}
                                    />
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Footer */}
                    <div
                        className="flex items-center justify-between p-5 shrink-0"
                        style={{
                            borderTop: '1px solid rgba(0,0,0,0.05)',
                            background: 'var(--dash-bg, #F8FAFF)',
                        }}
                    >
                        {generatedIdeas.length > 0 ? (
                            <>
                                <Button variant="secondary" onClick={() => {
                                    setGeneratedIdeas([]);
                                    setSelectedIndex(null);
                                    generateIdeas();
                                }}>
                                    Generate Again
                                    <CreditCost cost={2} />
                                </Button>
                                <Button
                                    onClick={handleUseIdea}
                                    disabled={selectedIndex === null}
                                    rightIcon={<ArrowRight className="w-4 h-4" />}
                                >
                                    Use This Idea
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={handleBack}
                                    disabled={currentStep === 0}
                                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    disabled={isGenerating}
                                    rightIcon={isLastStep ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                                >
                                    {isLastStep ? 'Generate Ideas' : 'Next'}
                                    {isLastStep && <CreditCost cost={2} />}
                                </Button>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
