import { useEffect, useState } from 'react';
import type { Title, Subtitle } from '../../../common/types';
import { getJSON, sendJSON, delJSON } from '../lib/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function TitleDetail() {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const [t, setT] = useState<Title | null>(null);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [subs, setSubs] = useState<Subtitle[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newSubtitleTitle, setNewSubtitleTitle] = useState('');
  const [newSubtitlePrice, setNewSubtitlePrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getJSON<Title>(`/titles/${id}`).then((ti) => {
      setT(ti);
      setName(ti.title);
      setContent(ti.content || '');
    });
    getJSON<Subtitle[]>(`/titles/${id}/subtitles`).then(setSubs);
  }, [id]);

  async function saveTitle() {
    if (!t) return;
    const updated = await sendJSON<Title>(`/titles/${id}`, { title: name, content }, 'PUT');
    setT(updated);
    alert('Title saved');
  }

  function addSubtitle() {
    setShowAdd(true);
    setNewSubtitleTitle('');
    setNewSubtitlePrice('');
  }

  async function saveNewSubtitle() {
    const s = newSubtitleTitle.trim();
    if (!s) return;
    try {
      setSaving(true);
      const created = await sendJSON<Subtitle>(`/titles/${id}/subtitles`, { title: s, price: newSubtitlePrice.trim() || undefined }, 'POST');
      setSubs((prev) => [created, ...prev]);
      setShowAdd(false);
      navigate(`/admin/subtitles/${created._id}`);
    } catch {
      alert('Failed to add subtitle');
    } finally {
      setSaving(false);
    }
  }

  async function removeSubtitle(sid: string) {
    if (!confirm('Delete this subtitle?')) return;
    await delJSON(`/subtitles/${sid}`);
    setSubs((prev) => prev.filter((x) => x._id !== sid));
  }

  return (
    <div className="page">
      <div className="back-navigation">
        <button className="btn btn-secondary" onClick={() => t && navigate(`/admin/nav-items/${t.navItem}`)}>
          ← Back to Nav Item
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Title</h2>
          {t && (
            <button
              className="btn btn-danger"
              onClick={async () => {
                if (!confirm('Delete this title and all its subtitles?')) return;
                await delJSON(`/titles/${id}`);
                navigate(`/admin/nav-items/${t.navItem}`);
              }}
            >
              Delete
            </button>
          )}
        </div>
        <div className="form-section">
          <label className="form-label">
            <span className="label-text">Title Name</span>
          </label>
          <input 
            className="form-input" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter title name"
          />
        </div>
        
        <div className="form-actions">
          <button className="btn primary" onClick={saveTitle}>
            <span className="btn-icon">💾</span>
            Save Title
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Subtitles</h2>
          {!showAdd ? (
            <button className="btn primary" onClick={addSubtitle}>
              <span className="btn-icon">+</span>
              Add Subtitle
            </button>
          ) : (
            <div className="inline-form-group">
              <input 
                className="form-input" 
                placeholder="Subtitle title" 
                value={newSubtitleTitle} 
                onChange={(e) => setNewSubtitleTitle(e.target.value)}
              />
              <input 
                className="form-input" 
                placeholder="Price (e.g., ₹499)" 
                value={newSubtitlePrice} 
                onChange={(e) => setNewSubtitlePrice(e.target.value)}
              />
              <button 
                className="btn success" 
                onClick={saveNewSubtitle} 
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {subs.length === 0 ? (
          <div className="empty-state-small">
            <p className="empty-text">No subtitles yet</p>
            <p className="empty-subtext">Click "Add Subtitle" to create your first subtitle</p>
          </div>
        ) : (
          <div className="items-list">
            {subs.map((s) => (
              <div key={s._id} className="list-item-card">
                <div 
                  className="list-item-content"
                  onClick={() => navigate(`/admin/subtitles/${s._id}`)}
                >
                  <div className="list-item-title">{s.title}</div>
                  <div className="list-item-preview">
                    {(s.content || '').slice(0, 80)}
                  </div>
                </div>
                <div className="action-buttons">
                  <button 
                    className="btn btn-edit" 
                    onClick={() => navigate(`/admin/subtitles/${s._id}`)}
                  >
                    <span>✏️</span>
                    Edit
                  </button>
                  <button 
                    className="btn btn-delete" 
                    onClick={() => removeSubtitle(s._id!)}
                  >
                    <span>🗑️</span>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

