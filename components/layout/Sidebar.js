'use client';

import { LogOut, MessageSquare, Home, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useSidebar } from '@/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { isOpen, toggleSidebar } = useSidebar();
    const { user, logout } = useAuth();
    const isDarkMode = theme === 'dark';

    const navItems = [
        { label: 'Learning Assistant', icon: MessageSquare, href: '/assistant' }
    ];

    return (
        <aside className={`h-screen bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 flex flex-col transition-all duration-500 ease-in-out shadow-lg relative overflow-hidden flex-shrink-0 z-40 ${isOpen ? 'w-80' : 'w-20'
            }`}>
            {/* Sidebar Branding Area (Reusing Header styling as requested) */}
            <div className={`p-6 border-b border-gray-50 dark:border-gray-900 flex items-center ${isOpen ? 'justify-between' : 'justify-center'} min-w-0 transition-all duration-500`}>
                <div className="flex items-center space-x-3">
                    {/* DIAMOND ICON BRANDING */}
                    <div className={`flex-shrink-0 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-500 ${isOpen ? 'w-10 h-10' : 'w-10 h-10'
                        }`}>
                        <span className="text-white text-xl">💎</span>
                    </div>

                    {/* TEXT CONTENT (Visible when open) */}
                    {isOpen && (
                        <div className="flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 duration-500">
                            <h1 className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none whitespace-nowrap">
                                MF Research Tool
                            </h1>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest whitespace-nowrap">
                                    {user ? 'Learner' : 'Educational Mode'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* COLLAPSE BUTTON */}
                {isOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-400 flex-shrink-0"
                    >
                        <ChevronLeft size={16} />
                    </button>
                )}
            </div>

            {/* Navigation Routes */}
            <div className="px-3 py-6 flex-1 overflow-x-hidden">
                <nav className="space-y-1.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center rounded-2xl transition-all group relative ${isOpen ? 'px-4 py-2.5 space-x-3' : 'p-2.5 justify-center'
                                    } ${isActive
                                        ? 'bg-indigo-50/50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-gray-800/50'
                                    }`}
                                title={!isOpen ? item.label : ''}
                            >
                                <item.icon size={20} className={`flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-gray-300'}`} />
                                {isOpen && (
                                    <span className="text-base font-semibold tracking-tight leading-none whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Actions Area */}
            <div className={`p-4 border-t border-gray-100 dark:border-gray-800 space-y-2 transition-all duration-500 ${isOpen ? '' : 'flex flex-col items-center'}`}>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={`flex items-center rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-all group ${isOpen ? 'w-full px-4 py-2.5 space-x-3' : 'p-2.5 justify-center'
                        }`}
                    title={!isOpen ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : ''}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    {isOpen && (
                        <span className="text-base font-semibold tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
                            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    )}
                </button>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className={`flex items-center rounded-2xl text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group ${isOpen ? 'w-full px-4 py-2.5 space-x-3' : 'p-2.5 justify-center'
                        }`}
                    title={!isOpen ? 'Logout Session' : ''}
                >
                    <LogOut size={20} className="flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                    {isOpen && (
                        <span className="text-base font-semibold tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
                            Logout
                        </span>
                    )}
                </button>

                {/* Open Toggle (Visible when collapsed) */}
                {!isOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="mt-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-indigo-600 dark:text-indigo-400 animate-in fade-in zoom-in duration-500"
                    >
                        <ChevronRight size={18} />
                    </button>
                )}

                {/* Footer Copyright */}
                {isOpen && (
                    <div className="pt-2 text-center animate-in fade-in duration-700">
                        <p className="text-[8px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">
                            © 2026 MF Research
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
}
