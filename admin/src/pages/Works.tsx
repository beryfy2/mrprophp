import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWorks, deleteWork } from "../lib/workApi";
import type { Work } from "../lib/workApi";

export default function Works() {
  const navigate = useNavigate();
  const [list, setList] = useState<Work[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchWorks();
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
    if (!confirm("Delete this work?")) return;
    await deleteWork(id);
    const data = await fetchWorks();
    setList(data);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Works</h1>
          <p className="page-subtitle">Manage our portfolio and projects</p>
        </div>
        <button className="btn primary" onClick={() => navigate("/admin/works/new")}>
          <span className="btn-icon">+</span>
          Add Work
        </button>
      </div>

      {list.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">💼</div>
            <p className="empty-text">No works added yet</p>
            <p className="empty-subtext">Showcase your first project</p>
            <button className="btn primary" onClick={() => navigate("/admin/works/new")}>
              Add Work
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
                      <div className="work-title-cell">
                        <strong>{item.title}</strong>
                        <p style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                          {item.content.substring(0, 50)}...
                        </p>
                      </div>
                    </td>
                    <td className="td">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="td">
                      <div className="action-buttons">
                        <button
                          className="btn btn-edit"
                          onClick={() => navigate(`/admin/works/${item._id}`)}
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

