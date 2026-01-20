import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJSON, sendForm } from "../lib/api";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

interface MediaItem {
  _id: string;
  publication: string;
  title: string;
  content: string;
  link: string;
  photo: string;
  date: string;
}

export default function MediaForm() {
  const navigate = useNavigate();
  const { id = "new" } = useParams();
  const isNew = id === "new";

  const [formData, setFormData] = useState<Partial<MediaItem>>({
    publication: "",
    title: "",
    content: "",
    link: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      getJSON<MediaItem>(`/media/${id}`).then((data) => {
        setFormData({
          publication: data.publication,
          title: data.title,
          content: data.content,
          link: data.link,
          date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
        });
        if (data.photo) {
          setPreview(`${API_BASE.replace('/api', '')}${data.photo}`);
        }
      });
    }
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile && isNew) {
      alert("Please upload a logo/image");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("publication", formData.publication || "");
    data.append("title", formData.title || "");
    data.append("content", formData.content || "");
    data.append("link", formData.link || "");
    data.append("date", formData.date || "");
    if (photoFile) data.append("photo", photoFile);

    try {
      if (isNew) {
        await sendForm("/media", data, "POST");
      } else {
        await sendForm(`/media/${id}`, data, "PUT");
      }
      navigate("/admin/media");
    } catch {
      alert("Failed to save media item");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setPhotoFile(f);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>{isNew ? "Add Media Coverage" : "Edit Media Coverage"}</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form-stack">
          {/* Photo Upload */}
          <div className="form-group">
            <label>Logo / Image</label>
            <div className="image-upload-area">
              {preview ? (
                <img src={preview} alt="Preview" className="image-preview" style={{ maxHeight: 200, objectFit: 'contain' }} />
              ) : (
                <div className="placeholder">No image selected</div>
              )}
              <input type="file" onChange={handleFile} accept="image/*" />
            </div>
          </div>

          <div className="form-group">
            <label>Publication Name (Outlet)</label>
            <input
              className="input"
              value={formData.publication}
              onChange={(e) => setFormData({ ...formData, publication: e.target.value })}
              required
              placeholder="e.g. Entrepreneur Hunt"
            />
          </div>

          <div className="form-group">
            <label>Title (Heading)</label>
            <input
              className="input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g. Filing GST Made Easy"
            />
          </div>

          <div className="form-group">
            <label>Content Link (Read More URL)</label>
            <input
              className="input"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              required
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Content (Body)</label>
            <textarea
              className="input"
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Saving..." : "Save Media Item"}
            </button>
            <button type="button" className="btn" onClick={() => navigate("/admin/media")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

