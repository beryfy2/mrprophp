import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🚀</span>
          <h2>MR PRO +</h2>
        </div>
        <p className="sidebar-subtitle">Admin Panel</p>
      </div>

      <div className="sidebar-content">
        <div className="nav-section">
          <NavLink to="/admin/dashboard" className="nav-item">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/employees" className="nav-item">
            <span className="nav-icon">👥</span>
            <span className="nav-text">Employees</span>
          </NavLink>
          <NavLink to="/admin/nav-items" className="nav-item">
            <span className="nav-icon">🔗</span>
            <span className="nav-text">Nav Items</span>
          </NavLink>
          <NavLink to="/admin/enquiries" className="nav-item">
            <span className="nav-icon">📧</span>
            <span className="nav-text">Enquiries</span>
          </NavLink>
          <NavLink to="/admin/careers" className="nav-item">
            <span className="nav-icon">💼</span>
            <span className="nav-text">Careers</span>
          </NavLink>
          <NavLink to="/admin/achievements" className="nav-item">
            <span className="nav-icon">🏆</span>
            <span className="nav-text">Achievements</span>
          </NavLink>
          <NavLink to="/admin/works" className="nav-item">
            <span className="nav-icon">💼</span>
            <span className="nav-text">Works</span>
          </NavLink>
          <NavLink to="/admin/media" className="nav-item">
            <span className="nav-icon">📰</span>
            <span className="nav-text">Media Coverage</span>
          </NavLink>
        </div>

      </div>

      <div className="sidebar-footer">
        <NavLink to="/admin/admin-settings" className="nav-item admin-settings">
          <span className="nav-icon">⚙️</span>
          <span className="nav-text">Admin Settings</span>
        </NavLink>
      </div>
    </nav>
  );
}

