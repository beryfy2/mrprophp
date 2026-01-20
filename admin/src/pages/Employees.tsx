import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJSON, delJSON } from '../lib/api';
import type { Employee } from '../../../common/types';

export default function Employees() {
  const navigate = useNavigate();
  const [list, setList] = useState<Employee[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    getJSON<Employee[]>('/employees').then(setList);
  }, []);

  const filtered = useMemo(() => list.filter((e) => e.name.toLowerCase().includes(q.toLowerCase())), [list, q]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Employees</h1>
        <p className="page-subtitle">Manage your team members</p>
      </div>

      <div className="page-actions">
        <button className="btn primary" onClick={() => navigate('/admin/employees/new')}>
          <span className="btn-icon">+</span>
          Add Employee
        </button>
        <div className="search-input-wrapper">
          <span className="search-icon-small">🔍</span>
          <input 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            placeholder="Search employees by name..." 
            className="input search-input" 
          />
        </div>
      </div>

      <div className="card table-card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <p className="empty-text">No employees found</p>
            <p className="empty-subtext">{q ? 'Try a different search term' : 'Add your first employee to get started'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Employee</th>
                  <th className="th">Position</th>
                  <th className="th">Contact</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e._id}>
                    <td className="td">
                      <div className="employee-info">
                        <div className="employee-avatar">{e.name?.[0]?.toUpperCase() || '?'}</div>
                        <div className="employee-details">
                          <div className="employee-name">{e.name}</div>
                          <div className="employee-dept">{e.department || 'No department'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="td">
                      <span className="position-badge">{e.position}</span>
                    </td>
                    <td className="td">
                      <div className="contact-info">
                        <div className="contact-item">
                          <span className="contact-icon">📧</span>
                          <span className="contact-text">{e.email}</span>
                        </div>
                        {e.phone && (
                          <div className="contact-item">
                            <span className="contact-icon">📞</span>
                            <span className="contact-text">{e.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="td">
                      <div className="action-buttons">
                        <button 
                          className="btn btn-view" 
                          onClick={() => navigate(`/admin/employees/${e._id}`)}
                        >
                          <span>👁️</span>
                          View
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={async () => {
                            if (!confirm('Are you sure you want to delete this employee?')) return;
                            await delJSON(`/employees/${e._id}`);
                            const refreshed = await getJSON<Employee[]>('/employees');
                            setList(refreshed);
                          }}
                        >
                          <span>🗑️</span>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

