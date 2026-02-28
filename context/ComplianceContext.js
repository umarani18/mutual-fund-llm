'use client';

import React, { createContext, useContext, useState } from 'react';

const ComplianceContext = createContext(null);

export const ALL_RULES = [
    { id: 1, name: 'Active Status', desc: 'Exclude merged/wound-up funds', mandatory: true },
    { id: 2, name: 'Category Purity', desc: 'Strict SEBI category isolation', mandatory: false },
    { id: 3, name: 'Plan Normalization', desc: 'Isolate Direct/Regular Growth/IDCW', mandatory: false },
    { id: 4, name: 'History Consistency', desc: 'Minimum 3/5/10Y data validation', mandatory: true },
    { id: 5, name: 'Period Alignment', desc: 'Cross-metric time window matching', mandatory: true },
    { id: 6, name: 'NAV Freshness', desc: 'Flag or exclude stale valuations', mandatory: false },
    { id: 7, name: 'Null Exclusion', desc: 'Drop funds with missing critical math', mandatory: true },
    { id: 8, name: 'AUM Eligibility', desc: 'Filter by Assets Under Management', mandatory: false, restricted: true },
    { id: 9, name: 'Category Baselines', desc: 'Compute relative statistical means', mandatory: false },
    { id: 10, name: 'Stable Sorting', desc: 'Multi-level deterministic ranking', mandatory: false, restricted: true },
    { id: 11, name: 'Benchmark Integrity', desc: 'SEBI-mandated index mapping', mandatory: false, restricted: true },
    { id: 12, name: 'Drawdown Filter', desc: 'Maximum allowable loss threshold', mandatory: true },
    { id: 13, name: 'Volatility Bands', desc: 'Data-driven risk classification', mandatory: false },
    { id: 14, name: 'Survivorship Bias', desc: 'Historical continuity control', mandatory: false, restricted: true },
    { id: 15, name: 'Ranking Normalization', desc: 'Local subset score scaling (0-100)', mandatory: false, restricted: true },
    { id: 16, name: 'Advisory Blocker', desc: 'Neutralize investment recommendations', mandatory: true },
    { id: 17, name: 'Conflict Detection', desc: 'Early warning for filter logical errors', mandatory: true },
];

export const COMPLIANCE_STACKS = {
    ESSENTIAL: {
        id: 'essential',
        label: 'Institutional Lite',
        modules: [1, 4, 5, 7, 12, 16, 17],
        description: 'Mandatory rules: Active Status, History, Alignment.'
    },
    STRICT: {
        id: 'strict',
        label: 'Strict Compliance',
        modules: [1, 4, 5, 7, 12, 16, 17, 2, 3],
        description: 'Essential + Category and Plan isolation (AUM Locked).'
    },
    FULL_STACK: {
        id: 'full',
        label: 'Institutional Full',
        modules: ALL_RULES.filter(r => !r.restricted).map(r => r.id),
        description: 'Global Stack: All available rules excluding restricted modules.'
    },
    CUSTOM: {
        id: 'custom',
        label: 'Custom Sandbox',
        modules: [1, 4, 5, 7, 12, 16, 17],
        description: 'Granularly select and deselect optional rules.'
    }
};

export const ComplianceProvider = ({ children }) => {
    const [selectedStack, setSelectedStack] = useState(COMPLIANCE_STACKS.ESSENTIAL);
    const [customModules, setCustomModules] = useState(COMPLIANCE_STACKS.ESSENTIAL.modules);

    const changeStack = (stackId) => {
        const stack = Object.values(COMPLIANCE_STACKS).find(s => s.id === stackId);
        if (stack) {
            setSelectedStack(stack);
            setCustomModules(stack.modules);
        }
    };

    const toggleRule = (ruleId) => {
        const rule = ALL_RULES.find(r => r.id === ruleId);
        if (!rule || rule.mandatory) return;

        setSelectedStack(COMPLIANCE_STACKS.CUSTOM);
        setCustomModules(prev => {
            if (prev.includes(ruleId)) {
                return prev.filter(id => id !== ruleId);
            } else {
                return [...prev, ruleId];
            }
        });
    };

    const value = {
        selectedStack,
        changeStack,
        customModules,
        toggleRule,
        ALL_RULES,
        COMPLIANCE_STACKS,
        effectiveModules: selectedStack.id === 'custom' ? customModules : selectedStack.modules
    };

    return (
        <ComplianceContext.Provider value={value}>
            {children}
        </ComplianceContext.Provider>
    );
};

export const useCompliance = () => {
    const context = useContext(ComplianceContext);
    if (!context) {
        throw new Error('useCompliance must be used within a ComplianceProvider');
    }
    return context;
};
