'use client';

import { useChat } from '@/hooks/useChat';
import ChatMessage from '@/components/chat/ChatMessage';
import SearchForm from '@/components/chat/SearchForm';
import Sidebar from '@/components/layout/Sidebar';
import ChatHistory from '@/components/chat/ChatHistory';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { History, Sparkles, AlertCircle, Plus } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function AssistantPage() {
    const {
        messages,
        loading: chatLoading,
        historyLoading,
        error,
        chatList,
        currentChatId,
        sendMessage,
        startNewChat,
        loadChat,
        deleteChat,
        clearAllHistory,
        messagesEndRef
    } = useChat();

    const [showHistory, setShowHistory] = useState(true);
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    if (authLoading || !isAuthenticated) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="font-bold text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
                    Authenticating Session...
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Navigation Sidebar */}
            <Sidebar />

            {/* Main Application Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Fixed Top Header (Breadcrumb style) */}
                <header className="h-16 flex items-center justify-between px-6 border-b bg-background/50 backdrop-blur-md z-30">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-tight">AI Assistant</span>
                        <div className="h-1 w-1 rounded-full bg-border"></div>
                        <span className="text-xs text-muted-foreground font-medium">Research Sandbox</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startNewChat()}
                            className="hidden md:flex gap-2 h-9"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="text-xs font-semibold">New Chat</span>
                        </Button>

                        {!showHistory && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowHistory(true)}
                                className="h-9 w-9 transition-colors"
                            >
                                <History className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </header>

                {/* Chat Scroll Area */}
                <ScrollArea className="flex-1 px-4 md:px-6">
                    <div className="max-w-4xl mx-auto py-8">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                                    <Sparkles className="w-7 h-7 text-primary" />
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-2xl font-black text-primary tracking-tight">
                                        Advanced Mutual Fund Analytics
                                    </h2>
                                    <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed font-medium">
                                        Exploration framework for fund selection rules, risk metrics, and suitability analysis.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                                    {[
                                        "Top 3 Small Cap funds",
                                        "Balanced Advantage funds for 5 year SIP",
                                        "Compare Index Funds vs Active Large Cap",
                                        "Suggest a portfolio for aggressive growth"
                                    ].map((suggested, idx) => (
                                        <Button
                                            key={idx}
                                            variant="outline"
                                            onClick={() => sendMessage(suggested)}
                                            className="h-auto p-4 justify-start text-left border-border/60 hover:border-primary/50 hover:bg-primary/5 group"
                                        >
                                            <div className="flex flex-col gap-1 overflow-hidden">
                                                <span className="text-sm text-muted-foreground truncate group-hover:text-foreground transition-colors">
                                                    {suggested}
                                                </span>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {messages.map((msg, index) => (
                                    <ChatMessage key={index} message={msg} />
                                ))}
                                {chatLoading && (
                                    <div className="flex gap-4 p-4 animate-pulse">
                                        <Skeleton className="w-9 h-9 rounded-full" />
                                        <div className="flex flex-col gap-2 pt-2">
                                            <Skeleton className="h-4 w-48" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </div>
                                )}
                                {error && (
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold max-w-md mx-auto">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                </ScrollArea>

                {/* Lower Input Section */}
                <div className="z-30">
                    <SearchForm onSearch={sendMessage} loading={chatLoading} />
                </div>
            </main>

            {/* Chat History Panel */}
            <aside className={cn(
                "hidden xl:block border-l bg-card transition-all duration-300 overflow-hidden",
                showHistory ? "w-80" : "w-0"
            )}>
                <ChatHistory
                    chatList={chatList}
                    currentChatId={currentChatId}
                    onSelectChat={loadChat}
                    onDeleteChat={deleteChat}
                    onNewChat={startNewChat}
                    onClearHistory={clearAllHistory}
                    loading={historyLoading}
                    onClose={() => setShowHistory(false)}
                />
            </aside>
        </div>
    );
}
