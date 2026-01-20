import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAchievementById, createAchievement, updateAchievement } from "../lib/achievementApi";

export default function AchievementForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAchievementById(id).then((item) => {
        setTitle(item.title);
        setLink(item.link || "");
        if (item.date) setDate(new Date(item.date).toISOString().split('T')[0]);
        if (item.photo) setPreview(`http://localhost:5000${item.photo}`);
      });
    }
  }, [id]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !link || (!id && !photo)) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("link", link);
      formData.append("date", date);
      if (photo) formData.append("photo", photo);

      if (id) {
        await updateAchievement(id, formData);
      } else {
        await createAchievement(formData);
      }
      navigate("/admin/achievements");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err?.message || "Failed to save achievement";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => navigate("/admin/achievements")}>
            ← Back
          </button>
          <h1>{id ? "Edit Achievement" : "Add Achievement"}</h1>
        </div>
      </div>

      <div className="card">
        <form onSubmit={save} className="form-layout">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Success Story: John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Photo</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div className="photo-upload-area" onClick={() => fileInputRef.current?.click()}>
              {preview ? (
                <img src={preview} alt="Preview" className="photo-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span>📸</span>
                  <p>Click to upload photo</p>
                </div>
              )}
            </div>
          </div>

          <div className="form-group full-width">
            <label>Link</label>
            <input
              type="url"
              className="input"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com/achievement-detail"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={() => navigate("/admin/achievements")}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Saving..." : "Save Achievement"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 800px;
        }
        .full-width {
          grid-column: 1 / -1;
        }
        .photo-upload-area {
          border: 2px dashed #e2e8f0;
          border-radius: 12px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          background: #f8fafc;
        }
        .photo-upload-area:hover {
          border-color: #0b3a66;
          background: #f1f5f9;
        }
        .photo-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .upload-placeholder {
          text-align: center;
          color: #64748b;
        }
        .upload-placeholder span {
          font-size: 24px;
          display: block;
          margin-bottom: 8px;
        }
        .textarea {
          resize: vertical;
        }
      `}</style>
    </div>
  );
}

