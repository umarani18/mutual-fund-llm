'use client';

import { useEffect, useState, useMemo, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fundApi } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Info, Activity, ShieldCheck, BarChart2, Check, ExternalLink, TrendingUp, Calendar } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';

// --- Colors ---
const CHART_COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#84cc16", // Lime
];

// --- Components ---

function ComparisonChart({ funds }) {
    const containerRef = useRef(null);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [width, setWidth] = useState(0);
    const [range, setRange] = useState('1Y'); // Default to 1 Year
    const height = 320;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };

    useEffect(() => {
        if (containerRef.current) {
            setWidth(containerRef.current.offsetWidth);
        }
        const handleResize = () => setWidth(containerRef.current?.offsetWidth || 0);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const chartData = useMemo(() => {
        if (!funds || funds.length === 0) return { series: [], dates: [] };

        const now = new Date();
        const startDate = new Date();

        if (range === '1Y') startDate.setFullYear(now.getFullYear() - 1);
        else if (range === '3Y') startDate.setFullYear(now.getFullYear() - 3);
        else if (range === '5Y') startDate.setFullYear(now.getFullYear() - 5);
        else if (range === 'Max') startDate.setFullYear(now.getFullYear() - 50);

        const series = funds.map((fund, idx) => {
            const history = fund.nav_history || [];
            const filtered = history.filter(d => new Date(d.nav_date) >= startDate)
                .sort((a, b) => new Date(a.nav_date).getTime() - new Date(b.nav_date).getTime());

            if (filtered.length === 0) return null;

            const startNav = filtered[0].nav_value;
            const points = filtered.map(d => ({
                date: d.nav_date,
                val: ((d.nav_value - startNav) / startNav) * 100,
                raw: d.nav_value
            }));

            return {
                id: fund.fund_master.scheme_code,
                name: fund.fund_master.scheme_name,
                color: CHART_COLORS[idx % CHART_COLORS.length],
                data: points
            };
        }).filter(s => s !== null);

        if (series.length === 0) return { series: [], dates: [] };

        const dateSet = new Set();
        series.forEach(s => {
            s.data.forEach(p => dateSet.add(p.date));
        });

        const allDates = Array.from(dateSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        return { series, dates: allDates };
    }, [funds, range]);

    const { min, max } = useMemo(() => {
        let min = 0;
        let max = 0;
        chartData.series.forEach(s => {
            s.data.forEach(p => {
                if (p.val < min) min = p.val;
                if (p.val > max) max = p.val;
            });
        });
        return { min: min - 5, max: max + 5 };
    }, [chartData]);

    const getX = (dateStr) => {
        if (!width) return 0;
        const index = chartData.dates.indexOf(dateStr);
        if (index === -1) return 0;
        return padding.left + (index / (chartData.dates.length - 1)) * (width - padding.left - padding.right);
    };

    const getY = (val) => {
        const rangeVal = max - min || 1;
        return (height - padding.bottom) - ((val - min) / rangeVal) * (height - padding.top - padding.bottom);
    };

    const handleMouseMove = (e) => {
        if (!containerRef.current || chartData.dates.length === 0) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;

        const chartWidth = width - padding.left - padding.right;
        const relativeX = x - padding.left;
        let idx = Math.round((relativeX / chartWidth) * (chartData.dates.length - 1));

        idx = Math.max(0, Math.min(idx, chartData.dates.length - 1));
        setHoverIndex(idx);
    };

    if (chartData.series.length === 0) return <div className="h-64 flex items-center justify-center text-muted-foreground">Not enough data for chart</div>;

    const rangeLabel = range === 'Max' ? 'all time' : `last ${range}`;

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 border-border/60 overflow-hidden" ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={() => setHoverIndex(null)}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-black tracking-tight">Performance Comparison</h3>
                    <p className="text-xs text-muted-foreground">Normalized percentage return over {rangeLabel}</p>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className="flex bg-muted/30 p-1 rounded-lg border border-border/40">
                        {['1Y', '3Y', '5Y', 'Max'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={cn(
                                    "px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md transition-all",
                                    range === r
                                        ? "bg-background text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 border-y border-border/40 py-3 bg-muted/5 -mx-6 px-6">
                {chartData.series.map(s => (
                    <div key={s.id} className="flex items-center gap-1.5 min-w-fit">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[200px]" title={s.name}>
                            {s.name}
                        </span>
                    </div>
                ))}
            </div>

            <div className="relative h-[320px] w-full cursor-crosshair">
                <svg width={width} height={height} className="overflow-visible">
                    {[0, 0.25, 0.5, 0.75, 1].map(t => {
                        const val = min + t * (max - min);
                        const y = getY(val);
                        return (
                            <g key={t}>
                                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
                                <text x={padding.left - 5} y={y + 3} textAnchor="end" className="text-[10px] fill-muted-foreground font-mono">
                                    {val.toFixed(0)}%
                                </text>
                            </g>
                        );
                    })}

                    {min < 0 && max > 0 && (
                        <line
                            x1={padding.left} y1={getY(0)}
                            x2={width - padding.right} y2={getY(0)}
                            stroke="currentColor" strokeOpacity="0.3" strokeWidth="1"
                        />
                    )}

                    {chartData.series.map(s => {
                        const d = chartData.dates.map((date, i) => {
                            const point = s.data.find(p => p.date === date);
                            if (!point) return null;
                            return [getX(date), getY(point.val)];
                        }).filter(Boolean);

                        if (d.length === 0) return null;

                        const pathStr = "M" + d.map(p => `${p[0]},${p[1]}`).join(" L");

                        return (
                            <motion.path
                                key={s.id}
                                d={pathStr}
                                fill="none"
                                stroke={s.color}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        );
                    })}

                    {hoverIndex !== null && (
                        <g>
                            <line
                                x1={getX(chartData.dates[hoverIndex])} y1={padding.top}
                                x2={getX(chartData.dates[hoverIndex])} y2={height - padding.bottom}
                                stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-foreground/50"
                            />
                            {chartData.series.map(s => {
                                const pt = s.data.find(p => p.date === chartData.dates[hoverIndex]);
                                if (!pt) return null;
                                return (
                                    <circle
                                        key={s.id}
                                        cx={getX(pt.date)} cy={getY(pt.val)}
                                        r="4" fill="var(--background)" stroke={s.color} strokeWidth="2"
                                    />
                                );
                            })}
                        </g>
                    )}
                </svg>

                {hoverIndex !== null && (
                    <div
                        className="absolute bg-background/95 backdrop-blur-md border border-border/50 p-3 rounded-lg shadow-xl z-50 pointer-events-none min-w-[200px]"
                        style={{
                            left: Math.min(width - 220, Math.max(0, getX(chartData.dates[hoverIndex]) + 15)),
                            top: 20
                        }}
                    >
                        <div className="text-[10px] font-black text-muted-foreground mb-2 border-b border-border/40 pb-1.5 flex justify-between items-center">
                            <span>{new Date(chartData.dates[hoverIndex]).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                            <span className="bg-muted px-1.5 rounded">DATA POINT</span>
                        </div>
                        <div className="space-y-2">
                            {chartData.series.map(s => {
                                const pt = s.data.find(p => p.date === chartData.dates[hoverIndex]);
                                if (!pt) return null;
                                return (
                                    <div key={s.id} className="flex justify-between items-center gap-4 text-[11px]">
                                        <div className="flex items-center gap-2 max-w-[140px]">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                                            <span className="truncate font-bold opacity-80">{s.name}</span>
                                        </div>
                                        <div className={cn(
                                            "font-black font-mono",
                                            pt.val >= 0 ? "text-emerald-500" : "text-rose-500"
                                        )}>
                                            {pt.val > 0 ? '+' : ''}{pt.val.toFixed(2)}%
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function MiniHistoryChart({ history }) {
    const width = 280;
    const height = 100;
    const padding = { top: 10, right: 10, bottom: 20, left: 45 };

    const data = useMemo(() => {
        if (!history || history.length === 0) return { points: [], min: 0, max: 0, dates: [] };

        const now = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);

        const recent = history.filter(d => new Date(d.nav_date) >= oneYearAgo)
            .sort((a, b) => new Date(a.nav_date).getTime() - new Date(b.nav_date).getTime());

        if (recent.length === 0) return { points: [], min: 0, max: 0, dates: [] };

        const values = recent.map(d => d.nav_value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min || 1;

        const points = recent.map((d, i) => ({
            x: padding.left + (i / (recent.length - 1)) * (width - padding.left - padding.right),
            y: padding.top + (height - padding.top - padding.bottom) - ((d.nav_value - min) / range) * (height - padding.top - padding.bottom),
            value: d.nav_value,
            date: d.nav_date
        }));

        return { points, min, max, dates: recent.map(d => d.nav_date) };
    }, [history]);

    if (data.points.length === 0) return <div className="h-20 w-full bg-muted/20 rounded flex items-center justify-center text-[10px] text-muted-foreground">No History</div>;

    const start = data.points[0].value;
    const end = data.points[data.points.length - 1].value;
    const isPositive = end >= start;
    const color = isPositive ? "#10b981" : "#f43f5e";
    const gradientId = `grad-${Math.random()}`;

    const pathD = data.points.reduce((acc, p, i) => {
        if (i === 0) return `M${p.x},${p.y}`;
        const prev = data.points[i - 1];
        const cp1x = prev.x + (p.x - prev.x) / 3;
        const cp2x = p.x - (p.x - prev.x) / 3;
        return acc + ` C${cp1x},${prev.y} ${cp2x},${p.y} ${p.x},${p.y}`;
    }, '');

    // Get first and last dates for X-axis
    const firstDate = new Date(data.dates[0]);
    const lastDate = new Date(data.dates[data.dates.length - 1]);

    return (
        <div className="w-full h-28 relative group">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Y-axis line */}
                <line
                    x1={padding.left}
                    y1={padding.top}
                    x2={padding.left}
                    y2={height - padding.bottom}
                    stroke="#000000"
                    strokeWidth="1"
                    strokeOpacity="0.2"
                />

                {/* X-axis line */}
                <line
                    x1={padding.left}
                    y1={height - padding.bottom}
                    x2={width - padding.right}
                    y2={height - padding.bottom}
                    stroke="#000000"
                    strokeWidth="1"
                    strokeOpacity="0.2"
                />

                {/* Y-axis labels */}
                <text x={padding.left - 5} y={padding.top + 5} textAnchor="end" style={{ fontSize: '8px', fill: '#888', fontWeight: 500 }}>
                    ₹{data.max.toFixed(0)}
                </text>
                <text x={padding.left - 5} y={height - padding.bottom} textAnchor="end" style={{ fontSize: '8px', fill: '#888', fontWeight: 500 }}>
                    ₹{data.min.toFixed(0)}
                </text>

                {/* X-axis labels */}
                <text x={padding.left} y={height - 2} textAnchor="start" style={{ fontSize: '7px', fill: '#888', fontWeight: 500 }}>
                    {firstDate.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                </text>
                <text x={width - padding.right} y={height - 2} textAnchor="end" style={{ fontSize: '7px', fill: '#888', fontWeight: 500 }}>
                    {lastDate.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                </text>

                {/* Chart path */}
                <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d={`${pathD} L${width - padding.right},${height - padding.bottom} L${padding.left},${height - padding.bottom} Z`} fill={`url(#${gradientId})`} stroke="none" />
            </svg>
            <div className="absolute top-0 right-0 bg-background/80 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-bold border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {isPositive ? '+' : ''}{((end - start) / start * 100).toFixed(1)}%
            </div>
        </div>
    );
}

const MetricRow = ({ label, icon: Icon = null, children, className = "" }) => (
    <>
        <div className={cn("p-4 flex items-center gap-2 bg-muted/5 sticky left-0 z-10 border-r border-border/40 font-bold text-xs text-muted-foreground uppercase tracking-wider backdrop-blur-sm", className)}>
            {Icon && <Icon className="w-3.5 h-3.5 opacity-70" />}
            {label}
        </div>
        {children}
    </>
);

const SectionHeader = ({ title, icon: Icon }) => (
    <div className="col-span-full bg-muted/20 p-3 px-6 flex items-center gap-2 border-y border-border/40 mt-4 mb-0 first:mt-0">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-xs font-black uppercase tracking-widest text-foreground">{title}</span>
    </div>
);

function CompareFundsPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [fundsData, setFundsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const codes = searchParams.get('codes');
        if (!codes) {
            setError('No funds selected');
            setLoading(false);
            return;
        }

        const fundCodes = codes.split(',');

        async function fetchAllFunds() {
            setLoading(true);
            try {
                const results = await Promise.all(
                    fundCodes.map(code => fundApi.getFundMetrics(code).catch(e => null))
                );

                const validResults = results.filter(r => r !== null);
                if (validResults.length === 0) setError('Failed to fetch data');
                else setFundsData(validResults);
            } catch (err) {
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        }
        fetchAllFunds();
    }, [searchParams]);

    const getReturnColor = (val) => {
        if (!val) return "text-muted-foreground";
        return val > 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500";
    };

    const getRiskBadge = (level) => {
        const l = level?.toLowerCase() || '';
        if (l === 'high' || l === 'very high') return "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20";
        if (l.includes('moderate')) return "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20";
        return "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20";
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Comparing Assets</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-4">
                <Info className="w-10 h-10 text-destructive mx-auto" />
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-4 md:p-8">
            <div className="max-w-[1600px] mx-auto space-y-6">
                <div className="flex items-center justify-between sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b border-border/40">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 text-muted-foreground hover:text-foreground">
                            <ChevronLeft className="h-4 w-4" /> Back
                        </Button>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">Fund Comparison</h1>
                            <p className="text-xs text-muted-foreground font-medium">Analyzing {fundsData.length} selected assets</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto pb-6 custom-scrollbar">
                    <div
                        className="grid gap-0 divide-x divide-border/40 border border-border/40 rounded-2xl bg-card shadow-sm overflow-hidden min-w-max"
                        style={{
                            gridTemplateColumns: `220px repeat(${fundsData.length}, minmax(320px, 1fr))`
                        }}
                    >
                        <div className="bg-muted/10 sticky left-0 z-20 flex flex-col justify-end p-6 border-r border-border/40 backdrop-blur-md">
                            <div className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60">
                                Asset Overview
                            </div>
                        </div>

                        {fundsData.map((data, idx) => (
                            <div key={idx} className="p-6 relative group bg-gradient-to-b from-transparent to-muted/5">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                        onClick={() => router.push(`/assistant/${data.fund_master.scheme_code}/details`)}
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    <Badge variant="outline" className="text-[10px] font-bold px-2 py-0.5 bg-background/50 backdrop-blur">
                                        {data.fund_master.category}
                                    </Badge>
                                    <h3 className="text-lg font-black leading-snug line-clamp-2" title={data.fund_master.scheme_name} style={{ color: CHART_COLORS[idx % CHART_COLORS.length] }}>
                                        {data.fund_master.scheme_name}
                                    </h3>
                                    <div className="flex items-baseline gap-1.5 pt-1">
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">NAV</span>
                                        <span className="text-xl font-black font-mono tracking-tight">₹{Number(data.fund_master.nav).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <SectionHeader title="Performance Trajectory" icon={TrendingUp} />

                        <MetricRow label="1Y Trend Analysis" icon={Activity}>
                            {fundsData.map((data, idx) => (
                                <div key={idx} className="p-4 flex items-center justify-center bg-card/50">
                                    <MiniHistoryChart history={data.nav_history} />
                                </div>
                            ))}
                        </MetricRow>

                        <MetricRow label="1 Year Return">
                            {fundsData.map((data, idx) => (
                                <div key={idx} className="p-4 flex items-center text-sm font-bold">
                                    <span className={getReturnColor(data.fund_metrics.return_1y)}>
                                        {(data.fund_metrics.return_1y * 100).toFixed(2)}%
                                    </span>
                                </div>
                            ))}
                        </MetricRow>

                        <MetricRow label="3 Year CAGR">
                            {fundsData.map((data, idx) => (
                                <div key={idx} className="p-4 flex items-center text-sm font-bold">
                                    <span className={getReturnColor(data.fund_metrics.return_3y)}>
                                        {(data.fund_metrics.return_3y * 100).toFixed(2)}%
                                    </span>
                                </div>
                            ))}
                        </MetricRow>

                        <MetricRow label="5 Year CAGR">
                            {fundsData.map((data, idx) => (
                                <div key={idx} className="p-4 flex items-center text-sm font-bold">
                                    <span className={getReturnColor(data.fund_metrics.return_5y)}>
                                        {(data.fund_metrics.return_5y * 100).toFixed(2)}%
                                    </span>
                                </div>
                            ))}
                        </MetricRow>

                        <SectionHeader title="Risk Profile" icon={ShieldCheck} />

                        <MetricRow label="Risk Rating">
                            {fundsData.map((data, idx) => (
                                <div key={idx} className="p-4 flex items-center">
                                    <Badge variant="outline" className={cn("text-[10px] uppercase font-bold border", getRiskBadge(data.fund_master.risk_level))}>
                                        {data.fund_master.risk_level}
                                    </Badge>
                                </div>
                            ))}
                        </MetricRow>

                        <MetricRow label="Volatility (Std Dev)" icon={Activity}>
                            {fundsData.map((data, idx) => (
                                <div key={idx} className="p-4 flex items-center text-sm font-medium font-mono text-muted-foreground">
                                    {data.fund_metrics.std_dev?.toFixed(2) || '—'}
                                </div>
                            ))}
                        </MetricRow>

                        <MetricRow label="Sharpe Ratio">
                            {fundsData.map((data, idx) => (
                                <div key={idx} className="p-4 flex items-center text-sm font-medium font-mono text-muted-foreground">
                                    {data.fund_metrics.sharpe?.toFixed(2) || '—'}
                                </div>
                            ))}
                        </MetricRow>

                        <MetricRow label="Jensen's Alpha">
                            {fundsData.map((data, idx) => (
                                <div key={idx} className="p-4 flex items-center text-sm font-medium">
                                    {data.fund_metrics.alpha ? (
                                        <Badge variant="secondary" className={cn("font-mono", data.fund_metrics.alpha > 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30" : "")}>
                                            {(data.fund_metrics.alpha * 100).toFixed(2)}%
                                        </Badge>
                                    ) : '—'}
                                </div>
                            ))}
                        </MetricRow>

                        <MetricRow label="Max Drawdown">
                            {fundsData.map((data, idx) => (
                                <div key={idx} className="p-4 flex items-center text-sm font-medium text-rose-600 font-mono">
                                    {data.fund_metrics.max_drawdown ? (data.fund_metrics.max_drawdown * 100).toFixed(2) + '%' : '—'}
                                </div>
                            ))}
                        </MetricRow>

                        <SectionHeader title="Fund Essentials" icon={Info} />

                        <MetricRow label="Fund Manager">
                            {fundsData.map((data, idx) => (
                                <div key={idx} className="p-4 flex items-center text-xs font-medium text-muted-foreground leading-relaxed">
                                    {data.fund_master.fund_manager || '—'}
                                </div>
                            ))}
                        </MetricRow>

                        <MetricRow label="Min Investment">
                            {fundsData.map((data, idx) => (
                                <div key={idx} className="p-4 flex items-center text-sm font-bold text-foreground">
                                    ₹{data.fund_master.min_sip || '—'}
                                </div>
                            ))}
                        </MetricRow>
                    </div>
                </div>

                <div className="pt-2">
                    <ComparisonChart funds={fundsData} />
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 5px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                @media (prefers-color-scheme: dark) {
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #334155;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #475569;
                    }
                }
            `}</style>
        </div>
    );
}

export default function CompareFundsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Loading...</div>
            </div>
        }>
            <CompareFundsPageContent />
        </Suspense>
    );
}
