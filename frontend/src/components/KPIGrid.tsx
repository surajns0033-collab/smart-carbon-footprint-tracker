// src/components/KPIGrid.tsx
import React from 'react';

interface KPI {
  label: string;
  value: string | number;
}

interface KPIGridProps {
  kpis: KPI[];
}

export const KPIGrid: React.FC<KPIGridProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 hover:shadow-lg transition"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{kpi.value}</div>
        </div>
      ))}
    </div>
  );
};
