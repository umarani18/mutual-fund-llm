'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function SearchForm({ onSearch, loading }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        onSearch(input.trim());
        setInput('');
    };

    return (
        <div className="bg-transparent p-3 pb-4 md:pb-6 transition-colors duration-300">
            <div className="max-w-3xl mx-auto relative">
                <form onSubmit={handleSubmit} className="relative group">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        placeholder="Ask about mutual fund concepts..."
                        className="w-full p-3 pr-14 bg-transparent border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 min-h-[56px] max-h-48 resize-none transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 font-medium text-sm"
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className={`absolute right-2 top-7 -translate-y-1/2 p-2.5 rounded-xl transition-all ${input.trim() && !loading
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-105 active:scale-95'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        <Send size={18} />
                    </button>
                </form>
                <p className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 text-center font-semibold tracking-tight px-4 font-sans">
                    MF Research learning tool. This is for educational research only. Not investment advice.
                </p>
            </div>
        </div>
    );
}
