'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useCompliance } from '@/context/ComplianceContext';
import { ChevronDown, ShieldCheck, SendHorizonal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SearchForm({ onSearch, loading }) {
    const [input, setInput] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { selectedStack, changeStack, COMPLIANCE_STACKS } = useCompliance();

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        onSearch(input.trim());
        setInput('');
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMenuOpen && !event.target.closest('.compliance-dropdown')) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

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
                        placeholder="Ask anything"
                        className="w-full px-6 py-5 min-h-[90px] max-h-48 resize-none bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/60 text-sm leading-relaxed"
                    />

                    {/* Bottom Actions Area */}
                    <div className="flex items-center justify-between px-3 pb-3">
                        <div className="flex items-center gap-2">
                            {/* Custom Compliance Selector Dropdown */}
                            <div className="relative compliance-dropdown">
                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className={cn(
                                        "flex items-center gap-2.5 bg-secondary/40 hover:bg-secondary/70 border rounded-full h-9 px-4 transition-all duration-200 group/pill",
                                        isMenuOpen ? "border-primary/40 bg-secondary/80 shadow-sm" : "border-border/30"
                                    )}
                                >
                                    <ShieldCheck className={cn(
                                        "h-4 w-4 transition-colors",
                                        isMenuOpen ? "text-primary" : "text-primary/70 group-hover/pill:text-primary"
                                    )} />
                                    <span className="text-[11px] font-black uppercase tracking-wider text-foreground/80">
                                        {selectedStack.label}
                                    </span>
                                    <ChevronDown className={cn(
                                        "h-3 w-3 text-muted-foreground transition-transform duration-200",
                                        isMenuOpen && "rotate-180"
                                    )} />
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute bottom-full left-0 mb-2 w-56 bg-card border border-border shadow-xl rounded-2xl p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                        <div className="px-2 py-1.5 mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                                                Compliance Level
                                            </span>
                                        </div>
                                        {Object.values(COMPLIANCE_STACKS).map((s) => (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => {
                                                    changeStack(s.id);
                                                    setIsMenuOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all text-left group/item",
                                                    selectedStack.id === s.id
                                                        ? "bg-primary/10 text-primary"
                                                        : "hover:bg-secondary text-foreground/70 hover:text-foreground"
                                                )}
                                            >
                                                <div className={cn(
                                                    "mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 transition-all",
                                                    selectedStack.id === s.id ? "bg-primary scale-125" : "bg-transparent group-hover/item:bg-muted-foreground/30"
                                                )} />
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-bold leading-none">{s.label}</span>
                                                    <span className="text-[10px] leading-tight text-muted-foreground/60 font-medium">
                                                        {s.description || 'Standard filtering applied'}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
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
                <div className="flex justify-center flex-col items-center gap-1">
                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest text-center">
                        AI can make mistakes. Consider verifying important information with a professional financial advisor.
                    </p>
                </div>
            </div>
        </div>
    );
}
