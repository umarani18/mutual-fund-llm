'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fundApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Info, BarChart2, ShieldCheck, Activity } from 'lucide-react';
import { cn } from "@/lib/utils";

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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="h-full"
        >
            <Card className="h-full border-border/50 shadow-none hover:border-primary/20 hover:shadow-sm transition-all overflow-hidden rounded-xl bg-card">
                <CardHeader className="pb-2 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
                        <div className="text-primary/20">
                            {icon || <Activity className="w-4 h-4" />}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className={cn(
                        "text-2xl font-bold tracking-tight",
                        isPositive && "text-emerald-600 dark:text-emerald-500",
                        isNegative && "text-rose-600 dark:text-rose-500",
                        !isPositive && !isNegative && "text-foreground"
                    )}>
                        {formattedValue}<span className="text-base font-normal text-muted-foreground ml-0.5">{unit}</span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const IdentityItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-border/40 last:border-0">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground text-right max-w-[60%] truncate">{value || '—'}</span>
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
        <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Fetching Details</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-card p-8 rounded-xl border border-destructive/20 shadow-lg text-center space-y-6">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                    <Info className="w-6 h-6 text-destructive" />
                </div>
                <h2 className="text-lg font-bold">Unable to Load Fund Data</h2>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={() => router.push('/assistant')} variant="default" className="w-full">
                    Return to Assistant
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/assistant')}
                        className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
                    >
                        <ChevronLeft className="h-4 w-4" /> Back to Chat
                    </Button>
                    <Badge variant="outline" className="gap-2 bg-background">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Live Data
                    </Badge>
                </div>

                {/* Hero Identity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center space-x-2">
                                <Badge className="bg-blue-600 text-white hover:bg-blue-700 text-[10px] font-bold px-3 py-1 shadow-md shadow-blue-500/20 border-0">
                                    {master?.category}
                                </Badge>
                                <span className="text-muted-foreground text-xs font-bold tracking-wide">• {master?.fund_house}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] text-foreground">
                                {master?.scheme_name.split(' - ')[0]}<br />
                                <span className="text-primary/80 text-2xl md:text-3xl font-bold">{master?.scheme_name.split(' - ').slice(1).join(' - ')}</span>
                            </h1>
                        </motion.div>

                        <div className="flex flex-wrap gap-12">
                            <div className="space-y-1">
                                <div className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">Current valuation (NAV)</div>
                                <div className="text-5xl font-black tracking-tighter text-foreground flex items-baseline">
                                    <span className="text-2xl mr-1 text-primary/60 font-bold">₹</span>
                                    {Number(master?.nav).toFixed(4)}
                                </div>
                                <div className="text-[11px] text-muted-foreground font-bold bg-muted/50 w-fit px-2 py-1 rounded-md border border-border/50">
                                    As of {master?.nav_date}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ID Card Box */}
                    <Card className="border-border/60 shadow-sm rounded-xl h-fit">
                        <CardHeader className="pb-2 p-5 border-b border-border/40">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Info className="w-4 h-4 text-primary" />
                                Fund Essentials
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-2 space-y-1">
                            <IdentityItem label="Fund Manager" value={master?.fund_manager} />
                            <IdentityItem label="Benchmark" value={master?.benchmark} />
                            <IdentityItem label="Launch Date" value={master?.launch_date} />
                            {/* <IdentityItem label="Exit Load" value={master?.exit_load} /> */}
                            <IdentityItem label="Min. SIP" value={`₹${master?.min_sip}`} />
                            <IdentityItem label="Risk Profile" value={master?.risk_level} />
                            <div className="pt-3 mt-2">
                                <Badge variant="outline" className={cn(
                                    "w-full justify-center py-1.5 rounded-lg text-xs font-medium",
                                    metrics?.std_dev > 1.5
                                        ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20"
                                        : "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20"
                                )}>
                                    <Activity className="w-3 h-3 mr-2" />
                                    Volatility: {metrics?.std_dev > 1.5 ? 'High' : 'Stable'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Analytics Grid */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <BarChart2 className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Performance Snapshot</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <MetricCard label="1Y Returns" value={metrics?.return_1y} type="percentage" delay={0.1} />
                        <MetricCard label="3Y CAGR" value={metrics?.return_3y} type="percentage" delay={0.2} />
                        <MetricCard label="5Y CAGR" value={metrics?.return_5y} type="percentage" delay={0.3} />
                        <MetricCard label="10Y CAGR" value={metrics?.return_10y} type="percentage" delay={0.4} />
                        <MetricCard label="Since Inception" value={metrics?.cagr} type="percentage" delay={0.5} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Risk Metrics</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricCard label="Standard Deviation" value={metrics?.std_dev} type="number" delay={0.1} />
                        <MetricCard label="Beta" value={metrics?.beta} type="number" delay={0.2} />
                        <MetricCard label="Alpha" value={metrics?.alpha} type="percentage" delay={0.3} />
                        <MetricCard label="Sharpe Ratio" value={metrics?.sharpe} type="number" delay={0.4} />
                        <MetricCard label="Sortino Ratio" value={metrics?.sortino} type="number" delay={0.5} />
                        <MetricCard label="Max Drawdown" value={metrics?.max_drawdown} type="percentage" delay={0.6} />
                        <MetricCard label="Downside Risk" value={metrics?.downside_risk} type="percentage" delay={0.7} />
                        <MetricCard label="1Y Rolling Avg" value={metrics?.rolling_return_1y_avg} type="percentage" delay={0.8} />
                    </div>
                </div>

                {/* Main Visual Data Area */}
                <div className="space-y-8">

                    {/* Top Row: Graph & Risk DNA (VS Split) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                        {/* Performance History */}
                        <Card className="lg:col-span-2 rounded-xl border-border/60 shadow-sm overflow-hidden flex flex-col h-full">
                            <CardHeader className="p-6 pb-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-lg font-bold">NAV History</CardTitle>
                                        <p className="text-xs text-muted-foreground mt-1">Price movement over time</p>
                                    </div>
                                    <div className="flex items-center p-1 bg-muted rounded-lg w-fit">
                                        {['1M', '3M', '6M', 'YTD', '1Y', '3Y', '5Y'].map(range => (
                                            <button
                                                key={range}
                                                onClick={() => setTimeRange(range)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-md text-[10px] font-bold transition-all",
                                                    timeRange === range
                                                        ? "bg-background shadow-sm text-primary"
                                                        : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                {range}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 p-6 pt-4 min-h-[520px]">
                                <HistoryChart history={navHistory} timeRange={timeRange} />
                            </CardContent>
                        </Card>

                        {/* Stability Index (Risk DNA) */}
                        <Card className="bg-blue-600 text-white border-none rounded-2xl shadow-xl relative overflow-hidden group shadow-blue-500/20 h-full flex flex-col justify-between">
                            <CardContent className="p-8 relative z-10 space-y-6 flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-bold opacity-80 mb-1">Stability index</div>
                                        <div className="text-4xl font-black tracking-tight">
                                            {metrics?.consistency_score ? (metrics.consistency_score * 100).toFixed(0) : '—'}<span className="text-xl ml-0.5 opacity-60">%</span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg font-bold backdrop-blur-sm shadow-inner">
                                        #{metrics?.category_rank || '—'}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        ['Sharpe ratio', metrics?.sharpe || 0, 'Risk adjusted efficiency'],
                                        ['Volatility (SD)', metrics?.std_dev || 0, 'Market sensitivity'],
                                        ['Beta index', metrics?.beta || 1.0, 'Market correlation'],
                                        ['Max drawdown', metrics?.max_drawdown || 0, 'Peak-to-trough variance']
                                    ].map(([label, val, desc]) => (
                                        <div key={label} className="space-y-1">
                                            <div className="flex justify-between text-xs font-bold tracking-tight">
                                                <span>{label}</span>
                                                <span className="font-mono">{typeof val === 'number' ? val.toFixed(2) : val}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, Math.abs(Number(val)) * (label.includes('Beta') ? 50 : 100))}%` }}
                                                    className="h-full bg-white"
                                                />
                                            </div>
                                            <div className="text-[10px] opacity-60 font-medium tracking-tight">{desc}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-white/10 mt-auto">
                                    <div className="text-[10px] font-bold opacity-60 mb-1">Alpha engine analytics</div>
                                    <p className="text-[10px] opacity-80 leading-relaxed italic font-medium">
                                        "Analysis leverages 252-day rolling deterministic formulas to verify asset structural stability."
                                    </p>
                                </div>
                            </CardContent>
                            <div className="absolute -bottom-10 -right-10 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                                <svg width="250" height="250" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.4 7.2L20 8L16 12L16.9 17.6L12 15L7.1 17.6L8 12L4 8L9.6 7.2L12 2Z" /></svg>
                            </div>
                        </Card>
                    </div>

                    {/* Bottom Row: 3 Boxes (Calendar, Monthly, Registry) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

                        {/* Box 1: Calendar Returns */}
                        <Card className="rounded-xl border-border/60 shadow-sm h-full">
                            <CardHeader className="p-5 pb-3">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Calendar Returns</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-5 pt-0 space-y-2">
                                {metrics?.calendar_returns?.slice(-5).reverse().map(yr => (
                                    <div key={yr.year} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg group border border-transparent hover:border-border/50 transition-colors">
                                        <span className="font-semibold text-xs text-muted-foreground">{yr.year}</span>
                                        <span className={cn(
                                            "font-bold text-sm",
                                            yr.return > 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"
                                        )}>
                                            {(Number(yr.return) * 100).toFixed(2)}%
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Box 2: Monthly Performance */}
                        <Card className="rounded-xl border-border/60 shadow-sm h-full">
                            <CardHeader className="p-5 pb-3">
                                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Monthly Performance</CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 pt-0 grid grid-cols-3 gap-2">
                                {metrics?.monthly_returns?.slice(-12).map((mth, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center p-2 rounded-lg border border-border/40 bg-card hover:bg-muted/50 transition-colors">
                                        <span className="text-[10px] font-bold text-muted-foreground mb-1">
                                            {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][mth.month - 1]} '{mth.year.toString().slice(-2)}
                                        </span>
                                        <span className={cn(
                                            "text-xs font-bold",
                                            mth.return > 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"
                                        )}>
                                            {(Number(mth.return) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Box 3: Registry Info */}
                        <Card className="rounded-xl border-border/60 shadow-sm h-full">
                            <CardHeader className="pb-3 p-5">
                                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-primary">
                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                    Registry verification
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 pt-0 space-y-3">
                                {[
                                    ['ISIN (Growth)', master?.isin_growth],
                                    ['Scheme code', master?.scheme_code],
                                    ['Regulatory registry', 'AMFI India / SEBI'],
                                    ['Settlement', 'T+2 Institutional'],
                                    ['Execution', 'Direct / Zero-Comm']
                                ].map(([label, val]) => (
                                    <div key={label} className="flex justify-between items-center text-sm group">
                                        <span className="text-muted-foreground font-bold text-xs">{label}</span>
                                        <span className="font-bold text-foreground truncate max-w-[150px] text-xs">{val || '—'}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                    </div>

                </div>

            </div>
        </div>
    );
}

function HistoryChart({ history, timeRange }) {
    const width = 1000;
    const height = 520;
    const padding = { top: 40, right: 40, bottom: 120, left: 70 };

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
        if (filteredData.length === 0) return { min: 0, max: 1, range: 1, maxChange: 0.01 };
        const values = filteredData.map(d => d.nav_value).filter(v => v != null && isFinite(v));
        if (values.length === 0) return { min: 0, max: 1, range: 1, maxChange: 0.01 };
        const actualMin = Math.min(...values);
        const actualMax = Math.max(...values);
        const actualRange = actualMax - actualMin;
        // 15% vertical padding so the line is never clipped at edges
        const min = actualMin - actualRange * 0.15;
        const max = actualMax + actualRange * 0.15;
        const range = max - min || 1;

        const changes = filteredData.map(d => d.change).filter(isFinite);
        const maxChange = Math.max(...changes.map(Math.abs)) || 0.01;

        return { min, max, range, maxChange };
    }, [filteredData]);

    const points = useMemo(() => {
        return filteredData.map((d, i) => {
            const x = padding.left + (i / Math.max(filteredData.length - 1, 1)) * (width - padding.left - padding.right);
            const y = (height - padding.bottom) - ((d.nav_value - metrics.min) / metrics.range) * (height - padding.top - padding.bottom);

            // Variation bars: scaled to 200px max height for clear visibility
            const barH = Math.max(2, (Math.abs(d.change) / metrics.maxChange) * 200);
            const barY = height - padding.bottom + 10;

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
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                        <stop offset="70%" stopColor="#2563eb" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="chartLineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#1d4ed8" />
                        <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                </defs>

                {/* Horizontal Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(v => {
                    const lineY = (height - padding.bottom) - v * (height - padding.top - padding.bottom);
                    const labelVal = metrics.min + v * metrics.range;
                    return (
                        <g key={v}>
                            <line
                                x1={padding.left}
                                y1={lineY}
                                x2={width - padding.right}
                                y2={lineY}
                                stroke="#94a3b8"
                                strokeOpacity="0.25"
                                strokeDasharray="4 4"
                            />
                            <text
                                x={padding.left - 8}
                                y={lineY}
                                fontSize="12"
                                fill="#94a3b8"
                                textAnchor="end"
                                dominantBaseline="middle"
                                fontWeight="600"
                            >
                                ₹{labelVal.toFixed(2)}
                            </text>
                        </g>
                    );
                })}

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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        d={linePath}
                        stroke="url(#chartLineGrad)"
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="drop-shadow(0 2px 6px rgba(37,99,235,0.5))"
                    />
                </AnimatePresence>

                {/* Bottom Variation Bars */}
                {points.filter((_, i, arr) => {
                    // For dense data, thin out bars so they don't overlap
                    const step = arr.length > 500 ? 3 : arr.length > 200 ? 2 : 1;
                    return i % step === 0;
                }).map((p, i) => (
                    <motion.rect
                        key={i}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: p.barH, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        x={p.x - 2.5}
                        y={p.change >= 0 ? p.barY - p.barH : p.barY}
                        width="5"
                        rx="2"
                        fill={p.change >= 0 ? '#10b981' : '#f43f5e'}
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
                        className="text-[10px] font-medium fill-muted-foreground tracking-tight"
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
                            className="hover:fill-primary/5 transition-colors"
                        />
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="5"
                            className="fill-background stroke-primary opacity-0 group-hover:opacity-100 transition-opacity"
                            strokeWidth="2"
                        />
                    </g>
                ))}
            </svg>
            <div className="flex justify-center mt-6 space-x-8">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-xs font-medium text-muted-foreground">NAV Price</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500/80" />
                    <span className="text-xs font-medium text-muted-foreground">Daily Gain</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-sm bg-rose-500/80" />
                    <span className="text-xs font-medium text-muted-foreground">Daily Loss</span>
                </div>
            </div>
        </div>
    );
}