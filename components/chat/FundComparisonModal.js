'use client';

import { X, Check } from 'lucide-react';

export default function FundComparisonModal({ open, onClose, selectedFunds }) {
    if (!open) return null;

    if (selectedFunds.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-6xl bg-white dark:bg-gray-950 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-gray-950/80 backdrop-blur sticky top-0 z-20">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Fund Comparison</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                            Comparing {selectedFunds.length} selected funds
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-auto custom-scrollbar">
                    <div className="min-w-max">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 border-b border-gray-100 dark:border-gray-800 min-w-[200px] sticky left-0 bg-white dark:bg-gray-950 z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Feature</div>
                                    </th>
                                    {selectedFunds.map((fund, i) => (
                                        <th key={i} className="p-4 border-b border-gray-100 dark:border-gray-800 min-w-[250px]">
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Fund {i + 1}</div>
                                            <div className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2" title={fund.fund_name}>
                                                {fund.fund_name}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {/* Category */}
                                <tr>
                                    <td className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider sticky left-0 bg-white dark:bg-gray-950 z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">Category</td>
                                    {selectedFunds.map((fund, i) => (
                                        <td key={i} className="p-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {fund.category}
                                        </td>
                                    ))}
                                </tr>
                                {/* Risk Level */}
                                <tr>
                                    <td className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider sticky left-0 bg-white dark:bg-gray-950 z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">Risk Level</td>
                                    {selectedFunds.map((fund, i) => (
                                        <td key={i} className="p-4 text-sm font-medium">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
                                                ${fund.risk_level?.toLowerCase() === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    fund.risk_level?.toLowerCase() === 'moderate' || fund.risk_level?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                                                {fund.risk_level}
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                                {/* Suitability Score */}
                                <tr>
                                    <td className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider sticky left-0 bg-white dark:bg-gray-950 z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">Match Score</td>
                                    {selectedFunds.map((fund, i) => (
                                        <td key={i} className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm font-bold text-blue-600">
                                                    {fund.suitability_score?.toFixed(0)}%
                                                </div>
                                                <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${fund.suitability_score}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                                {/* NAV */}
                                <tr>
                                    <td className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider sticky left-0 bg-white dark:bg-gray-950 z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">Latest NAV</td>
                                    {selectedFunds.map((fund, i) => (
                                        <td key={i} className="p-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                                            {fund.metrics?.nav ? `₹${Number(fund.metrics.nav).toFixed(4)}` : '—'}
                                            <div className="text-[9px] text-gray-400">{fund.nav_date}</div>
                                        </td>
                                    ))}
                                </tr>
                                {/* Key Highlights */}
                                <tr>
                                    <td className="p-4 font-bold text-gray-500 text-xs uppercase tracking-wider sticky left-0 bg-white dark:bg-gray-950 z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">Highlights</td>
                                    {selectedFunds.map((fund, i) => (
                                        <td key={i} className="p-4 align-top">
                                            <div className="space-y-1">
                                                {fund.key_highlights && fund.key_highlights.map((h, j) => (
                                                    <div key={j} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                                        <Check className="w-3 h-3 text-green-500" />
                                                        <span>{h}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                        height: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #e2e8f0;
                        border-radius: 10px;
                    }
                    @media (prefers-color-scheme: dark) {
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: #334155;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
}
