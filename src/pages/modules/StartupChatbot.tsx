/**
 * Module 7: Startup AI Chatbot Page
 * 
 * Context-aware AI assistant that knows the user's startup.
 * 
 * FEATURES:
 * - Chat interface
 * - Predefined prompts
 * - Context-aware responses
 * - Chat history
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Send,
    User,
    Bot,
    RefreshCw,
} from 'lucide-react';
import {
    Card,
    Button,
    Input,
} from '@/components/ui';
import toast from 'react-hot-toast';

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

/**
 * Mock AI responses based on user input
 */
const getMockResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('idea') || lowerMessage.includes('improve')) {
        return "Based on your startup profile, here are some suggestions to strengthen your idea:\n\n1. **Focus on a specific niche** - Instead of targeting all founders, consider focusing on first-time founders in a specific industry.\n\n2. **Add a unique differentiator** - What makes your solution 10x better than existing alternatives?\n\n3. **Validate with real users** - Have you talked to potential customers? Their feedback is invaluable.\n\nWould you like me to dive deeper into any of these areas?";
    }

    if (lowerMessage.includes('pitch') || lowerMessage.includes('deck')) {
        return "I'd be happy to help with your pitch! Here are key areas to focus on:\n\n📌 **Problem Statement** - Make it specific and relatable\n📌 **Solution** - Show, don't just tell\n📌 **Market Size** - Use credible sources\n📌 **Traction** - Even early metrics matter\n📌 **The Ask** - Be clear about what you need\n\nWant me to review any specific slide?";
    }

    if (lowerMessage.includes('marketing') || lowerMessage.includes('growth')) {
        return "For early-stage marketing, I recommend focusing on these channels:\n\n🎯 **Content Marketing** - Blog posts, LinkedIn articles\n🎯 **Community Building** - Reddit, indie hacker forums\n🎯 **Product Hunt Launch** - Great for initial traction\n🎯 **Partnerships** - Collaborate with complementary products\n\nWhat's your current marketing budget and timeline?";
    }

    if (lowerMessage.includes('competition') || lowerMessage.includes('competitor')) {
        return "Understanding your competitive landscape is crucial. Here's my analysis:\n\n**Direct Competitors:**\n- Traditional pitch deck tools (Slidebean, Beautiful.ai)\n- All-in-one platforms (Notion, Coda)\n\n**Your Advantages:**\n- AI-powered validation\n- Startup-specific focus\n- All-in-one solution\n\nShall I do a deeper competitive analysis?";
    }

    if (lowerMessage.includes('launch') || lowerMessage.includes('plan')) {
        return "Here's a suggested launch plan:\n\n**Week 1-2:** Build buzz\n- Create waitlist\n- Social media presence\n- Content creation\n\n**Week 3-4:** Soft launch\n- Beta users\n- Collect feedback\n- Iterate\n\n**Week 5+:** Public launch\n- Product Hunt\n- PR outreach\n- Scale\n\nReady to dive into any specific phase?";
    }

    return "I'm here to help you build your startup! I can assist with:\n\n• Validating and improving your idea\n• Crafting your pitch deck\n• Marketing strategies\n• Competitive analysis\n• Launch planning\n\nWhat would you like to work on?";
};

export default function StartupChatbot() {
    const STORAGE_KEY = 'pitchrr_chatbot_messages';

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hi! 👋 I'm your AI startup mentor. I know about your startup from the modules you've completed. How can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    /**
     * Load chat history from localStorage
     */
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.messages && data.messages.length > 0) {
                    setMessages(data.messages.map((m: Message) => ({
                        ...m,
                        timestamp: new Date(m.timestamp),
                    })));
                }
            } catch (e) {
                console.error('Failed to load chat history:', e);
            }
        }
    }, []);

    /**
     * Save messages to localStorage
     */
    useEffect(() => {
        if (messages.length > 1) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages }));
        }
    }, [messages]);

    /**
     * Scroll to bottom when new messages arrive
     */
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    /**
     * Send a message
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

        // Simulate AI thinking
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Add AI response
        const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: getMockResponse(content),
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
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
        setMessages([
            {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Chat cleared! How can I help you with your startup?",
                timestamp: new Date(),
            },
        ]);
        localStorage.removeItem(STORAGE_KEY);
        toast.success('Chat cleared');
    };

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="w-7 h-7 text-[#EC4899]" />
                        AI Startup Mentor
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Your always-on startup advisor
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
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900)]'
                                        }`}
                                >
                                    <div className="whitespace-pre-line text-sm">
                                        {message.content}
                                    </div>
                                    <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                                        }`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                {message.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
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
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-gray-100 rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-[var(--color-gray-400)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-[var(--color-gray-400)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                                className="px-3 py-1.5 text-xs font-medium rounded-full bg-[var(--color-gray-100)] text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
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
                            placeholder="Ask me anything about your startup..."
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
