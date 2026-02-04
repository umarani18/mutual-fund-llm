'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://i5qohtp440.execute-api.ap-south-1.amazonaws.com';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userPrompt = input.trim();
    setInput('');
    setError('');

    // Add user message to state
    const newUserMessage = { role: 'user', content: userPrompt };
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const targetUrl = 'https://i5qohtp440.execute-api.ap-south-1.amazonaws.com/predict';
      console.log('Fetching from:', targetUrl);

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await response.json();

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
      setError('Error connecting to backend. Please try again.');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: err.message
      }]);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f9fafb]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
            <span className="text-white text-xl">💎</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">FinChat AI</h1>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Expert Advisor Online</p>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
            History
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all active:scale-95">
            New Session
          </button>
        </div>
      </header>

      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6 md:px-0 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="p-4 bg-indigo-50 rounded-full">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                  <span className="text-4xl">👋</span>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                  How can I help you <br />
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent italic">invest better?</span>
                </h2>
                <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                  I'm your personal AI mutual fund expert. Describe your goals, risk tolerance, and time horizon.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                {[
                  "Safe funds for 1 year with low risk",
                  "High growth equity funds for 20 years",
                  "Balanced funds for child's education",
                  "Investing 10k monthly for wealth creation"
                ].map((suggested, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(suggested);
                    }}
                    className="p-4 bg-white border border-gray-200 rounded-xl text-left text-sm font-medium text-gray-700 hover:border-indigo-400 hover:bg-indigo-50/50 hover:shadow-md transition-all group"
                  >
                    <span className="flex items-center space-x-3">
                      <span className="text-indigo-600 bg-indigo-50 p-2 rounded-lg group-hover:bg-indigo-100 transition-colors">💡</span>
                      <span>{suggested}</span>
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
              {loading && (
                <div className="flex justify-start animate-in fade-in duration-300">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <LoadingSpinner size="small" />
                    <span className="text-sm text-gray-500 font-medium italic">FinChat is analyzing...</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-medium shadow-sm max-w-lg mx-auto">
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

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 pb-8 md:pb-12 shadow-[0_-4px_20px_0_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto relative">
          <form onSubmit={handleSendMessage} className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask me anything about mutual funds..."
              className="w-full p-4 pr-16 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[64px] max-h-48 resize-none shadow-sm transition-all text-gray-800 placeholder-gray-400"
              rows={1}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`absolute right-3 bottom-3 p-3 rounded-xl transition-all ${input.trim() && !loading
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
          <p className="mt-3 text-[10px] text-gray-400 text-center font-medium uppercase tracking-widest px-4">
            FinChat AI can make mistakes. Always verify with a financial professional.
          </p>
        </div>
      </div>
    </div>
  );
}
