'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fundApi, analyticsApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Info, BarChart2, ShieldCheck, Activity, TrendingUp } from 'lucide-react';
import { cn } from "@/lib/utils";

const MetricCard = ({ label, value, catValue = null, type = 'number', unit = '', icon = null, delay = 0 }) => {
    const format = (val) => {
        if (val === null || val === undefined || isNaN(Number(val))) return '—';
        if (type === 'percentage') return (Number(val) * 100).toFixed(2) + '%';
        if (type === 'currency') return '₹' + Number(val).toLocaleString('en-IN');
        if (type === 'crore') return Number(val).toLocaleString('en-IN', { maximumFractionDigits: 2 });
        return Number(val).toFixed(2);
    };

    const formattedValue = format(value);
    const formattedCatValue = catValue !== null ? format(catValue) : null;

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
                <CardHeader className="pb-1 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
                        <div className="text-primary/20">
                            {icon || <Activity className="w-3.5 h-3.5" />}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className={cn(
                        "text-xl font-black tracking-tight flex items-baseline flex-wrap gap-x-2",
                        isPositive && "text-emerald-600 dark:text-emerald-500",
                        isNegative && "text-rose-600 dark:text-rose-500",
                        !isPositive && !isNegative && "text-foreground"
                    )}>
                        <span>{formattedValue}{unit}</span>
                        {formattedCatValue && (
                            <span className="text-sm font-bold text-muted-foreground/50">
                                / {formattedCatValue}{unit}
                            </span>
                        )}
                    </div>
                    {formattedCatValue && (
                        <div className="text-[9px] font-bold text-muted-foreground/40 mt-1 uppercase tracking-tighter">
                            Category Average: {formattedCatValue}{unit}
                        </div>
                    )}
                    {type === 'crore' && (
                        <div className="text-[8px] font-bold text-muted-foreground/30 mt-1 uppercase tracking-tighter truncate">
                            Valuation: Daily Estimate
                        </div>
                    )}
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

const PerformanceTable = ({ title, columns, data, highlightEmerald = false }) => (
    <Card className="border-border/60 shadow-none rounded-xl overflow-hidden bg-card">
        <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/20">
            <CardTitle className="text-sm font-bold tracking-tight text-foreground">{title}</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-muted/30 border-b border-border/40">
                        {columns.map((col, i) => (
                            <th key={i} className={cn(
                                "text-[10px] font-black uppercase tracking-widest text-muted-foreground py-3 px-4",
                                i > 0 && "text-right"
                            )}>
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i} className="border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors">
                            <td className="py-3 px-4 text-xs font-bold text-foreground">{row.period || row.year}</td>
                            <td className={cn(
                                "py-3 px-4 text-xs font-bold text-right",
                                Number(row.absolute) > 0 ? "text-emerald-600" : Number(row.absolute) < 0 ? "text-rose-600" : "text-muted-foreground"
                            )}>
                                {row.absolute !== null && row.absolute !== undefined && !isNaN(Number(row.absolute)) ? `${Number(row.absolute).toFixed(2)}%` : '--'}
                            </td>
                            {row.hasOwnProperty('annualized') && (
                                <td className={cn(
                                    "py-3 px-4 text-xs font-bold text-right",
                                    Number(row.annualized) > 0 ? "text-emerald-600" : Number(row.annualized) < 0 ? "text-rose-600" : "text-muted-foreground"
                                )}>
                                    {row.annualized !== null && row.annualized !== undefined && !isNaN(Number(row.annualized)) ? `${Number(row.annualized).toFixed(2)}%` : '--'}
                                </td>
                            )}
                            <td className="py-3 px-4 text-xs font-bold text-right text-emerald-600/70">
                                {row.catAvg !== null && row.catAvg !== undefined && !isNaN(Number(row.catAvg)) ? `${Number(row.catAvg).toFixed(2)}%` : '--'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const AboutSection = ({ master }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-border/80 pb-2">
                <h2 className="text-xl font-black uppercase tracking-tighter text-foreground">About</h2>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] items-start gap-4">
                    <div className="space-y-1">
                        <span className="text-sm font-black text-foreground">Fund Manager(s)</span>
                        <div>
                            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2">Check History</button>
                        </div>
                    </div>
                    <span className="text-sm font-bold text-muted-foreground/80 leading-relaxed">
                        {master?.fund_manager || 'Institutional Team'}
                    </span>
                </div>

                <div className="grid grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] items-center gap-4 py-4 border-y border-border/40">
                    <span className="text-sm font-black text-foreground">Launch Date</span>
                    <span className="text-sm font-bold text-muted-foreground/80">
                        {formatDate(master?.launch_date)}
                    </span>
                </div>

                <div className="grid grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] items-center gap-4 border-b border-border/40 pb-4">
                    <span className="text-sm font-black text-foreground">Benchmark</span>
                    <span className="text-sm font-bold text-muted-foreground/80">
                        {master?.benchmark || 'Nifty 50 TR INR'}
                    </span>
                </div>

                <div className="grid grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] items-start gap-4">
                    <span className="text-sm font-black text-foreground">Objective</span>
                    <p className="text-xs font-bold text-muted-foreground/60 leading-relaxed italic max-w-3xl">
                        {master?.objective || 'Information currently being indexed...'}
                    </p>
                </div>
            </div>
        </div>
    );
};

const FundamentalsTable = ({ metrics, catAvg }) => {
    const rows = [
        { label: 'PE', value: metrics?.pe_ratio, cat: catAvg?.pe_ratio, type: 'number' },
        { label: 'PB', value: metrics?.pb_ratio, cat: catAvg?.pb_ratio, type: 'number' },
        { label: 'Price/Sale', value: metrics?.price_to_sales, cat: catAvg?.price_to_sales, type: 'number' },
        { label: 'Price/Cash Flow', value: metrics?.price_to_cash_flow, cat: catAvg?.price_to_cash_flow, type: 'number' },
        { label: 'Dividend Yield', value: metrics?.dividend_yield, cat: catAvg?.dividend_yield, type: 'percentage' },
        { label: 'Sales Growth', value: metrics?.sales_growth, cat: catAvg?.sales_growth, type: 'percentage' },
    ];

    const format = (val, type) => {
        if (val === null || val === undefined || isNaN(Number(val))) return '—';
        if (type === 'percentage') return (Number(val) * 100).toFixed(2) + '%';
        return Number(val).toFixed(2);
    };

    return (
        <Card className="border-border/60 shadow-none rounded-xl overflow-hidden bg-card">
            <CardHeader className="p-5 pb-3 border-b border-border/40 bg-muted/10">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground">Fundamentals</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/5 border-b border-border/40">
                            <th className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-4 px-6">Measures</th>
                            <th className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-4 px-6 text-right">Fund</th>
                            <th className="text-[10px] font-black uppercase tracking-widest text-muted-foreground py-4 px-4 text-right">Category Average</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i} className="border-b border-border/10 last:border-0 hover:bg-muted/5 transition-colors">
                                <td className="py-4 px-6 text-xs font-black text-foreground">{row.label}</td>
                                <td className="py-4 px-6 text-xs font-black text-right text-emerald-600">
                                    {format(row.value, row.type)}
                                </td>
                                <td className="py-4 px-4 text-xs font-bold text-right text-emerald-600/60">
                                    {format(row.cat, row.type)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default function FundDetailsPage() {
    const ROLLING_PERIOD_OPTIONS = ['1M', '2M', '3M', '6M', '1Y', '3Y', '5Y', '10Y'];
    const { schemeCode } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState(null);
    const [timeRange, setTimeRange] = useState('1Y');
    const [rollingApiData, setRollingApiData] = useState(null);
    const [rollingPeriod, setRollingPeriod] = useState('3Y');
    const [rollingLoading, setRollingLoading] = useState(false);
    const [benchmarkApiData, setBenchmarkApiData] = useState(null);

    const rollingPayload = (periodLabel) => {
        const p = String(periodLabel || '3Y').toUpperCase();
        if (p.endsWith('M')) {
            const months = Number(p.slice(0, -1));
            return { rolling_period_months: Number.isFinite(months) ? months : 3, rolling_period_label: p };
        }
        const years = Number(p.slice(0, -1));
        return { rolling_period_years: Number.isFinite(years) ? years : 3, rolling_period_label: p };
    };

    useEffect(() => {
        let active = true;
        async function load() {
            try {
                setLoading(true);
                const [res, benchRes] = await Promise.allSettled([
                    fundApi.getFundMetrics(schemeCode),
                    analyticsApi.getBenchmarkOutperformance({ fund_id: schemeCode, frequency: "annual" }),
                ]);
                if (active) {
                    if (res.status === 'fulfilled') {
                        setData(res.value);
                    } else {
                        throw res.reason;
                    }
                    setBenchmarkApiData(benchRes.status === 'fulfilled' ? benchRes.value : null);
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

    useEffect(() => {
        let active = true;
        async function loadRolling() {
            try {
                setRollingLoading(true);
                const res = await analyticsApi.getRollingReturn({
                    fund_id: schemeCode,
                    frequency: "daily",
                    ...rollingPayload(rollingPeriod),
                });
                if (active) setRollingApiData(res);
            } catch (_) {
                if (active) setRollingApiData(null);
            } finally {
                if (active) setRollingLoading(false);
            }
        }
        loadRolling();
        return () => { active = false; };
    }, [schemeCode, rollingPeriod]);

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

                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <BarChart2 className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Return Performance (CAGR)</h3>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        <MetricCard
                            label="1Y CAGR"
                            value={metrics?.return_1y != null ? metrics.return_1y / 100 : null}
                            catValue={data?.category_averages?.return_1y != null ? data.category_averages.return_1y / 100 : null}
                            type="percentage"
                            delay={0.05}
                        />
                        <MetricCard
                            label="3Y CAGR"
                            value={metrics?.return_3y != null ? metrics.return_3y / 100 : null}
                            catValue={data?.category_averages?.return_3y != null ? data.category_averages.return_3y / 100 : null}
                            type="percentage"
                            delay={0.1}
                        />
                        <MetricCard
                            label="5Y CAGR"
                            value={metrics?.return_5y != null ? metrics.return_5y / 100 : null}
                            catValue={data?.category_averages?.return_5y != null ? data.category_averages.return_5y / 100 : null}
                            type="percentage"
                            delay={0.15}
                        />
                        <MetricCard
                            label="10Y CAGR"
                            value={metrics?.return_10y != null ? metrics.return_10y / 100 : null}
                            catValue={data?.category_averages?.return_10y != null ? data.category_averages.return_10y / 100 : null}
                            type="percentage"
                            delay={0.2}
                        />
                        <MetricCard
                            label="SI CAGR"
                            value={metrics?.cagr}
                            catValue={data?.category_averages?.cagr}
                            type="percentage"
                            delay={0.25}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Advanced Risk Metrics</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* New Benchmarked Metrics */}
                        <MetricCard
                            label={`AUM (Cr) ${master?.aum_date ? `• ${master.aum_date}` : ''}`}
                            value={master?.aum}
                            type="crore"
                            delay={0.1}
                            icon={<BarChart2 className="w-3 h-3" />}
                        />
                        <MetricCard
                            label="Expense Ratio / Category"
                            value={master?.expense_ratio}
                            catValue={data?.category_averages?.expense_ratio}
                            type="number"
                            unit="%"
                            delay={0.15}
                        />
                        <MetricCard
                            label="Sharpe / Category"
                            value={metrics?.sharpe}
                            catValue={data?.category_averages?.sharpe}
                            type="number" delay={0.2}
                        />
                        <MetricCard
                            label="SD / Category"
                            value={metrics?.std_dev}
                            catValue={data?.category_averages?.std_dev}
                            type="number" delay={0.25}
                        />
                        <MetricCard
                            label="Beta / Category"
                            value={metrics?.beta}
                            catValue={data?.category_averages?.beta}
                            type="number" delay={0.3}
                        />
                        <MetricCard
                            label="Turnover / Category"
                            value={metrics?.portfolio_turnover}
                            catValue={data?.category_averages?.portfolio_turnover}
                            type="number"
                            unit="%"
                            delay={0.35}
                        />

                        {/* Restored Original Risk Metrics */}
                        <MetricCard label="Alpha" value={metrics?.alpha} type="percentage" delay={0.4} />
                        <MetricCard label="Sortino Ratio" value={metrics?.sortino} type="number" delay={0.45} />
                        <MetricCard label="Max Drawdown" value={metrics?.max_drawdown} type="percentage" delay={0.5} />
                        <MetricCard label="Downside Risk" value={metrics?.downside_risk} type="percentage" delay={0.55} />
                        <MetricCard label="1Y Rolling Avg" value={metrics?.rolling_return_1y_avg} type="percentage" delay={0.6} />
                    </div>
                </div>

                {/* Phase 2: Analytics API Widgets */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Live Analytics Engine</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4 border-border/60">
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rolling Engine ({rollingPeriod})</div>
                                <select
                                    value={rollingPeriod}
                                    onChange={(e) => setRollingPeriod(e.target.value)}
                                    className="h-7 rounded border border-border/60 bg-background px-2 text-[10px] font-bold tracking-wide"
                                >
                                    {ROLLING_PERIOD_OPTIONS.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                            {rollingLoading && <div className="mb-2 text-[10px] font-semibold text-muted-foreground">Updating...</div>}
                            <div className="space-y-1 text-sm font-medium">
                                <div>Mean: <span className="font-mono">{rollingApiData?.metrics?.mean_rolling_return?.toFixed?.(4) ?? '—'}</span></div>
                                <div>Median: <span className="font-mono">{rollingApiData?.metrics?.median_rolling_return?.toFixed?.(4) ?? '—'}</span></div>
                                <div>Consistency: <span className="font-mono">{rollingApiData?.metrics?.consistency_score?.toFixed?.(4) ?? '—'}</span></div>
                            </div>
                        </Card>
                        <Card className="p-4 border-border/60">
                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Benchmark Engine</div>
                            <div className="space-y-1 text-sm font-medium">
                                <div>Excess: <span className="font-mono">{benchmarkApiData?.metrics?.excess_return?.toFixed?.(4) ?? '—'}</span></div>
                                <div>Alpha: <span className="font-mono">{benchmarkApiData?.metrics?.alpha?.toFixed?.(4) ?? '—'}</span></div>
                                <div>Outperf Ratio: <span className="font-mono">{benchmarkApiData?.metrics?.outperformance_ratio?.toFixed?.(4) ?? '—'}</span></div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Fundamentals Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <Activity className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Portfolio Fundamentals</h3>
                    </div>
                    <FundamentalsTable metrics={metrics} catAvg={data?.category_averages} />
                </div>

                {/* Performance Section with High-Precision Tables */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                        <BarChart2 className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Performance</h3>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Absolute and Annualised Returns */}
                        <PerformanceTable
                            title="Absolute and Annualised Returns"
                            columns={['Period', 'Absolute(%)', 'Annualised(%)', 'Category Average(%)']}
                            data={[
                                { period: '1 Week', absolute: metrics?.return_1w, annualized: null, catAvg: data?.category_averages?.return_1w },
                                { period: '1 Month', absolute: metrics?.return_1m, annualized: null, catAvg: data?.category_averages?.return_1m },
                                { period: '3 Month', absolute: metrics?.return_3m, annualized: null, catAvg: data?.category_averages?.return_3m },
                                { period: '6 Month', absolute: metrics?.return_6m, annualized: null, catAvg: data?.category_averages?.return_6m },
                                { period: 'YTD', absolute: metrics?.return_ytd, annualized: null, catAvg: data?.category_averages?.return_ytd },
                                { period: '1 Year', absolute: metrics?.return_1y_abs || (metrics?.return_1y * 1.0), annualized: metrics?.return_1y, catAvg: data?.category_averages?.return_1y },
                                { period: '2 Years', absolute: metrics?.return_2y_abs, annualized: metrics?.return_2y, catAvg: data?.category_averages?.return_2y },
                                { period: '3 Years', absolute: metrics?.return_3y_abs, annualized: metrics?.return_3y, catAvg: data?.category_averages?.return_3y },
                                { period: '5 Years', absolute: metrics?.return_5y_abs, annualized: metrics?.return_5y, catAvg: data?.category_averages?.return_5y },
                                { period: '7 Years', absolute: metrics?.return_7y_abs, annualized: metrics?.return_7y, catAvg: data?.category_averages?.return_7y },
                                { period: '10 Years', absolute: metrics?.return_10y_abs, annualized: metrics?.return_10y, catAvg: data?.category_averages?.return_10y },
                            ]}
                        />

                        {/* Yearly Returns */}
                        <PerformanceTable
                            title="Yearly Returns"
                            columns={['Period', 'Absolute(%)', 'Category Average(%)']}
                            data={metrics?.calendar_returns ? [...metrics.calendar_returns].reverse().map(yr => {
                                const catYear = data?.category_averages?.calendar_returns?.find(cy => cy.year === yr.year);
                                const catAvg = catYear ? catYear.return * 100 : null;
                                return {
                                    year: yr.year,
                                    absolute: (yr.return * 100),
                                    catAvg: catAvg
                                };
                            }) : []}
                        />
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
