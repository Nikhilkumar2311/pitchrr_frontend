/**
 * Generate Idea Modal
 * A popup that asks questions to help users without an idea
 * get AI-suggested startup ideas based on their interests
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button, Textarea } from '@/components/ui';
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
    const [generatedIdea, setGeneratedIdea] = useState<GeneratedIdea | null>(null);

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
            generateIdea();
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const generateIdea = async () => {
        setIsGenerating(true);

        try {
            // Import API service
            const { default: api } = await import('@/services/api');

            // Call Core Service to generate idea using AI
            const { data } = await api.post('/ideas/generate', {
                interests: answers.interests || [],
                skills: answers.skills || [],
                problemArea: answers.problemArea || '',
                resources: answers.resources || [],
            });

            // Invalidate credits cache to refresh balance after deduction
            queryClient.invalidateQueries({ queryKey: ['credits', 'stats'] });

            // Map API response to GeneratedIdea format
            const generatedIdea: GeneratedIdea = {
                title: data.title || 'AI-Generated Startup Idea',
                description: data.description || '',
                problem: data.problem || '',
                solution: data.solution || '',
                targetMarket: data.target_market || data.targetMarket || '',
            };

            setGeneratedIdea(generatedIdea);
            toast.success('Idea generated successfully!');
        } catch (error: any) {
            console.error('Failed to generate idea:', error);

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
            toast.error('Failed to generate idea. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUseIdea = () => {
        if (generatedIdea && onIdeaGenerated) {
            onIdeaGenerated(generatedIdea);
        }
        onClose();
    };

    const resetAndClose = () => {
        setCurrentStep(0);
        setAnswers({});
        setGeneratedIdea(null);
        setIsGenerating(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={resetAndClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header - fixed at top */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Generate Startup Idea</h2>
                                <p className="text-sm text-gray-500">Let AI help you find your next big thing</p>
                            </div>
                        </div>
                        <button
                            onClick={resetAndClose}
                            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress bar */}
                    {!generatedIdea && !isGenerating && (
                        <div className="px-6 pt-4 shrink-0">
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                <span>Step {currentStep + 1} of {questions.length}</span>
                                <span>{Math.round(progress)}% complete</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-linear-to-r from-blue-500 to-blue-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Content - scrollable */}
                    <div className="p-6 overflow-y-auto flex-1">
                        {isGenerating ? (
                            // Generating state
                            <div className="text-center py-12">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="w-16 h-16 mx-auto mb-6 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center"
                                >
                                    <Sparkles className="w-8 h-8 text-white" />
                                </motion.div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Generating your perfect idea...
                                </h3>
                                <p className="text-gray-600">
                                    Our AI is analyzing market trends and your preferences
                                </p>
                            </div>
                        ) : generatedIdea ? (
                            // Generated idea display
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-4">
                                        <Sparkles className="w-4 h-4" />
                                        Idea Generated!
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">{generatedIdea.title}</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                                        <p className="text-gray-600">{generatedIdea.description}</p>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-xl">
                                        <h4 className="font-semibold text-red-900 mb-2">Problem</h4>
                                        <p className="text-red-700">{generatedIdea.problem}</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-xl">
                                        <h4 className="font-semibold text-green-900 mb-2">Solution</h4>
                                        <p className="text-green-700">{generatedIdea.solution}</p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-xl">
                                        <h4 className="font-semibold text-blue-900 mb-2">Target Market</h4>
                                        <p className="text-blue-700">{generatedIdea.targetMarket}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Question display
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {currentQuestion.title}
                                </h3>
                                <p className="text-gray-600 mb-6">{currentQuestion.description}</p>

                                {currentQuestion.type === 'multiselect' && (
                                    <div className="flex flex-wrap gap-2">
                                        {currentQuestion.options?.map(option => {
                                            const isSelected = ((answers[currentQuestion.id] as string[]) || []).includes(option);
                                            return (
                                                <button
                                                    key={option}
                                                    onClick={() => handleOptionToggle(option)}
                                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
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

                    {/* Footer - fixed at bottom */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 shrink-0">
                        {generatedIdea ? (
                            <>
                                <Button variant="secondary" onClick={() => {
                                    setGeneratedIdea(null);
                                    setCurrentStep(0);
                                }}>
                                    Generate Another
                                </Button>
                                <Button onClick={handleUseIdea} rightIcon={<ArrowRight className="w-4 h-4" />}>
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
                                    {isLastStep ? 'Generate Idea' : 'Next'}
                                </Button>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
