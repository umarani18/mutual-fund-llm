'use client';

import { Plus, Trash2, Clock, MessageSquareOff, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const formatDate = (dateStr) => {
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    } catch (e) {
        return 'Unknown';
    }
};

export default function ChatHistory({ chatList, currentChatId, onSelectChat, onDeleteChat, onNewChat, onClearHistory, loading, onClose }) {
    return (
        <div className="h-full flex flex-col bg-card">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 hover:bg-accent flex items-center justify-center p-0"
                    >
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <span className="text-xs font-black uppercase tracking-widest text-foreground">
                        History
                    </span>
                </div>

            </div>

            {/* List */}
            <ScrollArea className="flex-1">
                <div className="p-3 space-y-1">
                    {chatList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center gap-2 opacity-30">
                            <MessageSquareOff className="h-8 w-8" />
                            <p className="text-[10px] font-black uppercase tracking-wider text-foreground">No history found</p>
                        </div>
                    ) : (
                        chatList.map((chat) => (
                            <div
                                key={chat.Timestamp}
                                onClick={() => onSelectChat(chat.Timestamp)}
                                className={cn(
                                    "group relative p-3 rounded-lg cursor-pointer transition-all border flex flex-col gap-2",
                                    currentChatId === chat.Timestamp
                                        ? "bg-secondary/50 border-primary/20"
                                        : "bg-transparent border-transparent hover:bg-muted/50 hover:border-border"
                                )}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <span className={cn(
                                        "text-xs font-black leading-tight truncate pr-2",
                                        currentChatId === chat.Timestamp ? "text-primary" : "text-foreground"
                                    )}>
                                        {chat.title || 'Untitled Session'}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                                        onClick={(e) => {
                                            if (e && e.stopPropagation) e.stopPropagation();
                                            onDeleteChat(chat.Timestamp);
                                        }}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3 text-muted-foreground/50" />
                                    <span className="text-[10px] font-medium text-muted-foreground/70 tracking-tight">
                                        {formatDate(chat.Timestamp)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
