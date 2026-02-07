'use client';

import { useChat } from '@/hooks/useChat';
import ChatMessage from '@/components/chat/ChatMessage';
import SearchForm from '@/components/chat/SearchForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Sidebar from '@/components/layout/Sidebar';
import ChatHistory from '@/components/chat/ChatHistory';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { History, ChevronRight } from 'lucide-react';

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
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-950 space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="font-black uppercase tracking-widest text-indigo-600 animate-pulse text-xs">Initializing Analytical Engine...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
            {/* Left Sidebar Layout */}
            <Sidebar />

            {/* Right Main Chat Interface */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent relative">
                {/* Open History Button (Visible when closed) */}
                {!showHistory && (
                    <button
                        onClick={() => setShowHistory(true)}
                        className="absolute top-6 right-6 z-30 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 text-gray-500 hover:text-indigo-600 shadow-xl backdrop-blur-md animate-in fade-in zoom-in duration-300"
                        title="Show History"
                    >
                        <History size={18} />
                    </button>
                )}

                {/* Chat History Area */}
                <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 md:px-0 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent bg-transparent">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-full">
                                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
                                        <span className="text-3xl">✨</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-xl font-sans font-semibold text-gray-900 dark:text-white tracking-tight leading-tight text-center">
                                        Expert AI <br />
                                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Analytical Engine</span>
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto leading-relaxed font-medium">
                                        Input your financial parameters to generate a risk-adjusted portfolio strategy.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-6">
                                    {[
                                        "Safe funds for 1 year with low risk",
                                        "High growth equity funds for 20 years",
                                        "Balanced funds for child's education",
                                        "Investing 10k monthly for wealth creation"
                                    ].map((suggested, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => sendMessage(suggested)}
                                            className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-left text-sm font-semibold tracking-tight text-gray-600 dark:text-gray-400 hover:border-indigo-400 dark:hover:border-indigo-500/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 hover:shadow-md transition-all group"
                                        >
                                            <span className="flex items-center space-x-3">
                                                <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 p-1.5 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">💡</span>
                                                <span className="truncate">{suggested}</span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, index) => (
                                    <ChatMessage key={index} message={msg} />
                                ))}
                                {chatLoading && (
                                    <div className="flex justify-start animate-in fade-in duration-300">
                                        <div className="bg-transparent p-4 flex items-center space-x-3">
                                            <LoadingSpinner size="small" />
                                            <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-tight italic">Analyzing data...</span>
                                        </div>
                                    </div>
                                )}
                                {error && (
                                    <div className="p-3 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 rounded-r-xl text-red-700 dark:text-red-400 text-xs font-semibold tracking-tight shadow-sm max-w-lg mx-auto">
                                        <span className="flex items-center space-x-2">
                                            <span>⚠️</span>
                                            <span>{error}</span>
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Bottom Input Section */}
                <div className="bg-transparent mt-auto">
                    <SearchForm onSearch={sendMessage} loading={chatLoading} />
                </div>
            </div>

            {/* Right Side Chat History with Triangular Close Handle */}
            <div className={`relative transition-all duration-500 ease-in-out h-full border-l border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 ${showHistory ? 'w-80 opacity-100' : 'w-0 opacity-0'
                }`}>

                {/* Triangular Close Handle (Visible when open) */}
                {showHistory && (
                    <button
                        onClick={() => setShowHistory(false)}
                        className="absolute top-1/2 -left-3 transform -translate-y-1/2 z-40 group"
                        title="Hide History"
                    >
                        <div className="w-3 h-12 bg-gray-100 dark:bg-gray-800 border-l border-y border-gray-200 dark:border-gray-700 rounded-l-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                            <ChevronRight size={10} className="text-gray-400 group-hover:text-indigo-500" />
                        </div>
                    </button>
                )}

                <div className="w-80 h-full">
                    <ChatHistory
                        chatList={chatList}
                        currentChatId={currentChatId}
                        onSelectChat={loadChat}
                        onDeleteChat={deleteChat}
                        onNewChat={startNewChat}
                        onClearHistory={clearAllHistory}
                        loading={historyLoading}
                    />
                </div>
            </div>
        </div>
    );
}
