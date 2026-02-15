'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RecommendationsList({ recommendations }) {
    const [expandedId, setExpandedId] = useState(null);

    const getRiskStyles = (level) => {
        switch (level?.toLowerCase()) {
            case 'low':
                return {
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-100',
                    text: 'text-emerald-700',
                    badge: 'bg-emerald-100 text-emerald-800',
                    gradient: 'from-emerald-500 to-teal-600'
                };
            case 'medium':
                return {
                    bg: 'bg-amber-50',
                    border: 'border-amber-100',
                    text: 'text-amber-700',
                    badge: 'bg-amber-100 text-amber-800',
                    gradient: 'from-amber-400 to-orange-500'
                };
            case 'high':
                return {
                    bg: 'bg-rose-50',
                    border: 'border-rose-100',
                    text: 'text-rose-700',
                    badge: 'bg-rose-100 text-rose-800',
                    gradient: 'from-rose-500 to-red-600'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    border: 'border-gray-100',
                    text: 'text-gray-700',
                    badge: 'bg-gray-100 text-gray-800',
                    gradient: 'from-gray-500 to-slate-600'
                };
        }
    };

    const getCategoryIcon = (category) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('equity')) return '📈';
        if (cat.includes('debt')) return '📜';
        if (cat.includes('hybrid')) return '⚖️';
        if (cat.includes('liquid')) return '💧';
        if (cat.includes('gilt')) return '🏛️';
        return '📊';
    };

    return (
        <div className="grid grid-cols-1 gap-6 w-full max-w-4xl mx-auto">
            {recommendations.map((rec, index) => {
                const styles = getRiskStyles(rec.risk_level);
                const isExpanded = expandedId === rec.rank;

                return (
                    <div
                        key={rec.rank}
                        className={`group relative overflow-hidden flex flex-col transition-all duration-500 rounded-3xl border shadow-sm hover:shadow-xl hover:translate-y-[-2px] ${isExpanded
                            ? `ring-2 ring-indigo-500 ring-offset-2 ${styles.bg} border-transparent`
                            : 'bg-white border-gray-100'
                            }`}
                    >
                        <div className={`absolute -top-2 -left-2 w-10 h-10 rounded-2xl bg-gradient-to-br ${styles.gradient} text-white flex items-center justify-center font-black text-sm shadow-lg z-10 transform -rotate-12 group-hover:rotate-0 transition-transform`}>
                            #{rec.rank}
                        </div>

                        <div
                            onClick={() => setExpandedId(isExpanded ? null : rec.rank)}
                            className="p-6 cursor-pointer select-none"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{getCategoryIcon(rec.category)}</span>
                                        <h3 className="text-lg font-black text-gray-900 leading-tight">
                                            {rec.fund_name}
                                        </h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${styles.badge}`}>
                                            {rec.risk_level} Risk
                                        </span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-indigo-50 text-indigo-700">
                                            {rec.category}
                                        </span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-gray-100 text-gray-600">
                                            {rec.fund_code}
                                        </span>
                                        {rec.nav_date && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100/50">
                                                Updated: {rec.nav_date}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-[0.15em] leading-none mb-1">Match Core</span>
                                        <span className="text-2xl font-black text-gray-900 leading-none">
                                            {rec.suitability_score?.toFixed(0)}<span className="text-xs text-indigo-500">%</span>
                                        </span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center p-1">
                                        <div
                                            className="h-full rounded-full bg-indigo-600 transition-all duration-1000"
                                            style={{ width: `${rec.suitability_score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {!isExpanded && rec.reason && (
                                <p className="mt-4 text-sm text-gray-500 line-clamp-2 leading-relaxed italic">
                                    &ldquo;{rec.reason}&rdquo;
                                </p>
                            )}
                        </div>

                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-6 pb-8 space-y-8 border-t border-gray-100/50 pt-6">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center space-x-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                        <span>Learning Insight</span>
                                    </h4>
                                    <p className="text-[15px] text-gray-700 leading-relaxed font-medium">
                                        {rec.reason}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl shadow-xl text-white">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-4 text-center">Core Strengths</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {rec.key_highlights && rec.key_highlights.map((h, i) => (
                                            <div key={i} className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10">
                                                <span className="text-indigo-400">✦</span>
                                                <span className="text-sm font-medium text-indigo-50">{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Link
                                        href={`/assistant/${encodeURIComponent(rec.fund_code)}/details`}
                                        className="px-4 py-2 text-xs font-bold text-indigo-600 uppercase tracking-widest border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-colors mr-3"
                                    >
                                        View More Details
                                    </Link>
                                    <button
                                        onClick={() => setExpandedId(null)}
                                        className="px-6 py-2.5 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
                                    >
                                        Close Detail
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
