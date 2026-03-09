'use client';

import { useMemo, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { analyticsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';

const METRIC_OPTIONS = [
    { value: 'aum', label: 'AUM (Cr)' },
    { value: 'expense_ratio', label: 'Expense Ratio' },
    { value: 'cagr', label: 'CAGR' },
    { value: 'sharpe', label: 'Sharpe' },
    { value: 'std_dev', label: 'Std Dev' },
    { value: 'max_drawdown', label: 'Max Drawdown' },
    { value: 'return_1y', label: 'Return 1Y' },
    { value: 'return_3y', label: 'Return 3Y' },
    { value: 'return_5y', label: 'Return 5Y' },
];

const OPS = ['>', '<', '>=', '<=', '=', 'between'];

const DEFAULT_RULE = { metric: 'aum', operator: '>', value: '500' };

const getMetricLabel = (metric) => METRIC_OPTIONS.find((m) => m.value === metric)?.label || metric;

export default function ScreenerPage() {
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('cagr');
    const [sortOrder, setSortOrder] = useState('desc');
    const [limit, setLimit] = useState(20);
    const [rules, setRules] = useState([{ ...DEFAULT_RULE }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const cagrHeaderLabel = result?.observability?.cagr_period === 'since_inception'
        ? 'CAGR (Since Inception)'
        : 'CAGR';
    const cagrDescription = result?.observability?.cagr_definition
        || 'CAGR here is annualized over full available history, not 1Y/3Y/5Y point returns.';

    const fmtPct = (v) => (typeof v === 'number' ? `${(v * 100).toFixed(2)}%` : '-');
    const fmtNum = (v, digits = 2) => (typeof v === 'number' ? v.toFixed(digits) : '-');
    const fmtAum = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '-');

    const addRule = () => setRules((prev) => [...prev, { metric: 'cagr', operator: '>', value: '' }]);
    const removeRule = (idx) => setRules((prev) => prev.filter((_, i) => i !== idx));
    const updateRule = (idx, key, value) => {
        setRules((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));
    };

    const resetFilters = () => {
        setCategory('');
        setSortBy('cagr');
        setSortOrder('desc');
        setLimit(20);
        setRules([{ ...DEFAULT_RULE }]);
        setError('');
        setResult(null);
    };

    const payload = useMemo(() => {
        const transformed = rules
            .filter((r) => r.metric && r.operator)
            .map((r) => {
                if (r.operator === 'between') {
                    const [lo, hi] = String(r.value || '').split(',').map((v) => Number(v.trim()));
                    if (Number.isNaN(lo) || Number.isNaN(hi)) return null;
                    return { metric: r.metric, operator: r.operator, value_min: lo, value_max: hi };
                }
                if (String(r.value).trim() === '' || Number.isNaN(Number(r.value))) return null;
                return { metric: r.metric, operator: r.operator, value: Number(r.value) };
            })
            .filter(Boolean);

        return {
            category: category || null,
            rules: transformed,
            limit: Number(limit) || 20,
            sort_by: sortBy || null,
            sort_order: sortOrder,
        };
    }, [category, rules, limit, sortBy, sortOrder]);

    const runScreen = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await analyticsApi.screenFunds(payload);
            setResult(res);
        } catch (e) {
            setError(e?.message || 'Screening failed');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">Advanced Screener</h1>
                            <p className="text-xs text-muted-foreground">Deterministic analytics filter engine</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={resetFilters} className="gap-2">
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </Button>
                            <Button onClick={runScreen} disabled={loading} className="gap-2">
                                <Filter className="w-4 h-4" />
                                {loading ? 'Running...' : 'Run Screen'}
                            </Button>
                        </div>
                    </div>

                    <Card className="p-4 md:p-5 space-y-5 border-border/60">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-primary" />
                            <h2 className="text-sm font-extrabold tracking-wide uppercase">Filters & Sorting</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="space-y-1">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Category</div>
                                <Input
                                    placeholder="e.g. Equity"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sort By</div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm w-full"
                                >
                                    {METRIC_OPTIONS.map((m) => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Order</div>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="h-10 rounded-md border border-input bg-background px-3 text-sm w-full"
                                >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Rows</div>
                                <Input
                                    type="number"
                                    min={1}
                                    max={500}
                                    value={limit}
                                    onChange={(e) => setLimit(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            {rules.map((rule, idx) => (
                                <div key={idx} className="rounded-md border border-border/60 p-3">
                                    <div className="mb-2 flex items-center justify-between">
                                        <Badge variant="outline">Rule {idx + 1}</Badge>
                                        <Button variant="ghost" size="icon" onClick={() => removeRule(idx)} className="h-8 w-8">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                                        <div className="md:col-span-5">
                                            <select
                                                value={rule.metric}
                                                onChange={(e) => updateRule(idx, 'metric', e.target.value)}
                                                className="h-10 rounded-md border border-input bg-background px-3 text-sm w-full"
                                            >
                                                {METRIC_OPTIONS.map((m) => (
                                                    <option key={m.value} value={m.value}>{m.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <select
                                                value={rule.operator}
                                                onChange={(e) => updateRule(idx, 'operator', e.target.value)}
                                                className="h-10 rounded-md border border-input bg-background px-3 text-sm w-full"
                                            >
                                                {OPS.map((op) => <option key={op} value={op}>{op}</option>)}
                                            </select>
                                        </div>
                                        <div className="md:col-span-5">
                                            <Input
                                                placeholder={rule.operator === 'between' ? 'min,max' : 'value'}
                                                value={rule.value ?? ''}
                                                onChange={(e) => updateRule(idx, 'value', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addRule} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Add Rule
                            </Button>
                        </div>
                    </Card>

                    {error && (
                        <Card className="p-4 border-destructive/30 bg-destructive/5">
                            <div className="text-sm text-destructive">{error}</div>
                        </Card>
                    )}

                    {result && (
                        <Card className="p-4 space-y-3 border-border/60">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline">Matches: {result.total_matches ?? result.count ?? 0}</Badge>
                                <Badge variant="outline">Returned: {result.count ?? 0}</Badge>
                                <Badge variant="outline">Sort: {getMetricLabel(sortBy)} ({sortOrder})</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">{cagrDescription}</div>

                            <div className="overflow-x-auto rounded-md border border-border/60">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/40 sticky top-0 z-10">
                                        <tr className="border-b">
                                            <th className="py-2 px-3 text-left font-bold">Scheme</th>
                                            <th className="py-2 px-3 text-left font-bold">Category</th>
                                            <th className="py-2 px-3 text-right font-bold">AUM</th>
                                            <th className="py-2 px-3 text-right font-bold">Return 1Y</th>
                                            <th className="py-2 px-3 text-right font-bold">Return 3Y</th>
                                            <th className="py-2 px-3 text-right font-bold">Return 5Y</th>
                                            <th className="py-2 px-3 text-right font-bold">{cagrHeaderLabel}</th>
                                            <th className="py-2 px-3 text-right font-bold">Expense</th>
                                            <th className="py-2 px-3 text-right font-bold">Sharpe</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(result.funds || []).length === 0 && (
                                            <tr>
                                                <td className="py-6 text-center text-muted-foreground" colSpan={9}>
                                                    No funds matched these filters. Try broadening criteria.
                                                </td>
                                            </tr>
                                        )}
                                        {(result.funds || []).map((f, idx) => (
                                            <tr key={f.scheme_code} className={`border-b last:border-0 hover:bg-muted/30 ${idx % 2 ? 'bg-muted/10' : ''}`}>
                                                <td className="py-2 px-3 font-medium">{f.scheme_name}</td>
                                                <td className="py-2 px-3">{f.category || '-'}</td>
                                                <td className="py-2 px-3 text-right">{fmtAum(f.aum)}</td>
                                                <td className="py-2 px-3 text-right">{fmtPct(f.return_1y)}</td>
                                                <td className="py-2 px-3 text-right">{fmtPct(f.return_3y)}</td>
                                                <td className="py-2 px-3 text-right">{fmtPct(f.return_5y)}</td>
                                                <td className="py-2 px-3 text-right">{fmtPct(f.cagr)}</td>
                                                <td className="py-2 px-3 text-right">{fmtNum(f.expense_ratio, 2)}</td>
                                                <td className="py-2 px-3 text-right">{fmtNum(f.sharpe, 3)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
