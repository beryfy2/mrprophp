import { Users, Mail, TrendingUp } from 'lucide-react';
import KpiCard from '../components/KpiCard';
import { useEffect, useState } from 'react';
import { getJSON } from '../lib/api';
import { useNavigate } from 'react-router-dom';

type KPIs = {
  totalEmployees: { value: number; changePct: number };
  newEnquiries: { value: number; changePct: number };
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJSON<KPIs>('/kpis')
      .then(setKpis)
      .catch(() => setKpis({ totalEmployees: { value: 0, changePct: 0 }, newEnquiries: { value: 0, changePct: 0 } }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="kpi-grid">
            <KpiCard 
              title="Total Employees" 
              value={kpis?.totalEmployees.value ?? 0} 
              changePct={kpis?.totalEmployees.changePct ?? 0} 
              icon={<Users size={24} />} 
              color="indigo" 
            />
            <KpiCard 
              title="New Enquiries" 
              value={kpis?.newEnquiries.value ?? 0} 
              changePct={kpis?.newEnquiries.changePct ?? 0} 
              icon={<Mail size={24} />} 
              color="violet" 
            />
          </div>

          <div className="quick-actions">
            <h3 className="section-title">Quick Actions</h3>
            <div className="action-grid">
              <button className="action-card" onClick={() => navigate('/admin/employees')}>
                <Users size={28} />
                <span>Manage Employees</span>
              </button>
              <button className="action-card" onClick={() => navigate('/admin/enquiries')}>
                <Mail size={28} />
                <span>View Enquiries</span>
              </button>
              <button className="action-card" onClick={() => navigate('/admin/careers')}>
                <TrendingUp size={28} />
                <span>Job Postings</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

