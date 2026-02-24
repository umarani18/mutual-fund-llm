'use client';

import { useState, useRef, useEffect } from 'react';
import { chatApi } from '@/lib/api';
import { useCompliance } from '@/context/ComplianceContext';

export const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentChatId, setCurrentChatId] = useState(null);
    const [chatList, setChatList] = useState([]);
    const { selectedStack } = useCompliance();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    useEffect(() => {
        loadChatHistory();
    }, []);

    // Auto-restore removed to force new session on refresh


    const loadChatHistory = async () => {
        try {
            const data = await chatApi.getHistory();
            if (data.status === 'success') {
                setChatList(data.chats);
            }
        } catch (err) {
            console.error('Failed to load chat history:', err);
        }
    };

    const startNewChat = async (title = "New Chat") => {
        try {
            setLoading(true);
            const data = await chatApi.createChat(title);
            if (data.status === 'success') {
                setCurrentChatId(data.chat.Timestamp);
                setMessages([]);
                setChatList(prev => [data.chat, ...prev]);
            }
        } catch (err) {
            setError('Failed to create new chat');
        } finally {
            setLoading(false);
        }
    };

    const loadChat = async (timestamp) => {
        try {
            setHistoryLoading(true);
            setCurrentChatId(timestamp);
            const data = await chatApi.getChatMessages(timestamp);
            if (data.status === 'success') {
                setMessages(data.chat.messages || []);
            }
        } catch (err) {
            setError('Failed to load chat messages');
        } finally {
            setHistoryLoading(false);
        }
    };

    const deleteChat = async (timestamp) => {
        if (!window.confirm("Delete this specific chat session?")) return;

        try {
            await chatApi.deleteChat(timestamp);
            setChatList(prev => prev.filter(c => c.Timestamp !== timestamp));
            if (currentChatId === timestamp) {
                setCurrentChatId(null);
                setMessages([]);
            }
        } catch (err) {
            console.error('Failed to delete chat:', err);
            setError('Failed to delete chat');
        }
    };

    const clearAllHistory = async () => {
        if (!window.confirm("Are you sure you want to delete your entire chat history? This cannot be undone.")) {
            return;
        }
        try {
            await chatApi.deleteAllHistory();
            setChatList([]);
            setCurrentChatId(null);
            setMessages([]);
        } catch (err) {
            console.error('Failed to clear ALL history:', err);
            setError('Failed to clear entire history');
        }
    };

    const sendMessage = async (prompt) => {
        if (!prompt.trim() || loading) return;

        const userPrompt = prompt.trim();
        setError('');

        const newUserMessage = { role: 'user', content: userPrompt };
        setMessages(prev => [...prev, newUserMessage]);
        setLoading(true);

        try {
            let chatId = currentChatId;
            // If no active chat, create one automatically
            if (!chatId) {
                const data = await chatApi.createChat(userPrompt.substring(0, 30) + "...");
                if (data.status === 'success') {
                    chatId = data.chat.Timestamp;
                    setCurrentChatId(chatId);
                    setChatList(prev => {
                        // Avoid duplicates
                        if (prev.some(c => c.Timestamp === chatId)) return prev;
                        return [data.chat, ...prev];
                    });
                }
            }

            const data = await chatApi.sendMessage(userPrompt, chatId, selectedStack.modules);
            console.log('📡 [DEBUG] Backend Response Received:', data);

            if (data.status === 'success') {
                const aiMessage = {
                    role: 'assistant',
                    content: data.chat_response || "I've analyzed your requirements and found some great options for you.",
                    recommendations: data.recommendations || []
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                setError(data.detail || 'Failed to generate recommendations');
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error while processing your request. Please try again.'
                }]);
            }
        } catch (err) {
            setError(err.message || 'Error connecting to backend. Please try again.');
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: err.message || 'Connection failed'
            }]);
            console.error('Chat Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
        setError('');
    };

    // Persistence removed to ensure refresh starts new session


    return {
        messages,
        loading,
        historyLoading,
        error,
        chatList,
        currentChatId,
        sendMessage,
        clearChat,
        startNewChat,
        loadChat,
        deleteChat,
        clearAllHistory,
        messagesEndRef
    };
};
