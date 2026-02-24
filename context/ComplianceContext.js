'use client';

import React, { createContext, useContext, useState } from 'react';

const ComplianceContext = createContext(null);

export const COMPLIANCE_STACKS = {
    ACTIVE_ONLY: {
        id: 'active',
        label: 'Active Only',
        modules: [1],
        description: 'Basic filtering of inactive funds.'
    },
    CATEGORY_PURITY: {
        id: 'purity',
        label: 'Category Purity',
        modules: [1, 2],
        description: 'Strict matching of fund categories.'
    },
    STRICT_COMPLIANCE: {
        id: 'strict',
        label: 'Strict Compliance',
        modules: [1, 2, 3],
        description: 'Complete SEBI-aligned standardization.'
    }
};

export const ComplianceProvider = ({ children }) => {
    const [selectedStack, setSelectedStack] = useState(COMPLIANCE_STACKS.ACTIVE_ONLY);

    const changeStack = (stackId) => {
        const stack = Object.values(COMPLIANCE_STACKS).find(s => s.id === stackId);
        if (stack) {
            setSelectedStack(stack);
        }
    };

    return (
        <ComplianceContext.Provider value={{ selectedStack, changeStack, COMPLIANCE_STACKS }}>
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
