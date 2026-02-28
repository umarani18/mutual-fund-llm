'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Lock, ShieldCheck, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCompliance } from '@/context/ComplianceContext';

import { Badge } from "@/components/ui/badge";

export default function ComplianceModal({ open, onOpenChange }) {
    const {
        ALL_RULES,
        toggleRule,
        effectiveModules
    } = useCompliance();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-card border-border/60 rounded-[24px] overflow-hidden p-0 gap-0 shadow-2xl">
                <DialogHeader className="p-6 pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                                    Compliance Engine
                                </DialogTitle>
                                <DialogDescription className="text-[11px] font-medium text-muted-foreground mt-0.5">
                                    Institutional Deterministic Sandbox
                                </DialogDescription>
                            </div>
                        </div>
                        <Badge variant="outline" className="px-2.5 py-0.5 bg-primary/5 border-primary/20 text-primary font-bold text-[10px] rounded-full">
                            {effectiveModules.length}/17 Active
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="px-6 py-1">
                    <div className="bg-muted/30 border border-primary/5 rounded-xl p-3 mb-4 flex items-start gap-2.5">
                        <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                            <p className="text-[10px] font-medium leading-relaxed text-muted-foreground">
                                Safety modules (1, 4, 5, 7, 12, 16, 17) use hardcoded logic and cannot be disabled.
                            </p>
                            <p className="text-[10px] font-medium leading-relaxed text-primary/70 italic">
                                Note: Performance modules (8, 10, 11, 14, 15) are restricted for administrative review.
                            </p>
                        </div>
                    </div>

                    <ScrollArea className="h-[350px] pr-3 -mr-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-6">
                            {ALL_RULES.map((rule) => {
                                const isActive = effectiveModules.includes(rule.id);
                                const isRestricted = rule.restricted;
                                return (
                                    <button
                                        key={rule.id}
                                        type="button"
                                        disabled={rule.mandatory || isRestricted}
                                        onClick={() => toggleRule(rule.id)}
                                        className={cn(
                                            "flex items-start gap-3 p-3 rounded-xl transition-all text-left border group relative overflow-hidden",
                                            isActive
                                                ? "bg-primary/[0.03] border-primary/15 shadow-sm"
                                                : "hover:bg-secondary/40 border-transparent bg-muted/10",
                                            (rule.mandatory || isRestricted) && "cursor-not-allowed",
                                            isRestricted && "opacity-50 grayscale-[0.5]"
                                        )}
                                    >
                                        <div className={cn(
                                            "mt-0.5 flex items-center justify-center w-4 h-4 transition-all shrink-0",
                                            isActive ? "text-primary scale-110" : "text-muted-foreground/30",
                                            (rule.mandatory || isRestricted) && "text-muted-foreground/50",
                                            rule.mandatory && "text-primary/60"
                                        )}>
                                            {rule.mandatory || isRestricted ? (
                                                <Lock className="h-3.5 w-3.5" />
                                            ) : isActive ? (
                                                <Check className="h-4 w-4 stroke-[3px]" />
                                            ) : (
                                                <div className="h-3.5 w-3.5 rounded-sm border border-current opacity-50" />
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className={cn(
                                                    "text-[11px] font-bold tracking-tight truncate",
                                                    isActive ? "text-foreground" : "text-muted-foreground"
                                                )}>
                                                    #{rule.id} {rule.name}
                                                </span>
                                                {rule.mandatory && (
                                                    <span className="text-[8px] font-bold text-primary/60 bg-primary/10 px-1 py-0.5 rounded">Fixed</span>
                                                )}
                                                {isRestricted && (
                                                    <span className="text-[8px] font-bold text-muted-foreground bg-muted px-1 py-0.5 rounded">Restricted</span>
                                                )}
                                            </div>
                                            <span className="text-[9px] leading-snug text-muted-foreground/60 font-medium line-clamp-1">
                                                {rule.desc}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>

                <DialogFooter className="p-4 bg-muted/30 border-t border-border/50">
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="w-full sm:w-auto ml-auto rounded-full px-8 h-10 font-bold text-sm shadow-lg shadow-primary/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Apply Configuration
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
