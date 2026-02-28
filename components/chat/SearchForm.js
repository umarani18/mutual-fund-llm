'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useCompliance } from '@/context/ComplianceContext';
import { ShieldCheck, SendHorizonal, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ComplianceModal from '@/components/chat/ComplianceModal';

export default function SearchForm({ onSearch, loading }) {
    const [input, setInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        effectiveModules
    } = useCompliance();

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        onSearch(input.trim());
        setInput('');
    };

    return (
        <div className="w-full bg-background/80 backdrop-blur-sm border-t p-4 pb-6 relative z-40">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="relative bg-card border border-border/60 rounded-[28px] shadow-sm hover:shadow-md transition-all duration-300">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        placeholder="Ask anything about mutual funds..."
                        className="w-full px-6 py-5 min-h-[90px] max-h-48 resize-none bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/60 text-sm leading-relaxed"
                    />

                    {/* Bottom Actions Area */}
                    <div className="flex items-center justify-between px-3 pb-3">
                        <div className="flex items-center gap-2">
                            {/* Compliance Trigger */}
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className={cn(
                                    "flex items-center gap-2.5 bg-secondary/40 hover:bg-secondary/70 border border-border/30 rounded-full h-9 px-4 transition-all duration-200 group/pill shadow-sm"
                                )}
                            >
                                <div className="relative">
                                    <ShieldCheck className="h-4 w-4 text-primary/70 group-hover/pill:text-primary transition-colors" />
                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-wider text-foreground/80">
                                    Adaptive Compliance
                                </span>
                                <div className="h-4 w-[1px] bg-border/50 mx-0.5" />
                                <span className="text-[10px] font-bold text-primary">
                                    {effectiveModules.length} Rules
                                </span>
                                <Settings className="h-3 w-3 text-muted-foreground/60 group-hover/pill:rotate-45 transition-transform" />
                            </button>
                        </div>

                        <Button
                            type="submit"
                            size="icon"
                            disabled={loading || !input.trim()}
                            className="rounded-full w-9 h-9 shadow-md hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all bg-primary text-primary-foreground"
                        >
                            <SendHorizonal className="h-4 w-4" />
                        </Button>
                    </div>
                </form>

                {/* Pop-up Box in Center */}
                <ComplianceModal open={isModalOpen} onOpenChange={setIsModalOpen} />

                <div className="flex justify-center flex-col items-center gap-1 mt-3">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest text-center">
                        Institutional Intelligence Engine • Verified Deterministic Formulas
                    </p>
                </div>
            </div>
        </div>
    );
}
