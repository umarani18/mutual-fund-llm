'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, FileText, Search, CheckCircle2, ChevronRight, Info, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecommendationsList({ recommendations }) {
    const router = useRouter();
    const [expandedId, setExpandedId] = useState(null);
    const [loadingId, setLoadingId] = useState(null);

    const handleViewDetails = (fundCode) => {
        setLoadingId(fundCode);
        router.push(`/assistant/${fundCode}/details`);
    };

    const getRiskColors = (level) => {
        switch (level?.toLowerCase()) {
            case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'moderately low': return 'bg-teal-100 text-teal-700 border-teal-200';
            case 'moderate': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'moderately high': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'high': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'very high': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getCategoryIcon = (category) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('equity')) return <TrendingUp className="w-4 h-4 text-blue-600" />;
        if (cat.includes('debt')) return <FileText className="w-4 h-4 text-emerald-600" />;
        if (cat.includes('hybrid')) return <Search className="w-4 h-4 text-indigo-600" />;
        return <Info className="w-4 h-4 text-muted-foreground" />;
    };

    return (
        <div className="grid grid-cols-1 gap-4 w-full">
            {recommendations.map((rec, index) => {
                const isExpanded = expandedId === rec.rank; // Use rank or scheme_code as unique ID

                return (
                    <Card
                        key={rec.rank || index} // Fallback key
                        className={cn(
                            "group relative overflow-hidden transition-all duration-300 border-border/60 hover:border-primary/30 hover:shadow-lg",
                            isExpanded ? "ring-2 ring-primary/5 shadow-xl bg-card" : "bg-card/50"
                        )}
                    >
                        <CardHeader className="p-5 pb-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-3.5 min-w-0 flex-1">
                                    <div className="mt-1 w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                        {getCategoryIcon(rec.category)}
                                    </div>
                                    <div className="space-y-1.5 min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <h3 className="font-bold text-base leading-tight tracking-tight text-foreground line-clamp-2" title={rec.fund_name}>
                                                {rec.fund_name}
                                            </h3>
                                            <div className="flex flex-col items-end shrink-0">
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        "font-bold font-mono text-xs px-2 h-6 border",
                                                        rec.suitability_score >= 80
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                            : "bg-amber-50 text-amber-700 border-amber-200"
                                                    )}
                                                >
                                                    {rec.suitability_score?.toFixed(0)}% Match
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="outline" className={cn("text-[10px] uppercase font-bold px-2 py-0.5 border h-5", getRiskColors(rec.risk_level))}>
                                                {rec.risk_level} Risk
                                            </Badge>
                                            <Badge variant="secondary" className="text-[10px] uppercase font-bold px-2 py-0.5 h-5 bg-muted/60 text-muted-foreground border-border/50">
                                                {rec.category}
                                            </Badge>
                                            {rec.rank && (
                                                <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider uppercase ml-1">
                                                    #{rec.rank}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-5 pt-2">
                            <div className="space-y-4">
                                {!isExpanded ? (
                                    <div className="flex items-end justify-between gap-3">
                                        {rec.reason ? (
                                            <div className="relative">
                                                <p className="text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed font-medium">
                                                    {rec.reason}
                                                </p>
                                                <div className="absolute bottom-0 right-0 bg-gradient-to-l from-card via-card/80 to-transparent w-8 h-5" />
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground italic">View investment analysis...</span>
                                        )}

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setExpandedId(rec.rank)}
                                            className="shrink-0 h-8 w-8 text-primary/70 hover:text-primary hover:bg-primary/10 rounded-full"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-5 animate-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-2">
                                            {/* Header for expanded view */}
                                            <div className="pb-2 border-b border-border/40 flex items-center justify-between">
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                                    Suitability Analysis
                                                </h4>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setExpandedId(null)}
                                                    className="h-6 w-6 -mr-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                    title="Close Analysis"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                                                {rec.reason}
                                            </p>
                                        </div>

                                        {rec.key_highlights && rec.key_highlights.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {rec.key_highlights.map((highlight, i) => (
                                                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/30 border border-border/40 group-hover:border-primary/10 transition-colors">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 shadow-[0_0_4px_rgba(37,99,235,0.4)]" />
                                                        <span className="text-xs font-medium text-muted-foreground/90 leading-snug">
                                                            {highlight}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-end pt-2">

                                            <Button
                                                size="sm"
                                                className="h-9 px-5 text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20 gap-2 min-w-[140px]"
                                                disabled={loadingId === rec.fund_code}
                                                onClick={() => handleViewDetails(rec.fund_code)}
                                            >
                                                {loadingId === rec.fund_code ? (
                                                    <>
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        Fetching Details...
                                                    </>
                                                ) : (
                                                    <>
                                                        View Details <ChevronRight className="w-3.5 h-3.5" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
