import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../App.css";
import { getToken } from "../lib/api";

const AdminLayout = () => {
  const location = useLocation();
  const token = getToken();
  if (!token) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Topbar />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

