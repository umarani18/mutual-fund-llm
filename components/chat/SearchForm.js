'use client';

import { useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SearchForm({ onSearch, loading }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        onSearch(input.trim());
        setInput('');
    };

    return (
        <div className="w-full bg-background/80 backdrop-blur-sm border-t p-4 pb-6">
            <div className="max-w-3xl mx-auto space-y-3">
                <form onSubmit={handleSubmit} className="relative">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        placeholder="Ask about mutual funds, risk analytics, or fund selection rules..."
                        className="pr-12 min-h-[60px] max-h-48 resize-none bg-card border-border/60 focus-visible:ring-primary/20 rounded-xl"
                        rows={1}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg"
                    >
                        <SendHorizonal className="h-4 w-4" />
                    </Button>
                </form>
                <div className="flex justify-center flex-col items-center gap-1">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest text-center">
                         AI can make mistakes. Consider verifying important information with a professional financial advisor.
                    </p>
                </div>
            </div>
        </div>
    );
}
