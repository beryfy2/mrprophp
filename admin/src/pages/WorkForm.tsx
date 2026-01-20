import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchWork, createWork, updateWork } from "../lib/workApi";
import type { Work } from "../lib/workApi";

const API_BASE = "http://localhost:5000";

export default function WorkForm() {
  const navigate = useNavigate();
  const { id = "new" } = useParams();
  const isNew = id === "new";

  const [form, setForm] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!isNew) {
      (async () => {
        try {
          const data: Work = await fetchWork(id);

          setForm({
            title: data.title,
            content: data.content,
            date: data.date
              ? new Date(data.date).toISOString().split("T")[0]
              : "",
          });

          if (data.photo) {
            setPhotoPreview(`${API_BASE}${data.photo}`);
          }
        } catch (err) {
          console.error("Failed to load work", err);
          navigate("/admin/works");
        }
      })();
    }
  }, [id, isNew, navigate]);

  /* ================= FILE HANDLER ================= */

  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto(file);

    const reader = new FileReader();
    reader.onload = () =>
      setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("date", form.date);

      if (photo) {
        formData.append("photo", photo);
      }

      if (isNew) {
        await createWork(formData);
      } else {
        await updateWork(id, formData);
      }

      navigate("/admin/works");
    } catch (err: unknown) {
      console.error("Failed to save work", err);
      alert(
        (err instanceof Error ? err.message : String(err)) ||
          "Something went wrong while saving"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>
            {isNew ? "Add Work" : "Edit Work"}
          </h1>
          <p className="page-subtitle">
            {isNew
              ? "Create a new work entry"
              : "Update work details"}
          </p>
        </div>

        <button
          className="btn secondary"
          onClick={() =>
            navigate("/admin/works")
          }
        >
          ← Back
        </button>
      </div>

      {/* FORM */}
      <div className="card">
        <form
          onSubmit={handleSubmit}
          className="form-stack"
        >
          {/* TITLE */}
          <div className="form-group">
            <label className="form-label">
              Title *
            </label>
            <input
              type="text"
              className="form-input"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              required
            />
          </div>

          {/* CONTENT */}
          <div className="form-group">
            <label className="form-label">
              Content *
            </label>
            <textarea
              className="form-textarea"
              rows={6}
              value={form.content}
              onChange={(e) =>
                setForm({
                  ...form,
                  content: e.target.value,
                })
              }
              required
            />
          </div>

          {/* DATE */}
          <div className="form-group">
            <label className="form-label">
              Date *
            </label>
            <input
              type="date"
              className="form-input"
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value,
                })
              }
              required
            />
          </div>

          {/* PHOTO */}
          <div className="form-group">
            <label className="form-label">
              Photo {isNew && "*"}
            </label>

            <div className="image-upload-area">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="image-preview"
                />
              ) : (
                <div className="placeholder">
                  No image selected
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                required={isNew}
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn primary"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isNew
                ? "Create Work"
                : "Update Work"}
            </button>

            <button
              type="button"
              className="btn secondary"
              onClick={() =>
                navigate("/admin/works")
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

