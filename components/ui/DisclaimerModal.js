'use client';

import { ShieldAlert, AlertTriangle, X } from 'lucide-react';

export default function DisclaimerModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">

                {/* Header with Icon */}
                <div className="p-8 pb-4 text-center">
                    <div className="mx-auto w-16 h-16 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-100 dark:border-amber-500/20">
                        <ShieldAlert className="text-amber-600 dark:text-amber-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Important Disclaimer</h2>
                </div>

                {/* Content */}
                <div className="px-8 pb-8 text-center space-y-6">
                    <div className="space-y-4">
                        <p className="text-gray-900 dark:text-white font-black text-lg leading-tight uppercase tracking-tight">
                            Educational Research Tool
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                            This is an educational research tool. Not personalised investment advice. We are not SEBI
                            registered. Mutual fund investments are subject to market risks. Read all scheme-related
                            documents carefully.
                        </p>
                    </div>
                </div>

                {/* Action Button */}
                <div className="p-6 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={onClose}
                        className="w-full bg-[#5c3ce6] hover:bg-[#4a2fd1] text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center space-x-2 group active:scale-[0.98]"
                    >
                        <span className="uppercase tracking-widest text-[11px]">I Understand & Continue</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
