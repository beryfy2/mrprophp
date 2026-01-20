import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJSON, delJSON } from "../lib/api";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

interface MediaItem {
  _id: string;
  publication: string;
  title: string;
  content: string;
  link: string;
  photo: string;
  date: string;
}

export default function Media() {
  const navigate = useNavigate();
  const [list, setList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getJSON<MediaItem[]>("/media");
        setList(data);
      } catch {
        setList([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const removeItem = async (id: string) => {
    if (!confirm("Delete this media item?")) return;
    await delJSON(`/media/${id}`);
    setList((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Media Coverage</h1>
          <p className="page-subtitle">
            Manage press and media mentions
          </p>
        </div>

        <button
          className="btn primary"
          onClick={() => navigate("/admin/media/new")}
        >
          <span className="btn-icon">+</span>
          Add Media
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="card">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading media...</p>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && list.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📰</div>
            <p className="empty-text">
              No media items added yet
            </p>
            <button
              className="btn primary"
              onClick={() => navigate("/admin/media/new")}
            >
              Add Media
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      {!loading && list.length > 0 && (
        <div className="card table-card">
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Logo</th>
                  <th className="th">Publication</th>
                  <th className="th">Title</th>
                  <th className="th">Link</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>

              <tbody>
                {list.map((item) => (
                  <tr key={item._id}>
                    {/* LOGO */}
                    <td className="td">
                      <img
                        src={`${API_BASE.replace(
                          "/api",
                          ""
                        )}${item.photo}`}
                        alt={item.publication}
                        className="media-logo"
                      />
                    </td>

                    {/* PUBLICATION */}
                    <td className="td">
                      <strong>{item.publication}</strong>
                    </td>

                    {/* TITLE */}
                    <td className="td">
                      <div className="media-title-cell">
                        <span>{item.title}</span>
                      </div>
                    </td>

                    {/* LINK */}
                    <td className="td">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="media-link"
                      >
                        View Link
                      </a>
                    </td>

                    {/* ACTIONS */}
                    <td className="td">
                      <div className="action-buttons">
                        <button
                          className="btn btn-edit"
                          onClick={() =>
                            navigate(
                              `/admin/media/${item._id}`
                            )
                          }
                        >
                          <span>✏️</span>
                          Edit
                        </button>

                        <button
                          className="btn btn-delete"
                          onClick={() =>
                            removeItem(item._id)
                          }
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

