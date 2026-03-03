'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ComplianceModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if shown in this session
        const hasAccepted = sessionStorage.getItem('disclaimerAccepted');
        if (!hasAccepted) {
            setIsOpen(true);
        }
    }, []);

    const handleAccept = () => {
        sessionStorage.setItem('disclaimerAccepted', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="w-full max-w-lg bg-card border border-border shadow-2xl rounded-3xl overflow-hidden relative"
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>

                    <div className="p-8 md:p-10 space-y-8">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center shadow-inner mb-2">
                                <ShieldCheck className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black tracking-tight text-foreground">
                                    Research & Analytics <br />
                                    <span className="text-primary italic">Sandbox Mode</span>
                                </h2>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">Educational Disclaimer</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 bg-muted/30 p-6 rounded-2xl border border-border/50">
                            <p className="text-sm font-bold text-foreground leading-relaxed">
                                Please acknowledge that this is a <span className="text-primary font-black">strictly educational tool</span> designed for financial research and simulated pattern learning.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "No Investment Advice provided.",
                                    "Not a SEBI Registered Advisor.",
                                    "Simulated Data for learning only.",
                                    "Educational Research purpose only."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-2">
                            <Button
                                onClick={handleAccept}
                                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group transition-all text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98]"
                            >
                                I Understand & Agree
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground/60 mt-4 font-bold uppercase tracking-tighter">
                                Access entails agreement to our Research Sandbox protocols.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
