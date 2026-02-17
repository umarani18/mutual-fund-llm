'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, ShieldCheck, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    // Famous investment quotes
    const quotes = [
        {
            text: "The individual investor should act consistently as an investor and not as a speculator.",
            author: "Ben Graham"
        },
        {
            text: "In investing, what is comfortable is rarely profitable.",
            author: "Robert Arnott"
        },
        {
            text: "The four most dangerous words in investing are: 'this time it's different.'",
            author: "Sir John Templeton"
        }
    ];

    // Rotate quotes every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [quotes.length]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setError("Password must contain at least one uppercase letter");
            return;
        }
        if (!/[a-z]/.test(password)) {
            setError("Password must contain at least one lowercase letter");
            return;
        }
        if (!/[0-9]/.test(password)) {
            setError("Password must contain at least one digit");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await authApi.signup({
                fullname: name,
                email,
                password,
                confirm_password: confirmPassword
            });

            // After signup, we might want to auto-login or redirect to login
            // The backend returns the user object on successful signup.
            // Let's redirect to login for now as per the message in backend
            alert(response.message || "Account created successfully! Please login.");
            router.push('/login');
        } catch (err) {
            setError(err.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-background flex flex-col lg:flex-row overflow-hidden font-sans">

            {/* Left Section - Branding/Visual (Primary Background) */}
            <div className="hidden lg:flex flex-col w-[45%] bg-primary p-10 justify-between relative overflow-hidden text-primary-foreground h-full">
                {/* Animated Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-foreground/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }}></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-foreground/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
                    <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] bg-primary-foreground/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center space-x-3 mb-16">
                        <div className="w-12 h-12 bg-primary-foreground/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-primary-foreground/20 hover:scale-110 transition-transform duration-300">
                            <span className="text-primary-foreground font-black text-lg">MF</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">MF Research Tool</h1>
                    </div>

                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                        <h2 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                            Start your <br />
                            <span className="text-primary-foreground/80 italic">Learning Journey.</span>
                        </h2>
                        <p className="text-primary-foreground/70 text-lg font-medium leading-relaxed max-w-sm">
                            Join our educational platform to learn about mutual fund concepts and AI-driven analysis.
                        </p>
                        {/* Rotating Inspirational Quotes */}
                        <div className="mt-12 pt-8 border-t border-primary-foreground/20 animate-in fade-in duration-1000 delay-300">
                            <div className="relative group">
                                <svg className="absolute -top-2 -left-2 w-8 h-8 text-primary-foreground/20 group-hover:text-primary-foreground/30 transition-colors duration-300" fill="currentColor" viewBox="0 0 32 32">
                                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z" />
                                </svg>
                                <blockquote className="pl-6 relative">
                                    {/* Quote Text with Fade Transition */}
                                    <div className="relative h-32 overflow-hidden">
                                        {quotes.map((quote, index) => (
                                            <div
                                                key={index}
                                                className={`absolute inset-0 transition-all duration-700 ${index === currentQuoteIndex
                                                    ? 'opacity-100 translate-y-0'
                                                    : index < currentQuoteIndex
                                                        ? 'opacity-0 -translate-y-4'
                                                        : 'opacity-0 translate-y-4'
                                                    }`}
                                            >
                                                <p className="text-primary-foreground/90 text-lg font-medium italic leading-relaxed">
                                                    "{quote.text}"
                                                </p>
                                                <footer className="mt-4 text-primary-foreground/60 text-sm font-semibold">
                                                    — {quote.author}
                                                </footer>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Quote Navigation Dots */}
                                    {/* <div className="flex items-center gap-2 mt-6">
                                        {quotes.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentQuoteIndex(index)}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentQuoteIndex
                                                    ? 'w-8 bg-primary-foreground/60'
                                                    : 'w-1.5 bg-primary-foreground/20 hover:bg-primary-foreground/40'
                                                    }`}
                                                aria-label={`View quote ${index + 1}`}
                                            />
                                        ))}
                                    </div> */}
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                    <div className="flex items-center space-x-3 p-3 bg-primary-foreground/10 backdrop-blur-md rounded-2xl border border-primary-foreground/10 w-fit hover:bg-primary-foreground/15 transition-all duration-300 hover:scale-105">
                        <div className="p-2 bg-primary-foreground/20 rounded-xl shadow-lg border border-primary-foreground/10">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-primary-foreground">Educational Simulator</p>
                            <p className="text-[9px] text-primary-foreground/60 font-bold uppercase tracking-tighter">Learning purpose only</p>
                        </div>
                    </div>
                    <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-primary-foreground/50">© 2026 MF RESEARCH TOOL</p>
                </div>
            </div>

            {/* Right Section - Signup Form */}
            <div className="flex-1 bg-background flex items-center justify-center p-6 lg:p-10 relative h-full overflow-hidden">
                <div className="w-full max-w-xl animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="mb-8 lg:text-left text-center">
                        <h3 className="text-4xl font-black text-foreground tracking-tight leading-none">Create Account</h3>
                        <p className="text-muted-foreground text-sm font-medium pt-2">Join the platform to start learning today.</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-bold animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-muted/50 border border-border rounded-2xl text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-medium placeholder-muted-foreground/50 hover:border-primary/30 hover:bg-muted/70"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-muted/50 border border-border rounded-2xl text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-medium placeholder-muted-foreground/50 hover:border-primary/30 hover:bg-muted/70"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-11 py-3.5 bg-muted/50 border border-border rounded-2xl text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-medium placeholder-muted-foreground/50 sm:text-base hover:border-primary/30 hover:bg-muted/70"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                        <RotateCcw size={18} />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-11 pr-11 py-3.5 bg-muted/50 border border-border rounded-2xl text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all font-medium placeholder-muted-foreground/50 sm:text-base hover:border-primary/30 hover:bg-muted/70"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-2xl shadow-xl shadow-primary/10 transition-all flex items-center justify-center space-x-2 group active:scale-[0.98] disabled:opacity-70 mt-4 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span className="uppercase tracking-widest text-[11px]">Create Free Account</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-muted-foreground text-[12px] font-bold">
                        Already have an account? <Link href="/login" className="text-primary hover:underline font-black hover:text-primary/80 transition-colors">Log in here</Link>
                    </p>

                    <div className="mt-12 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-widest text-center mb-1">Important Notice</p>
                        <p className="text-[10px] text-amber-700 dark:text-amber-400/70 font-medium text-center leading-relaxed">
                            This platform is strictly an educational research tool. We do not provide investment advice or financial services. Mutual fund data is for learning and simulation purposes only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
