'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    MessageSquare,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
    ShieldCheck
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from '@/context/ThemeContext';
import { useSidebar } from '@/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';

const navItems = [
    { label: 'Assistant', icon: MessageSquare, href: '/assistant' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { isOpen, toggleSidebar } = useSidebar();
    const { logout } = useAuth();
    const isDarkMode = theme === 'dark';

    return (
        <TooltipProvider delayDuration={0}>
            <aside className={cn(
                "h-screen bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col z-50",
                isOpen ? "w-64" : "w-[70px]"
            )}>
                {/* Header / Branding */}
                <div className="h-16 flex items-center px-4 border-b">
                    <div className={cn(
                        "flex items-center gap-3 overflow-hidden transition-all duration-300",
                        !isOpen && "justify-center w-full px-0"
                    )}>
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm">
                            <span className="text-primary-foreground font-black text-xs">MF</span>
                        </div>
                        {isOpen && (
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold tracking-tight truncate">Finchat</span>
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest whitespace-nowrap">
                                    Research Tool
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="flex-1 py-4 no-scrollbar overflow-y-auto">
                    <nav className="px-3 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link key={item.href} href={item.href} className="block group">
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start gap-3 h-10 px-3",
                                            !isOpen && "justify-center px-0 ring-0"
                                        )}
                                    >
                                        <Icon className={cn(
                                            "h-4 w-4 shrink-0",
                                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                        )} />
                                        {isOpen && (
                                            <span className="font-medium text-sm truncate">
                                                {item.label}
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Actions */}
                <div className="p-3 border-t space-y-1">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleTheme}
                        className={cn(
                            "w-full justify-start gap-3 h-10 px-3",
                            !isOpen && "justify-center px-0"
                        )}
                    >
                        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        {isOpen && <span className="font-medium text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
                    </Button>

                    {/* Logout */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className={cn(
                            "w-full justify-start gap-3 h-10 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                            !isOpen && "justify-center px-0"
                        )}
                    >
                        <LogOut className="h-4 w-4 group" />
                        {isOpen && <span className="font-medium text-sm">Sign Out</span>}
                    </Button>

                    <Separator className="my-2" />

                    {/* Collapse Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebar}
                        className={cn(
                            "w-full justify-start gap-3 h-10 px-3",
                            !isOpen && "justify-center px-0"
                        )}
                    >
                        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>

                </div>
            </aside>
        </TooltipProvider>
    );
}
