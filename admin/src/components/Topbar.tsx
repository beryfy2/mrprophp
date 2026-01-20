import { useNavigate } from "react-router-dom";
import { logout, getJSON } from "../lib/api";
import { useState, useRef, useEffect } from "react";

const Topbar = () => {
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !(profileRef.current as HTMLElement).contains(e.target as Node)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await getJSON<{ count: number }>("/enquiries/unread-count");
        setUnreadCount(data.count);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchUnreadCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="topbar">
 

      {/* Right */}
      <div className="topbar-right">
        {/* Notification */}
        <button
          className="icon-btn notification-btn"
          onClick={() => navigate("/admin/enquiries")}
        >
          🔔
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>

        {/* Profile */}
        <div className="profile-wrapper" ref={profileRef}>
          <div
            className="avatar"
            onClick={() => setOpenProfile((p) => !p)}
          >
            A
          </div>

          {openProfile && (
            <div className="profile-dropdown">
              <button
                onClick={() => {
                  navigate("/admin/admin-settings");
                  setOpenProfile(false);
                }}
              >
                ⚙ Admin Settings
              </button>

              <button
                className="logout"
                onClick={handleLogout}
              >
                ⎋ Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;

