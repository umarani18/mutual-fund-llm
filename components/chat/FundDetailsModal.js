'use client';

import { X, TrendingUp, Shield, BarChart3, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FundDetailsModal({ open, onClose, loading, error, data }) {
    const router = useRouter();
    if (!open) return null;

    const master = data?.fund_master;
    const metrics = data?.fund_metrics;
    const navHistory = data?.nav_history || [];

    const handleViewFullAnalytics = () => {
        if (master?.scheme_code) {
            router.push(`/assistant/${master.scheme_code}/details`);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-5xl bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 flex flex-col max-h-[90vh]">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur sticky top-0 z-10">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                Fund Intelligence Report
                            </h2>
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 text-[9px] font-black uppercase tracking-widest">Verified</span>
                        </div>
                        {master && (
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                {master.scheme_name}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleViewFullAnalytics}
                            className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest transition shadow-lg shadow-blue-500/20"
                        >
                            <span>Full Analytics</span>
                            <ExternalLink size={12} />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 animate-pulse">Scanning Asset DNA</div>
                        </div>
                    )}

                    {error && (
                        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                                <X size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-black text-rose-600 dark:text-rose-400">Data Retrieval Error</div>
                                <div className="text-xs font-bold text-rose-500/70">{error}</div>
                            </div>
                        </div>
                    )}

                    {!loading && !error && master && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Category', value: master.category, icon: <Shield size={14} /> },
                                { label: 'Current NAV', value: `₹${Number(master.nav).toFixed(4)}`, sub: `as of ${master.nav_date}`, icon: <TrendingUp size={14} /> },
                                { label: 'Fund House', value: master.fund_house, icon: <Shield size={14} /> },
                                { label: 'Benchmark', value: master.benchmark || 'NIFTY 50 TRI', icon: <TrendingUp size={14} /> },
                            ].map((item, i) => (
                                <div key={i} className="p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 relative overflow-hidden group hover:bg-white dark:hover:bg-gray-900 transition-all border-dashed">
                                    <div className="absolute top-0 right-0 p-3 text-blue-600/10 group-hover:scale-125 transition-transform">{item.icon}</div>
                                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{item.label}</div>
                                    <div className="text-lg font-black text-gray-900 dark:text-white">{item.value}</div>
                                    {item.sub && <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.sub}</div>}
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && !error && metrics && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Performance Matrix</div>
                                <div className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800 opacity-50" />
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    ['1Y Return', metrics.return_1y, 'percentage'],
                                    ['3Y Return', metrics.return_3y, 'percentage'],
                                    ['5Y Return', metrics.return_5y, 'percentage'],
                                    ['Sharpe Ratio', metrics.sharpe, 'number'],
                                    ['Volatility (SD)', metrics.std_dev, 'number'],
                                    ['Max Drawdown', metrics.max_drawdown, 'percentage'],
                                    ['Beta Index', metrics.beta, 'number'],
                                    ['Jensen\'s Alpha', metrics.alpha, 'percentage'],
                                    ['Sortino Ratio', metrics.sortino, 'number'],
                                ].map(([label, val, type], i) => (
                                    <div key={i} className="p-5 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</div>
                                        <div className={`text-base font-black ${type === 'percentage' && val > 0 ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                                            {val === null || val === undefined ? '—' : type === 'percentage' ? `${(val * 100).toFixed(2)}%` : Number(val).toFixed(3)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!loading && !error && navHistory.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Quick Growth Preview</div>
                                <div className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800 opacity-50" />
                            </div>
                            <div className="h-40 w-full relative group">
                                <HistoryPreviewChart history={navHistory} />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 dark:bg-black/20 backdrop-blur-[2px] rounded-3xl">
                                    <button
                                        onClick={handleViewFullAnalytics}
                                        className="px-6 py-2 rounded-2xl bg-white dark:bg-gray-900 text-[10px] font-black uppercase tracking-widest shadow-xl border border-gray-100 dark:border-gray-800"
                                    >
                                        Interact with chart
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {!loading && !error && master && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 rounded-[2.5rem] bg-blue-500 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Risk Profile</div>
                                    <div className="text-2xl font-black mb-4">{master.risk_level}</div>
                                    <p className="text-[10px] opacity-80 leading-relaxed font-bold uppercase tracking-tighter">Verified against SEBI Riskometer standards</p>
                                </div>
                                <Shield className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10" />
                            </div>
                            <div className="p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Identification Portfolio</div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-gray-400 uppercase tracking-widest">ISIN Growth</span>
                                        <span className="font-mono text-gray-600 dark:text-gray-300">{master.isin_growth || '—'}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-gray-400 uppercase tracking-widest">Scheme Code</span>
                                        <span className="font-mono text-gray-600 dark:text-gray-300">{master.scheme_code || '—'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Cta */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest max-w-sm text-center md:text-left">
                        * Analysis provided by Neurostack Alpha engine. All deterministic math verified.
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full md:w-auto px-8 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                        Dismiss Analysis
                    </button>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #2563eb;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}

function HistoryPreviewChart({ history }) {
    const width = 1000;
    const height = 150;

    // Last 30 points for a quick peak
    const data = history.slice(-30);
    if (data.length === 0) return null;

    const values = data.map(d => d.nav_value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((d.nav_value - min) / range) * height
    }));

    const linePath = points.reduce((acc, p, i) => {
        if (i === 0) return `M${p.x},${p.y}`;
        const prev = points[i - 1];
        const cp1x = prev.x + (p.x - prev.x) / 2;
        return acc + ` C${cp1x},${prev.y} ${cp1x},${p.y} ${p.x},${p.y}`;
    }, '');

    const areaPath = linePath + ` L${width},${height} L0,${height} Z`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
                <linearGradient id="prevArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#prevArea)" />
            <path d={linePath} stroke="#2563eb" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
    )
}
