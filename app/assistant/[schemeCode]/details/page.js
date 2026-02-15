'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fundApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const MetricCard = ({ label, value, type = 'number', unit = '', icon = null, delay = 0 }) => {
    const formattedValue = useMemo(() => {
        if (value === null || value === undefined) return '—';
        if (type === 'percentage') return (Number(value) * 100).toFixed(2) + '%';
        if (type === 'currency') return '₹' + Number(value).toLocaleString('en-IN');
        return Number(value).toFixed(2);
    }, [value, type]);

    const isPositive = type === 'percentage' && Number(value) > 0;
    const isNegative = type === 'percentage' && Number(value) < 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.4 }}
            className="p-6 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform duration-500">
                {icon || <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.4 7.2L20 8L16 12L16.9 17.6L12 15L7.1 17.6L8 12L4 8L9.6 7.2L12 2Z" /></svg>}
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{label}</div>
            <div className={`text-2xl font-black tracking-tight ${isPositive ? 'text-emerald-500' : isNegative ? 'text-rose-500' : 'text-gray-900 dark:text-white'}`}>
                {formattedValue}{unit}
            </div>
        </motion.div>
    );
};

const IdentityItem = ({ label, value }) => (
    <div className="flex flex-col border-b border-gray-50 dark:border-gray-800/50 py-3 last:border-0 hover:px-2 transition-all">
        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</span>
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{value || 'Not Disclosed'}</span>
    </div>
);

export default function FundDetailsPage() {
    const { schemeCode } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState(null);
    const [timeRange, setTimeRange] = useState('1Y');

    useEffect(() => {
        let active = true;
        async function load() {
            try {
                setLoading(true);
                const res = await fundApi.getFundMetrics(schemeCode);
                if (active) {
                    setData(res);
                    setError('');
                }
            } catch (err) {
                if (active) setError(err?.message || 'Failed to load dashboard');
            } finally {
                if (active) setLoading(false);
            }
        }
        load();
        return () => { active = false; };
    }, [schemeCode]);

    const master = data?.fund_master;
    const metrics = data?.fund_metrics;
    const navHistory = data?.nav_history || [];

    if (loading) return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <div className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 animate-pulse">De-coding Asset DNA</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 flex flex-col items-center justify-center p-12">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-red-100 dark:border-red-900/30 shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h2 className="text-xl font-black tracking-tight">Access Restricted or Asset Offline</h2>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{error}</p>
                <button onClick={() => router.push('/assistant')} className="w-full py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-transform">
                    Return to Mission Hub
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans p-6 md:p-12 selection:bg-indigo-500 selection:text-white">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header Navigation */}
                <div className="flex items-center justify-between">
                    <button onClick={() => router.push('/assistant')} className="text-[10px] font-black uppercase tracking-widest text-indigo-500 flex items-center hover:translate-x-[-4px] transition-transform">
                        <span className="mr-2 text-base">←</span> Return to Hub
                    </button>
                    <div className="text-[10px] font-bold px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 dark:border-emerald-900/30 flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" /> Live Analysis Active
                    </div>
                </div>

                {/* Hero Identity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    <div className="lg:col-span-3 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="px-3 py-1 rounded-full bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                                    {master?.category}
                                </span>
                                <span className="text-gray-400 text-xs font-bold tracking-widest uppercase opacity-60">• {master?.fund_house}</span>
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] text-gray-900 dark:text-white">
                                {master?.scheme_name.split(' - ')[0]}<br />
                                <span className="text-indigo-500/70 text-2xl md:text-3xl font-black">{master?.scheme_name.split(' - ').slice(1).join(' - ')}</span>
                            </h1>
                        </motion.div>

                        <div className="flex flex-wrap gap-16">
                            <div className="space-y-1">
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Current Valuation (NAV)</div>
                                <div className="text-6xl font-black tracking-tighter text-gray-900 dark:text-white flex items-baseline">
                                    <span className="text-2xl mr-1 text-gray-400 font-bold">₹</span>
                                    {Number(master?.nav).toFixed(4)}
                                </div>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-100 dark:bg-gray-800/50 w-fit px-2 py-0.5 rounded">As of {master?.nav_date}</div>
                            </div>
                        </div>
                    </div>

                    {/* ID Card Box */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden h-fit"
                    >
                        <div className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-6 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.333 0 4 1 4 3" /></svg>
                            Asset Identity Card
                        </div>
                        <div className="space-y-0">
                            <IdentityItem label="Lead Manager" value={master?.fund_manager} />
                            <IdentityItem label="Benchmark" value={master?.benchmark} />
                            <IdentityItem label="Genesis Date" value={master?.launch_date} />
                            <IdentityItem label="Exit Load Policy" value={master?.exit_load} />
                            <IdentityItem label="Monthly Commitment" value={`₹${master?.min_sip}`} />
                            <IdentityItem label="Risk Taxonomy" value={master?.risk_level} />
                            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${metrics?.std_dev > 1.5 ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-emerald-50 text-emerald-500 border border-emerald-100'}`}>
                                    <span className="w-2 h-2 rounded-full mr-2 bg-current animate-pulse" />
                                    Variation Velocity: {metrics?.std_dev > 1.5 ? 'Very High' : 'Stable'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Performance Analytics Grid */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500">Performance Snapshot</h2>
                        <div className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800 mx-6 opacity-30" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        <MetricCard label="1Y Absolute" value={metrics?.return_1y} type="percentage" delay={0.1} />
                        <MetricCard label="3Y CAGR" value={metrics?.return_3y} type="percentage" delay={0.2} />
                        <MetricCard label="5Y CAGR" value={metrics?.return_5y} type="percentage" delay={0.3} />
                        <MetricCard label="10Y CAGR" value={metrics?.return_10y} type="percentage" delay={0.4} />
                        <MetricCard label="Inception CAGR" value={metrics?.cagr} type="percentage" delay={0.5} />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500">Risk & Volatility Parameters</h2>
                        <div className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800 mx-6 opacity-30" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard label="Standard Deviation" value={metrics?.std_dev} type="number" delay={0.1} />
                        <MetricCard label="Beta Ratio" value={metrics?.beta} type="number" delay={0.2} />
                        <MetricCard label="Jensen's Alpha" value={metrics?.alpha} type="percentage" delay={0.3} />
                        <MetricCard label="Sharpe Ratio" value={metrics?.sharpe} type="number" delay={0.4} />
                        <MetricCard label="Sortino Ratio" value={metrics?.sortino} type="number" delay={0.5} />
                        <MetricCard label="Max Drawdown" value={metrics?.max_drawdown} type="percentage" delay={0.6} />
                        <MetricCard label="Downside Risk" value={metrics?.downside_risk} type="percentage" delay={0.7} />
                        <MetricCard label="1Y Avg Rolling" value={metrics?.rolling_return_1y_avg} type="percentage" delay={0.8} />
                    </div>
                </div>

                {/* Main Visual Data Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Performance History & Rolling Returns */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-gray-900 rounded-[3.5rem] p-10 border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden min-h-[500px] flex flex-col">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Price Dynamics & Volatility</div>
                                    <div className="text-2xl font-black">Historical NAV Analytics</div>
                                </div>
                                <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
                                    {['1M', '3M', '6M', 'YTD', '1Y', '3Y'].map(range => (
                                        <button
                                            key={range}
                                            onClick={() => setTimeRange(range)}
                                            className={`px-3 py-2 rounded-xl text-[9px] font-black transition-all ${timeRange === range ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 min-h-[300px]">
                                <HistoryChart history={navHistory} timeRange={timeRange} />
                            </div>
                        </div>

                        {/* Analysis Tables: Monthly & Calendar Returns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-6 flex justify-between">
                                    <span>Calendar Year Returns</span>
                                    <span className="text-gray-400">Absolute %</span>
                                </div>
                                <div className="space-y-3">
                                    {metrics?.calendar_returns?.slice(-5).reverse().map(yr => (
                                        <div key={yr.year} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl group hover:bg-white dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                            <span className="font-black text-xs text-gray-400">{yr.year}</span>
                                            <span className={`font-black text-sm ${yr.return > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {(Number(yr.return) * 100).toFixed(2)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">Last 12 Monthly Alpha</div>
                                <div className="grid grid-cols-3 gap-2">
                                    {metrics?.monthly_returns?.slice(-12).map((mth, i) => (
                                        <div key={i} className="flex flex-col items-center justify-center p-3 rounded-2xl border border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 hover:scale-105 transition-transform">
                                            <span className="text-[8px] font-black text-gray-400 mb-1">{['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][mth.month - 1]} {mth.year.toString().slice(-2)}</span>
                                            <span className={`text-[10px] font-black ${mth.return > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {(Number(mth.return) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Risk DNA Sidebar */}
                    <div className="space-y-8">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-indigo-600 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group shadow-indigo-500/20"
                        >
                            <div className="relative z-10 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Stability Index</div>
                                        <div className="text-5xl font-black tracking-tighter">
                                            {metrics?.consistency_score ? (metrics.consistency_score * 100).toFixed(0) : '—'}<span className="text-xl ml-1 opacity-50">%</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-black">
                                        #{metrics?.category_rank || '—'}
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    {[
                                        ['Sharpe Ratio', metrics?.sharpe || 0, 'Risk Adjusted Efficiency'],
                                        ['Volatility (SD)', metrics?.std_dev || 0, 'Market Sensitivity'],
                                        ['Beta Index', metrics?.beta || 1.0, 'Market Correlation'],
                                        ['Max Drawdown', metrics?.drawdown || 0, 'Peak-to-Trough Variance']
                                    ].map(([label, val, desc]) => (
                                        <div key={label} className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span>{label}</span>
                                                <span className="font-mono">{typeof val === 'number' ? val.toFixed(3) : val}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, Math.abs(Number(val)) * (label.includes('Beta') ? 50 : 100))}%` }}
                                                    className="h-full bg-white"
                                                />
                                            </div>
                                            <div className="text-[8px] opacity-40 uppercase font-black tracking-tighter">{desc}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6 border-t border-white/10">
                                    <div className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">Alpha Engine Analytics</div>
                                    <p className="text-[10px] opacity-80 leading-relaxed italic font-medium">
                                        "Analysis leverages 252-day rolling deterministic formulas to verify asset structural stability."
                                    </p>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                                <svg width="250" height="250" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.4 7.2L20 8L16 12L16.9 17.6L12 15L7.1 17.6L8 12L4 8L9.6 7.2L12 2Z" /></svg>
                            </div>
                        </motion.div>

                        {/* Professional Registry */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Registry Verification</div>
                            <div className="space-y-4">
                                {[
                                    ['ISIN (Growth)', master?.isin_growth],
                                    ['Scheme Code', master?.scheme_code],
                                    ['Regulatory Registry', 'AMFI India / SEBI'],
                                    ['Settlement', 'T+2 Institutional'],
                                    ['Execution', 'Direct / Zero-Comm']
                                ].map(([label, val]) => (
                                    <div key={label} className="flex justify-between items-center group">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</span>
                                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 truncate max-w-[130px] group-hover:max-w-none transition-all">{val || '—'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

function HistoryChart({ history, timeRange }) {
    const width = 1000;
    const height = 450;
    const padding = { top: 40, right: 40, bottom: 110, left: 60 };

    const filteredData = useMemo(() => {
        if (!history || history.length === 0) return [];

        let daysToKeep = 0;
        switch (timeRange) {
            case '1M': daysToKeep = 30; break;
            case '3M': daysToKeep = 90; break;
            case '6M': daysToKeep = 180; break;
            case 'YTD':
                const now = new Date();
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                daysToKeep = Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                break;
            case '1Y': daysToKeep = 365; break;
            case '3Y': daysToKeep = 1095; break;
            case '5Y': daysToKeep = 1825; break;
            case '10Y': daysToKeep = 3650; break;
            default: daysToKeep = 365;
        }

        // history is sorted by date from backend
        const recent = history.slice(-daysToKeep);

        // Calculate daily changes for the "bottom variation"
        return recent.map((d, i) => {
            const prev = recent[i - 1];
            const change = prev ? (d.nav_value / prev.nav_value - 1) : 0;
            return { ...d, change };
        });
    }, [history, timeRange]);

    const metrics = useMemo(() => {
        if (filteredData.length === 0) return { min: 0, max: 1, range: 1 };
        const values = filteredData.map(d => d.nav_value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min || 1;

        const changes = filteredData.map(d => d.change);
        const maxChange = Math.max(...changes.map(Math.abs)) || 0.01;

        return { min, max, range, maxChange };
    }, [filteredData]);

    const points = useMemo(() => {
        return filteredData.map((d, i) => {
            const x = padding.left + (i / Math.max(filteredData.length - 1, 1)) * (width - padding.left - padding.right);
            const y = (height - padding.bottom) - ((d.nav_value - metrics.min) / metrics.range) * (height - padding.top - padding.bottom);

            // Enhanced Daily Variation bar scaling - 40% taller for more visual impact
            const barH = (Math.abs(d.change) / metrics.maxChange) * 85;
            const barY = height - padding.bottom + 45;

            return { x, y, barH, barY, ...d };
        });
    }, [filteredData, metrics]);

    const linePath = points.reduce((acc, p, i) => {
        if (i === 0) return `M${p.x},${p.y}`;
        const prev = points[i - 1];
        const cp1x = prev.x + (p.x - prev.x) / 2;
        return acc + ` C${cp1x},${prev.y} ${cp1x},${p.y} ${p.x},${p.y}`;
    }, '');

    const areaPath = points.length > 0
        ? linePath + ` L${points[points.length - 1].x},${height - padding.bottom} L${points[0].x},${height - padding.bottom} Z`
        : '';

    return (
        <div className="w-full h-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible cursor-crosshair">
                <defs>
                    <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="chartLineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>

                {/* Horizontal Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(v => (
                    <g key={v} opacity="0.05">
                        <line
                            x1={padding.left}
                            y1={(height - padding.bottom) - v * (height - padding.top - padding.bottom)}
                            x2={width - padding.right}
                            y2={(height - padding.bottom) - v * (height - padding.top - padding.bottom)}
                            stroke="currentColor"
                        />
                        <text
                            x={padding.left - 10}
                            y={(height - padding.bottom) - v * (height - padding.top - padding.bottom)}
                            className="text-[10px] font-bold fill-gray-400 text-right"
                            textAnchor="end"
                            alignmentBaseline="middle"
                        >
                            {(metrics.min + v * metrics.range).toFixed(1)}
                        </text>
                    </g>
                ))}

                <AnimatePresence>
                    <motion.path
                        key={`area-${timeRange}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        d={areaPath}
                        fill="url(#chartAreaGrad)"
                    />
                    <motion.path
                        key={`line-${timeRange}`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        d={linePath}
                        stroke="url(#chartLineGrad)"
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                    />
                </AnimatePresence>

                {/* Bottom Variation Bars - Enhanced Size */}
                {points.filter((_, i) => i % (timeRange === 'ALL' ? 10 : 1) === 0).map((p, i) => (
                    <motion.rect
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: p.barH }}
                        x={p.x - 2}
                        y={p.change >= 0 ? p.barY - p.barH : p.barY}
                        width="4"
                        rx="2"
                        className={p.change >= 0 ? "fill-emerald-400" : "fill-rose-400"}
                        opacity="0.9"
                    />
                ))}

                {/* Labels at bottom */}
                {points.filter((_, i, arr) => {
                    const step = Math.ceil(arr.length / 8);
                    return i % step === 0;
                }).map((p, i) => (
                    <text
                        key={i}
                        x={p.x}
                        y={height - 20}
                        className="text-[10px] font-black fill-gray-400 tracking-tighter"
                        textAnchor="middle"
                    >
                        {new Date(p.nav_date).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                    </text>
                ))}

                {/* Interaction Overlay */}
                {points.map((p, i) => (
                    <g key={i} className="group">
                        <rect
                            x={p.x - 5}
                            y={padding.top}
                            width="10"
                            height={height - padding.top - padding.bottom}
                            fill="transparent"
                            className="hover:fill-indigo-500/5 transition-colors"
                        />
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="6"
                            fill="white"
                            stroke="#6366f1"
                            strokeWidth="3"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                    </g>
                ))}
            </svg>
            <div className="flex justify-center mt-10 space-x-12">
                <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/20" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">NAV Price History</span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-sm bg-emerald-400/80 shadow-lg shadow-emerald-400/20" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Daily Alpha (Gains/Loss)</span>
                </div>
            </div>
        </div>
    );
}
