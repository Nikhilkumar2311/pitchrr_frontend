/**
 * Module 7: Startup AI Chatbot Page
 * 
 * Context-aware AI assistant that knows the user's startup.
 * Uses the idea and module data to provide relevant responses.
 * 
 * FEATURES:
 * - Chat interface
 * - Predefined prompts
 * - Context-aware responses using idea data
 * - Chat history
 * 
 * DATA FLOW:
 * - Fetches current idea from Core Service
 * - Sends messages to AI with idea context
 * - Displays AI responses
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Send,
    User,
    Bot,
    RefreshCw,
    Lightbulb,
} from 'lucide-react';
import React from 'react';

/**
 * Format message content with markdown-like styling
 */
const formatMessage = (content: string): React.ReactNode => {
    // Split by newlines first
    const lines = content.split('\n');

    return lines.map((line, lineIndex) => {
        // Check for numbered lists (1. 2. 3. etc.)
        const numberedMatch = line.match(/^(\d+)[.)]\s*(.*)/);
        if (numberedMatch) {
            return (
                <div key={lineIndex} className="flex gap-2 my-1.5">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold shrink-0">
                        {numberedMatch[1]}
                    </span>
                    <span>{formatInlineText(numberedMatch[2])}</span>
                </div>
            );
        }

        // Check for bullet points
        if (line.match(/^[-•*]\s/)) {
            return (
                <div key={lineIndex} className="flex gap-2 my-1">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 shrink-0" />
                    <span>{formatInlineText(line.slice(2))}</span>
                </div>
            );
        }

        // Regular line
        if (line.trim()) {
            return <p key={lineIndex} className="my-1">{formatInlineText(line)}</p>;
        }

        // Empty line - add spacing
        return <div key={lineIndex} className="h-2" />;
    });
};

/**
 * Format inline text (bold, italic, etc.)
 */
const formatInlineText = (text: string): React.ReactNode => {
    // Handle **bold** text
    const parts = text.split(/(\*\*[^*]+\*\*)/);

    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};
import {
    Card,
    Button,
    Input,
    Badge,
} from '@/components/ui';
import toast from 'react-hot-toast';
import { StartupChatbotSkeleton } from '@/components/skeletons/StartupChatbotSkeleton';
import { SEO } from '@/components/common';
import { useIdea, useIdeas, useAllModules } from '@/hooks';
import { useIdeaStore, getStoredActiveIdeaId } from '@/store';
import api from '@/services/api';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

/**
 * Predefined prompts for quick actions
 */
const predefinedPrompts = [
    'Improve my startup idea',
    'Help me refine my pitch',
    'Suggest marketing strategies',
    'Analyze my competition',
    'Create a launch plan',
];

export default function StartupChatbot() {
    const STORAGE_KEY = 'pitchrr_chatbot_messages';

    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    // ==========================================================================
    // API HOOKS
    // ==========================================================================

    // Get active idea from store
    const { activeIdeaId: storedActiveIdeaId, setActiveIdeaId } = useIdeaStore();
    // Read from localStorage directly on initial render to avoid async hydration delay
    const initialStoredId = useMemo(() => getStoredActiveIdeaId(), []);

    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();
    const activeIdeaId = urlIdeaId || storedActiveIdeaId || initialStoredId || ideas?.[0]?.id;

    const { data: idea, isLoading: isLoadingIdea } = useIdea(activeIdeaId);
    const { data: allModules } = useAllModules(activeIdeaId);

    const isLoading = isLoadingIdeas || isLoadingIdea;

    // Sync activeIdeaId in store when idea changes to keep persistence across modules
    useEffect(() => {
        if (activeIdeaId && activeIdeaId !== storedActiveIdeaId) {
            setActiveIdeaId(activeIdeaId);
        }
    }, [activeIdeaId, storedActiveIdeaId, setActiveIdeaId]);

    // ==========================================================================
    // EFFECTS
    // ==========================================================================

    /**
     * Initialize with welcome message including idea context
     */
    useEffect(() => {
        // Load chat history
        const saved = localStorage.getItem(`${STORAGE_KEY}_${activeIdeaId || 'default'}`);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.messages && data.messages.length > 0) {
                    setMessages(data.messages.map((m: Message) => ({
                        ...m,
                        timestamp: new Date(m.timestamp),
                    })));
                    return;
                }
            } catch (e) {
                console.error('Failed to load chat history:', e);
            }
        }

        // Set initial welcome message with idea context
        const welcomeMessage = idea
            ? `Hi! 👋 I'm your AI startup mentor. I see you're working on "${idea.title}". I have access to all the analysis and data from your modules. How can I help you today?`
            : "Hi! 👋 I'm your AI startup mentor. Start by validating your idea in the Idea Validation module, and I'll have full context to help you build!";

        setMessages([{
            id: '1',
            role: 'assistant',
            content: welcomeMessage,
            timestamp: new Date(),
        }]);
    }, [idea, activeIdeaId]);

    /**
     * Save messages to localStorage
     */
    useEffect(() => {
        if (messages.length > 1 && activeIdeaId) {
            localStorage.setItem(`${STORAGE_KEY}_${activeIdeaId}`, JSON.stringify({ messages }));
        }
    }, [messages, activeIdeaId]);

    /**
     * Scroll to bottom when new messages arrive
     */
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // ==========================================================================
    // HANDLERS
    // ==========================================================================

    /**
     * Build context string from idea and modules
     */
    const buildContext = (): string => {
        if (!idea) return '';

        let context = `Startup Context:\n`;
        context += `- Title: ${idea.title}\n`;
        context += `- Description: ${idea.description}\n`;

        if (idea.industry) context += `- Industry: ${idea.industry}\n`;
        if (idea.targetAudience) context += `- Target Audience: ${idea.targetAudience}\n`;
        if (idea.problemSolved) context += `- Problem Solved: ${idea.problemSolved}\n`;

        // Add module summaries if available
        if (allModules && Object.keys(allModules).length > 0) {
            context += `\nCompleted Analyses:\n`;
            for (const [moduleType, moduleData] of Object.entries(allModules)) {
                if (moduleData && typeof moduleData === 'object') {
                    context += `- ${moduleType}: Available\n`;
                }
            }
        }

        return context;
    };

    /**
     * Send a message to the AI
     */
    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Call the chat API with context
            const context = buildContext();
            const { data } = await api.post('/chat', {
                message: content,
                context,
                ideaId: activeIdeaId,
                history: messages.slice(-10).map(m => ({
                    role: m.role,
                    content: m.content,
                })),
            });

            // Add AI response
            // Response structure: { success: true, response: { message, context_used, follow_up_questions } }
            let responseText = "I'm having trouble responding right now. Please try again.";

            if (data.response) {
                // Handle nested object response
                if (typeof data.response === 'object' && data.response.message) {
                    responseText = data.response.message;
                } else if (typeof data.response === 'string') {
                    responseText = data.response;
                }
            } else if (data.message) {
                responseText = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
            }

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseText,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
        } catch (error: any) {
            console.error('Chat error:', error);

            // Fallback to local response if API fails
            const fallbackResponse = getFallbackResponse(content);
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: fallbackResponse,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
        } finally {
            setIsTyping(false);
        }
    };

    /**
     * Fallback response when API is unavailable
     */
    const getFallbackResponse = (message: string): string => {
        const lowerMessage = message.toLowerCase();
        const ideaContext = idea ? `Based on your startup "${idea.title}", ` : '';

        if (lowerMessage.includes('idea') || lowerMessage.includes('improve')) {
            return `${ideaContext}here are some suggestions to strengthen your idea:\n\n1. **Focus on a specific niche** - Instead of targeting all customers, consider focusing on a specific segment.\n\n2. **Add a unique differentiator** - What makes your solution 10x better than existing alternatives?\n\n3. **Validate with real users** - Have you talked to potential customers? Their feedback is invaluable.\n\nWould you like me to dive deeper into any of these areas?`;
        }

        if (lowerMessage.includes('pitch') || lowerMessage.includes('deck')) {
            return `${ideaContext}here are key areas to focus on for your pitch:\n\n📌 **Problem Statement** - Make it specific and relatable\n📌 **Solution** - Show, don't just tell\n📌 **Market Size** - Use credible sources\n📌 **Traction** - Even early metrics matter\n📌 **The Ask** - Be clear about what you need\n\nWant me to review any specific aspect?`;
        }

        if (lowerMessage.includes('marketing') || lowerMessage.includes('growth')) {
            return `${ideaContext}for early-stage marketing, I recommend focusing on these channels:\n\n🎯 **Content Marketing** - Blog posts, LinkedIn articles\n🎯 **Community Building** - Reddit, indie hacker forums\n🎯 **Product Hunt Launch** - Great for initial traction\n🎯 **Partnerships** - Collaborate with complementary products\n\nWhat's your current marketing budget and timeline?`;
        }

        if (lowerMessage.includes('competition') || lowerMessage.includes('competitor')) {
            return `${ideaContext}understanding your competitive landscape is crucial. Here's my approach:\n\n**1. Identify Direct Competitors** - Who solves the same problem?\n**2. Analyze Indirect Competitors** - What alternatives do customers use?\n**3. Find Your Advantages** - What can you do that they can't?\n**4. Spot Market Gaps** - Where are competitors falling short?\n\nShall I do a deeper competitive analysis?`;
        }

        if (lowerMessage.includes('launch') || lowerMessage.includes('plan')) {
            return `${ideaContext}here's a suggested launch plan:\n\n**Week 1-2:** Build buzz\n- Create waitlist\n- Social media presence\n- Content creation\n\n**Week 3-4:** Soft launch\n- Beta users\n- Collect feedback\n- Iterate\n\n**Week 5+:** Public launch\n- Product Hunt\n- PR outreach\n- Scale\n\nReady to dive into any specific phase?`;
        }

        return `${ideaContext ? ideaContext + "I'm here to help you build your startup! " : "I'm here to help you build your startup! "}I can assist with:\n\n• Validating and improving your idea\n• Crafting your pitch deck\n• Marketing strategies\n• Competitive analysis\n• Launch planning\n\nWhat would you like to work on?`;
    };

    /**
     * Handle form submit
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    /**
     * Clear chat history
     */
    const clearChat = () => {
        const welcomeMessage = idea
            ? `Chat cleared! I'm still here to help with "${idea.title}". What would you like to work on?`
            : "Chat cleared! How can I help you with your startup?";

        setMessages([{
            id: Date.now().toString(),
            role: 'assistant',
            content: welcomeMessage,
            timestamp: new Date(),
        }]);
        if (activeIdeaId) {
            localStorage.removeItem(`${STORAGE_KEY}_${activeIdeaId}`);
        }
        toast.success('Chat cleared');
    };

    // ==========================================================================
    // RENDER
    // ==========================================================================

    if (isLoading) {
        return <StartupChatbotSkeleton />;
    }

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col">
            <SEO
                title="AI Mentor"
                description="Get personalized startup guidance from your AI mentor. Context-aware advice based on your idea, progress, and module data."
                canonical="/dashboard/chat"
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="w-7 h-7 text-[#EC4899]" />
                        AI Startup Mentor
                    </h1>
                    <p className="mt-1 text-gray-600 flex items-center gap-2">
                        Your always-on startup advisor
                        {idea && (
                            <Badge variant="primary" size="sm">
                                <Lightbulb className="w-3 h-3 mr-1" />
                                {idea.title}
                            </Badge>
                        )}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                    onClick={clearChat}
                >
                    Clear Chat
                </Button>
            </div>

            {/* Chat Container */}
            <Card className="flex-1 flex flex-col overflow-hidden">
                {/* Messages */}
                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                    <AnimatePresence>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                            >
                                {message.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-400 to-pink-600 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                        }`}
                                >
                                    <div className="text-sm leading-relaxed">
                                        {message.role === 'assistant'
                                            ? formatMessage(message.content)
                                            : message.content
                                        }
                                    </div>
                                    <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                                        }`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                {message.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                        <User className="w-4 h-4 text-gray-600" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3"
                        >
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-gray-100 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Predefined Prompts */}
                <div className="px-4 py-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                        {predefinedPrompts.map((prompt) => (
                            <button
                                key={prompt}
                                onClick={() => sendMessage(prompt)}
                                disabled={isTyping}
                                className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-50"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                    <div className="flex gap-3">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={idea
                                ? `Ask about ${idea.title}...`
                                : "Ask me anything about your startup..."
                            }
                            className="flex-1"
                            disabled={isTyping}
                        />
                        <Button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            leftIcon={<Send className="w-4 h-4" />}
                        >
                            Send
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
