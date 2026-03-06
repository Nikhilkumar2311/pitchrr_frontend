/**
 * Module 7: Startup AI Chatbot Page
 * 
 * Context-aware AI assistant that knows the user's startup.
 * Uses the idea and module data to provide relevant responses.
 * 
 * DESIGN:
 * - Borderless, open chat layout (no container box)
 * - Bot messages: no background, clean text with subtle left accent
 * - User messages: gradient pill, right-aligned
 * - Floating input bar at bottom
 * - Premium sparkle bot avatar
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    User,
    RefreshCw,
    ArrowDown,
    Sparkles,
} from 'lucide-react';
import React from 'react';

/**
 * Strip follow-up questions section from message body
 */
const stripFollowUpSection = (content: string): string => {
    return content.replace(/\n*#{0,3}\s*(?:Follow[- ]?Up|Suggested|Next)\s*Questions?\s*:?\s*\n[\s\S]*$/i, '').trim();
};

/**
 * Format message content with markdown-like styling
 */
const formatMessage = (content: string, isUser: boolean): React.ReactNode => {
    const lines = content.split('\n');

    return lines.map((line, lineIndex) => {
        const headingMatch = line.match(/^(#{1,3})\s+(.*)/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const text = headingMatch[2];
            const style = {
                color: isUser ? '#fff' : 'var(--dash-text)',
            };
            if (level === 1) {
                return <h3 key={lineIndex} className="text-[15px] font-bold mt-3 mb-1" style={style}>{formatInlineText(text)}</h3>;
            } else if (level === 2) {
                return <h4 key={lineIndex} className="text-[14px] font-bold mt-3 mb-1" style={{ ...style, opacity: isUser ? 0.95 : 1 }}>{formatInlineText(text)}</h4>;
            } else {
                return <h5 key={lineIndex} className="text-[13px] font-semibold mt-2 mb-0.5" style={{ ...style, opacity: isUser ? 0.9 : 0.85 }}>{formatInlineText(text)}</h5>;
            }
        }

        const numberedMatch = line.match(/^(\d+)[.)]\s*(.*)/);
        if (numberedMatch) {
            return (
                <div key={lineIndex} className="flex gap-2.5 my-1.5">
                    <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                        style={{
                            background: isUser ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.12))',
                            color: isUser ? '#fff' : '#8B5CF6',
                        }}
                    >
                        {numberedMatch[1]}
                    </span>
                    <span>{formatInlineText(numberedMatch[2])}</span>
                </div>
            );
        }

        if (line.match(/^[-•*]\s/)) {
            return (
                <div key={lineIndex} className="flex gap-2.5 my-1">
                    <span
                        className="w-1.5 h-1.5 rounded-full mt-[7px] shrink-0"
                        style={{ background: isUser ? 'rgba(255,255,255,0.5)' : '#EC4899' }}
                    />
                    <span>{formatInlineText(line.slice(2))}</span>
                </div>
            );
        }

        if (line.trim()) {
            return <p key={lineIndex} className="my-1">{formatInlineText(line)}</p>;
        }

        return <div key={lineIndex} className="h-2" />;
    });
};

const formatInlineText = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

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

const defaultPrompts = [
    '💡 Improve my startup idea',
    '🎯 Help me refine my pitch',
    '📈 Suggest marketing strategies',
    '🔍 Analyze my competition',
    '🚀 Create a launch plan',
];

export default function StartupChatbot() {
    const STORAGE_KEY = 'pitchrr_chatbot_messages';
    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [followUpQuestions, setFollowUpQuestions] = useState<string[]>(defaultPrompts);

    const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(null);
    const [displayedCharCount, setDisplayedCharCount] = useState(0);
    const animatingContentRef = useRef<string>('');
    const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    // API HOOKS
    const { activeIdeaId: storedActiveIdeaId, setActiveIdeaId } = useIdeaStore();
    const initialStoredId = useMemo(() => getStoredActiveIdeaId(), []);
    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();
    const activeIdeaId = urlIdeaId || storedActiveIdeaId || initialStoredId || ideas?.[0]?.id;
    const { data: idea, isLoading: isLoadingIdea } = useIdea(activeIdeaId);
    const { data: allModules } = useAllModules(activeIdeaId);
    const isLoading = isLoadingIdeas || isLoadingIdea;

    useEffect(() => {
        if (activeIdeaId && activeIdeaId !== storedActiveIdeaId) {
            setActiveIdeaId(activeIdeaId);
        }
    }, [activeIdeaId, storedActiveIdeaId, setActiveIdeaId]);

    // EFFECTS
    useEffect(() => {
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

        const welcomeMessage = idea
            ? `Hi! 👋 I'm your AI startup mentor. I see you're working on **${idea.title}**. I have access to all your analysis and module data. How can I help you today?`
            : "Hi! 👋 I'm your AI startup mentor. Start by validating your idea in the Idea Validation module, and I'll have full context to help you build!";

        setMessages([{
            id: '1',
            role: 'assistant',
            content: welcomeMessage,
            timestamp: new Date(),
        }]);
    }, [idea, activeIdeaId]);

    useEffect(() => {
        if (messages.length > 1 && activeIdeaId) {
            localStorage.setItem(`${STORAGE_KEY}_${activeIdeaId}`, JSON.stringify({ messages }));
        }
    }, [messages, activeIdeaId]);

    const [showScrollButton, setShowScrollButton] = useState(false);
    const userScrolledRef = useRef(false);

    const handleChatScroll = useCallback(() => {
        if (!chatContainerRef.current) return;
        const el = chatContainerRef.current;
        const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
        userScrolledRef.current = !isNearBottom;
        setShowScrollButton(!isNearBottom);
    }, []);

    const scrollToBottom = useCallback(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
            userScrolledRef.current = false;
            setShowScrollButton(false);
        }
    }, []);

    useEffect(() => {
        if (chatContainerRef.current && !userScrolledRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [displayedCharCount]);

    useEffect(() => {
        if (chatContainerRef.current) {
            userScrolledRef.current = false;
            setShowScrollButton(false);
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages.length, isTyping]);

    const startTypewriter = useCallback((messageId: string, fullContent: string) => {
        if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
        animatingContentRef.current = fullContent;
        setAnimatingMessageId(messageId);
        setDisplayedCharCount(0);
    }, []);

    useEffect(() => {
        if (!animatingMessageId) return;
        const fullLength = animatingContentRef.current.length;
        if (displayedCharCount >= fullLength) {
            setAnimatingMessageId(null);
            setDisplayedCharCount(0);
            animatingContentRef.current = '';
            return;
        }
        const progress = displayedCharCount / fullLength;
        const delay = Math.max(1, 25 * Math.exp(-progress * 5));
        const charsPerTick = delay <= 2 ? 3 : delay <= 5 ? 2 : 1;

        animationTimerRef.current = setTimeout(() => {
            setDisplayedCharCount(prev => Math.min(prev + charsPerTick, fullLength));
        }, delay);

        return () => { if (animationTimerRef.current) clearTimeout(animationTimerRef.current); };
    }, [animatingMessageId, displayedCharCount]);

    // HANDLERS
    const buildContext = (): Record<string, any> => {
        if (!idea) return {};
        const context: Record<string, any> = {
            ideaTitle: idea.title,
            ideaDescription: idea.description,
            industry: idea.industry || undefined,
            targetAudience: idea.targetAudience || undefined,
            problemSolved: idea.problemSolved || undefined,
            startupStage: (idea as any).startupStage || undefined,
            amount: (idea as any).amount || undefined,
        };
        if (allModules && Object.keys(allModules).length > 0) {
            const moduleSummaries: Record<string, any> = {};
            for (const [moduleType, moduleData] of Object.entries(allModules)) {
                if (moduleData && typeof moduleData === 'object') {
                    const dataStr = JSON.stringify(moduleData);
                    moduleSummaries[moduleType] = dataStr.length > 2000 ? dataStr.slice(0, 2000) + '...' : moduleData;
                }
            }
            context.moduleData = moduleSummaries;
        }
        return context;
    };

    const sendMessage = async (content: string) => {
        if (!content.trim()) return;
        const userMessage: Message = { id: Date.now().toString(), role: 'user', content: content.trim(), timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const context = buildContext();
            const { data } = await api.post('/chat', {
                message: content, context, ideaId: activeIdeaId,
                history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
            });

            let responseText = "I'm having trouble responding right now. Please try again.";
            let newFollowUps: string[] = [];
            if (data.response) {
                if (typeof data.response === 'object' && data.response.message) {
                    responseText = data.response.message;
                    if (Array.isArray(data.response.follow_up_questions) && data.response.follow_up_questions.length > 0) {
                        newFollowUps = data.response.follow_up_questions;
                    }
                } else if (typeof data.response === 'string') {
                    responseText = data.response;
                }
            } else if (data.message) {
                responseText = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
            }
            if (newFollowUps.length > 0) setFollowUpQuestions(newFollowUps);

            const aiMessageId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: aiMessageId, role: 'assistant', content: responseText, timestamp: new Date() }]);
            startTypewriter(aiMessageId, responseText);
        } catch (error: any) {
            console.error('Chat error:', error);
            const fallbackResponse = getFallbackResponse(content);
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: fallbackResponse, timestamp: new Date() }]);
        } finally {
            setIsTyping(false);
        }
    };

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const clearChat = () => {
        const welcomeMessage = idea
            ? `Chat cleared! I'm still here to help with **${idea.title}**. What would you like to work on?`
            : "Chat cleared! How can I help you with your startup?";
        setMessages([{ id: Date.now().toString(), role: 'assistant', content: welcomeMessage, timestamp: new Date() }]);
        if (activeIdeaId) localStorage.removeItem(`${STORAGE_KEY}_${activeIdeaId}`);
        toast.success('Chat cleared');
    };

    // RENDER
    if (isLoading) return <StartupChatbotSkeleton />;

    return (
        <div className="h-[calc(100vh-7rem)] flex flex-col">
            <SEO
                title="AI Mentor"
                description="Get personalized startup guidance from your AI mentor."
                canonical="/dashboard/chat"
            />

            {/* Minimal Header */}
            <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-3">
                    {/* Premium Bot Avatar */}
                    <div
                        className="w-10 h-10 rounded-[14px] flex items-center justify-center relative"
                        style={{
                            background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                            boxShadow: '0 4px 14px rgba(236,72,153,0.3)',
                        }}
                    >
                        <Sparkles className="w-5 h-5 text-white" />
                        {/* Online indicator */}
                        <div
                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
                            style={{
                                background: '#22C55E',
                                border: '2px solid var(--dash-card-bg, #fff)',
                            }}
                        />
                    </div>
                    <div>
                        <h1
                            className="text-[18px] font-bold flex items-center gap-2"
                            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                        >
                            AI Startup Mentor
                        </h1>
                        <p className="text-[12px] flex items-center gap-1.5" style={{ color: 'var(--dash-text-muted)' }}>
                            <span
                                className="w-1.5 h-1.5 rounded-full inline-block"
                                style={{ background: '#22C55E' }}
                            />
                            Always online
                            {idea && (
                                <>
                                    <span style={{ color: 'var(--dash-border-solid, #E8ECF4)' }}>·</span>
                                    <span style={{ color: '#8B5CF6' }}>{idea.title}</span>
                                </>
                            )}
                        </p>
                    </div>
                </div>
                <button
                    onClick={clearChat}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all cursor-pointer"
                    style={{ color: 'var(--dash-text-muted)', background: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Clear
                </button>
            </div>

            {/* Separator */}
            <div className="h-px mx-1 mb-2" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />

            {/* Chat Area — NO outer container box */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Messages — clean, no container borders */}
                <div
                    ref={chatContainerRef}
                    onScroll={handleChatScroll}
                    className="flex-1 overflow-y-auto px-1 pb-4"
                >
                    <div className="max-w-7xl mx-auto space-y-5 pt-3">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                                >
                                    {/* Bot avatar — sparkle icon with gradient */}
                                    {message.role === 'assistant' && (
                                        <div
                                            className="w-7 h-7 rounded-[10px] flex items-center justify-center shrink-0 mt-0.5"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(139,92,246,0.12))',
                                            }}
                                        >
                                            <Sparkles className="w-3.5 h-3.5" style={{ color: '#EC4899' }} />
                                        </div>
                                    )}

                                    {/* Message content */}
                                    {message.role === 'user' ? (
                                        /* User: gradient pill */
                                        <div
                                            className="max-w-[75%] rounded-[20px] rounded-br-[6px] px-4 py-3"
                                            style={{
                                                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                                                color: '#fff',
                                            }}
                                        >
                                            <div className="text-[13px] leading-relaxed">
                                                {formatMessage(message.content, true)}
                                            </div>
                                            <div className="text-[10px] mt-1 text-right" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    ) : (
                                        /* Bot: clean text, NO background box */
                                        <div className="max-w-[85%] py-1">
                                            <div
                                                className="text-[13px] leading-[1.7]"
                                                style={{ color: 'var(--dash-text-secondary)' }}
                                            >
                                                {formatMessage(stripFollowUpSection(
                                                    message.id === animatingMessageId
                                                        ? animatingContentRef.current.slice(0, displayedCharCount)
                                                        : message.content
                                                ), false)}
                                                {message.id === animatingMessageId && (
                                                    <span
                                                        className="inline-block w-0.5 h-4 animate-pulse ml-0.5 align-text-bottom rounded-full"
                                                        style={{ background: '#EC4899' }}
                                                    />
                                                )}
                                            </div>
                                            <div className="text-[10px] mt-1" style={{ color: 'var(--dash-text-muted)', opacity: 0.6 }}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    )}

                                    {/* User avatar */}
                                    {message.role === 'user' && (
                                        <div
                                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                            style={{
                                                background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                                            }}
                                        >
                                            <User className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Typing indicator — minimal dots */}
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-3"
                            >
                                <div
                                    className="w-7 h-7 rounded-[10px] flex items-center justify-center mt-0.5"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(139,92,246,0.12))',
                                    }}
                                >
                                    <Sparkles className="w-3.5 h-3.5" style={{ color: '#EC4899' }} />
                                </div>
                                <div className="flex items-center gap-1 py-3">
                                    {[0, 1, 2].map(i => (
                                        <span
                                            key={i}
                                            className="w-[6px] h-[6px] rounded-full animate-bounce"
                                            style={{
                                                background: '#EC4899',
                                                opacity: 1 - i * 0.25,
                                                animationDelay: `${i * 150}ms`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Floating scroll-to-bottom */}
                {showScrollButton && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-32 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 z-10 cursor-pointer"
                        style={{
                            background: 'var(--dash-card-bg, #fff)',
                            border: '1px solid var(--dash-border-solid, #E8ECF4)',
                            color: 'var(--dash-text-muted)',
                        }}
                    >
                        <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                )}

                {/* Suggestion chips — only show after bot finishes responding */}
                {!isTyping && !animatingMessageId && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="px-4 py-2.5 max-w-7xl mx-auto w-full"
                    >
                        <div className="flex flex-wrap gap-1.5">
                            {followUpQuestions.map((prompt, idx) => (
                                <button
                                    key={`${prompt}-${idx}`}
                                    onClick={() => sendMessage(prompt)}
                                    className="px-3 py-1.5 text-[12px] rounded-full transition-all cursor-pointer"
                                    style={{
                                        background: 'rgba(0,0,0,0.025)',
                                        color: 'var(--dash-text-secondary)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(139,92,246,0.08))';
                                        e.currentTarget.style.color = '#8B5CF6';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(0,0,0,0.025)';
                                        e.currentTarget.style.color = 'var(--dash-text-secondary)';
                                    }}
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Floating Input Bar */}
                <div className="px-4 pb-3 max-w-7xl mx-auto w-full">
                    <form
                        onSubmit={handleSubmit}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-[14px] transition-all"
                        style={{
                            background: 'var(--dash-card-bg, #fff)',
                            border: '1px solid var(--dash-border-solid, #E8ECF4)',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        }}
                        onFocus={(e) => {
                            const form = e.currentTarget;
                            form.style.borderColor = 'rgba(139,92,246,0.3)';
                            form.style.boxShadow = '0 2px 20px rgba(139,92,246,0.08)';
                        }}
                        onBlur={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                const form = e.currentTarget;
                                form.style.borderColor = 'var(--dash-border-solid, #E8ECF4)';
                                form.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                            }
                        }}
                    >
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={idea ? `Message about ${idea.title}...` : "Ask me anything about your startup..."}
                            className="flex-1 text-[13px] outline-none bg-transparent"
                            style={{ color: 'var(--dash-text)' }}
                            disabled={isTyping}
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 transition-all cursor-pointer disabled:opacity-30"
                            style={{
                                background: inputValue.trim()
                                    ? 'linear-gradient(135deg, #EC4899, #8B5CF6)'
                                    : 'rgba(0,0,0,0.04)',
                                color: inputValue.trim() ? '#fff' : 'var(--dash-text-muted)',
                            }}
                        >
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
