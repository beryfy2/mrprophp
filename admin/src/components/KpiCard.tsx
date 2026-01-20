import type { ReactNode } from 'react';

export default function KpiCard({
  title,
  value,
  changePct,
  icon,
  color = 'indigo'
}: {
  title: string;
  value: number;
  changePct: number;
  icon: ReactNode;
  color?: 'indigo' | 'violet';
}) {
  const isPositive = changePct >= 0;
  
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <div className="kpi-content">
          <div className="kpi-title">{title}</div>
          <div className="kpi-value">{value.toLocaleString()}</div>
        </div>
        <div className={`kpi-icon ${color}`}>
          {icon}
        </div>
      </div>
      <div className={`kpi-trend ${isPositive ? 'positive' : 'negative'}`}>
        <span className="trend-icon">{isPositive ? '↑' : '↓'}</span>
        <span className="trend-value">{Math.abs(changePct)}%</span>
        <span className="trend-label">vs last month</span>
      </div>
    </div>
  );
}

