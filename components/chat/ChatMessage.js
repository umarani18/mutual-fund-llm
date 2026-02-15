'use client';

import RecommendationsList from '@/components/chat/RecommendationsList';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function ChatMessage({ message }) {
    const isAssistant = message.role === 'assistant';

    return (
        <div className={cn(
            "flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
            isAssistant ? "justify-start" : "justify-end"
        )}>
            <div className={cn(
                "flex items-start max-w-[90%] md:max-w-[80%] gap-4",
                isAssistant ? "flex-row" : "flex-row-reverse"
            )}>
                {/* Avatar */}
                <Avatar className={cn(
                    "w-9 h-9 border shadow-sm",
                    isAssistant ? "border-primary/20" : "border-border"
                )}>
                    <AvatarFallback className={cn(
                        "text-[10px] font-black uppercase tracking-tighter",
                        isAssistant ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                        {isAssistant ? "AI" : "U"}
                    </AvatarFallback>
                    {isAssistant && <AvatarImage src="/ai-avatar.png" />}
                </Avatar>

                {/* Message Content */}
                <div className={cn(
                    "flex flex-col gap-1.5",
                    isAssistant ? "items-start" : "items-end"
                )}>
                    <div className="flex items-center gap-2 px-1">
                        <span className={cn(
                            "text-[11px] font-black uppercase tracking-tight",
                            isAssistant ? "text-primary" : "text-muted-foreground"
                        )}>
                            {isAssistant ? 'Mutual Fund Research AI' : 'You'}
                        </span>
                        {isAssistant && (
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                        )}
                    </div>

                    <div className={cn(
                        "relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm border transition-all",
                        isAssistant
                            ? "bg-card text-card-foreground rounded-tl-none border-border/60"
                            : "bg-primary text-primary-foreground rounded-tr-none border-transparent"
                    )}>
                        <div className="whitespace-pre-wrap font-medium">
                            {message.content}
                        </div>

                        {isAssistant && message.type === 'quant_analysis' && (
                            <div className="mt-3 pt-3 border-t border-border">
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="text-sm">📈</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Quantum Analytics Result</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">
                                    Processed by Deterministic Financial Engine
                                </p>
                            </div>
                        )}
                    </div>

                    {isAssistant && message.recommendations && message.recommendations.length > 0 && (
                        <div className="w-full mt-6 space-y-4 animate-in fade-in duration-700 slide-in-from-bottom-3">
                            <div className="flex items-center gap-4 px-2">
                                <div className="h-[1px] flex-grow bg-primary/20"></div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] whitespace-nowrap">
                                    Strategic Selections
                                </span>
                                <div className="h-[1px] flex-grow bg-primary/20"></div>
                            </div>

                            <RecommendationsList recommendations={message.recommendations} />

                            <div className="flex justify-center">
                                <div className="px-3 py-1 bg-muted/50 rounded-full border border-border">
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                                        Verified Fund Data • Educational Simulation
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
