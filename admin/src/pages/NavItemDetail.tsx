import { useEffect, useState } from 'react';
import type { NavItem, Title } from '../../../common/types';
import { getJSON, sendJSON, delJSON } from '../lib/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function NavItemDetail() {
  const navigate = useNavigate();
  const { id = '' } = useParams();

  const [item, setItem] = useState<NavItem | null>(null);
  const [titles, setTitles] = useState<Title[]>([]);
  const [mainTitle, setMainTitle] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOrder, setNewOrder] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getJSON<NavItem>(`/nav-items/${id}`).then((i) => {
      setItem(i);
      setMainTitle(i.name);
    });
    getJSON<Title[]>(`/nav-items/${id}/titles`).then(setTitles);
  }, [id]);

  async function saveMainTitle() {
    if (!item) return;
    const updated = await sendJSON<NavItem>(
      `/nav-items/${id}`,
      { name: mainTitle, slug: mainTitle.toLowerCase().replace(/\s+/g, '-') },
      'PUT'
    );
    setItem(updated);
    alert('Main title saved');
  }

  function addTitle() {
    setShowAdd(true);
    setNewTitle('');
    setNewOrder((titles?.length || 0) + 1);
  }

  async function saveNewTitle() {
    const title = newTitle.trim();
    if (!title) {
      alert('Please enter a title');
      return;
    }

    const order =
      typeof newOrder === 'number' && !Number.isNaN(newOrder)
        ? newOrder
        : (titles?.length || 0) + 1;

    try {
      setSaving(true);
      await sendJSON<Title>(`/nav-items/${id}/titles`, { title, order }, 'POST');
      const refreshed = await getJSON<Title[]>(`/nav-items/${id}/titles`);
      setTitles(refreshed);
      setShowAdd(false);
    } catch {
      alert('Failed to add title.');
    } finally {
      setSaving(false);
    }
  }

  async function removeTitle(tid: string) {
    if (!confirm('Delete this title?')) return;
    await delJSON(`/titles/${tid}`);
    setTitles((prev) => prev.filter((t) => t._id !== tid));
  }

  return (
    <div className="page">
      {/* BACK LINK */}
      <div className="back-navigation">
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/admin/nav-items')}
        >
          ← Back to Nav Items
        </button>
      </div>

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>Nav Item Details</h1>
          <p className="page-subtitle">
            Manage main title and its sub titles
          </p>
        </div>
      </div>

      {/* MAIN TITLE CARD */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Main Title</h2>
          {item && (
            <button
              className="btn btn-danger"
              onClick={async () => {
                if (!confirm('Delete this nav item and all its titles?')) return;
                await delJSON(`/nav-items/${id}`);
                navigate('/admin/nav-items');
              }}
            >
              Delete
            </button>
          )}
        </div>

        <div className="form-section">
          <div className="input-group">
            <input
              className="form-input"
              value={mainTitle}
              onChange={(e) => setMainTitle(e.target.value)}
              placeholder="Enter main title"
            />
            <button className="btn primary" onClick={saveMainTitle}>
              Save
            </button>
          </div>
        </div>
      </div>

      {/* TITLES CARD */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Titles</h2>
          {!showAdd ? (
            <button className="btn primary" onClick={addTitle}>
              <span className="btn-icon">+</span>
              Add Title
            </button>
          ) : (
            <div className="inline-form-group">
              <input
                className="form-input"
                placeholder="Title name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <input
                className="form-input"
                type="number"
                placeholder="Order"
                value={newOrder}
                onChange={(e) =>
                  setNewOrder(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
              <button
                className="btn success"
                onClick={saveNewTitle}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>

        {titles.length === 0 ? (
          <div className="empty-state-small">
            <p className="empty-text">No titles added yet</p>
            <p className="empty-subtext">Click "Add Title" to create your first title</p>
          </div>
        ) : (
          <div className="items-list">
            {titles.map((t) => (
              <div key={t._id} className="list-item-card">
                <div
                  className="list-item-content"
                  onClick={() => navigate(`/admin/titles/${t._id}`)}
                >
                  <div className="list-item-title">{t.title}</div>
                  <div className="list-item-preview">
                    {(t.content || '').slice(0, 80)}
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    className="btn btn-edit"
                    onClick={() => navigate(`/admin/titles/${t._id}`)}
                  >
                    <span>✏️</span>
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => removeTitle(t._id!)}
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

