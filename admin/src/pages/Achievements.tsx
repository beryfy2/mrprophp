import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAchievements, deleteAchievement } from "../lib/achievementApi";
import type { Achievement } from "../lib/achievementApi";

export default function Achievements() {
  const navigate = useNavigate();
  const [list, setList] = useState<Achievement[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchAchievements();
        if (mounted) setList(data);
      } catch {
        if (mounted) setList([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const removeItem = async (id: string) => {
    if (!confirm("Delete this achievement?")) return;
    await deleteAchievement(id);
    const data = await fetchAchievements();
    setList(data);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Achievements</h1>
          <p className="page-subtitle">Manage customer achievements and testimonials</p>
        </div>
        <button className="btn primary" onClick={() => navigate("/admin/achievements/new")}>
          <span className="btn-icon">+</span>
          Add Achievement
        </button>
      </div>

      {list.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <p className="empty-text">No achievements added yet</p>
            <p className="empty-subtext">Share your first customer achievement</p>
            <button className="btn primary" onClick={() => navigate("/admin/achievements/new")}>
              Add Achievement
            </button>
          </div>
        </div>
      ) : (
        <div className="card table-card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Photo</th>
                  <th className="th">Title</th>
                  <th className="th">Date</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>

              <tbody>
                {list.map((item) => (
                  <tr key={item._id}>
                    <td className="td">
                      <img 
                        src={`http://localhost:5000${item.photo}`} 
                        alt={item.title} 
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }}
                      />
                    </td>
                    <td className="td">
                      <div className="achievement-title-cell">
                        <strong>{item.title}</strong>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: 12, color: '#0b3a66', marginTop: 4, display: 'inline-block' }}
                        >
                          Open link →
                        </a>
                      </div>
                    </td>
                    <td className="td">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="td">
                      <div className="action-buttons">
                        <button
                          className="btn btn-edit"
                          onClick={() => navigate(`/admin/achievements/${item._id}`)}
                        >
                          <span>✏️</span>
                          Edit
                        </button>
                        <button 
                          className="btn btn-delete"
                          onClick={() => removeItem(item._id)}
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
        </div>
      )}
    </div>
  );
}

