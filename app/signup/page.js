'use client';

import { useState } from 'react';
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

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

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
        <div className="h-screen bg-white dark:bg-gray-950 flex flex-col lg:flex-row overflow-hidden font-sans">

            {/* Left Section - Branding/Visual (Violet Background) */}
            <div className="hidden lg:flex flex-col w-[45%] bg-[#5c3ce6] p-10 justify-between relative overflow-hidden text-white h-full">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-400/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-16">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                            <span className="text-2xl">💎</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">FinChat AI</h1>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                            Start your <br />
                            <span className="text-indigo-200 italic">Investment Journey.</span>
                        </h2>
                        <p className="text-indigo-100/70 text-lg font-medium leading-relaxed max-w-sm">
                            Join our network of smart investors using real-time AI advisory platforms.
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 w-fit">
                        <div className="p-2 bg-white/20 rounded-xl shadow-lg border border-white/10">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest">Secure Access</p>
                            <p className="text-[9px] text-indigo-100/60 font-bold uppercase tracking-tighter">Your data is always encrypted</p>
                        </div>
                    </div>
                    <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-indigo-200/50">© 2026 FINCHAT AI</p>
                </div>
            </div>

            {/* Right Section - Signup Form (Solid White Background) */}
            <div className="flex-1 bg-white dark:bg-gray-900 flex items-center justify-center p-6 lg:p-10 relative h-full overflow-hidden">
                <div className="w-full max-w-xl">
                    <div className="mb-8 lg:text-left text-center">
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Create Account</h3>
                        <p className="text-gray-400 dark:text-gray-500 text-sm font-medium pt-2">Join the platform to start investing today.</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#5c3ce6] transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#5c3ce6]/10 focus:border-[#5c3ce6]/50 transition-all font-medium placeholder-gray-300 dark:placeholder-gray-700"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#5c3ce6] transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#5c3ce6]/10 focus:border-[#5c3ce6]/50 transition-all font-medium placeholder-gray-300 dark:placeholder-gray-700"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#5c3ce6] transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-11 pr-11 py-3.5 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#5c3ce6]/10 focus:border-[#5c3ce6]/50 transition-all font-medium placeholder-gray-300 dark:placeholder-gray-700 sm:text-base"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#5c3ce6] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#5c3ce6] transition-colors">
                                        <RotateCcw size={18} />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-11 pr-11 py-3.5 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#5c3ce6]/10 focus:border-[#5c3ce6]/50 transition-all font-medium placeholder-gray-300 dark:placeholder-gray-700 sm:text-base"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#5c3ce6] transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#5c3ce6] hover:bg-[#4a2fd1] text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center space-x-2 group active:scale-[0.98] disabled:opacity-70 mt-4"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span className="uppercase tracking-widest text-[11px]">Create Free Account</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-500 dark:text-gray-400 text-[12px] font-bold">
                        Already have an account? <Link href="/login" className="text-[#5c3ce6] hover:underline font-black">Log in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
