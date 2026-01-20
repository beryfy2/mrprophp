import { useEffect, useMemo, useState } from 'react';
import type { NavItem } from '../../../common/types';
import { getJSON, sendJSON, delJSON } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function NavItems() {
  const navigate = useNavigate();
  const [items, setItems] = useState<NavItem[]>([]);
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newOrder, setNewOrder] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getJSON<NavItem[]>('/nav-items').then(setItems);
  }, []);

  const filtered = useMemo(() => items.filter((i) => i.name.toLowerCase().includes(q.toLowerCase())), [items, q]);

  async function handleAdd() {
    setShowAdd(true);
    setNewName('');
    setNewOrder(items.length + 1);
  }

  async function saveNewItem() {
    const name = newName.trim();
    if (!name) {
      alert('Please enter a name');
      return;
    }
    const order = typeof newOrder === 'number' && !Number.isNaN(newOrder) ? newOrder : items.length + 1;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    if (items.some((i) => i.slug === slug)) {
      alert('A nav item with the same slug already exists.');
      return;
    }
    try {
      setSaving(true);
      await sendJSON<NavItem>('/nav-items', { name, slug, order }, 'POST');
      const refreshed = await getJSON<NavItem[]>('/nav-items');
      setItems(refreshed);
      setShowAdd(false);
    } catch {
      alert('Failed to add nav item. Please ensure you are logged in and the name is unique.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Navigation Items</h1>
          <p className="page-subtitle">Manage the main navigation menu items</p>
        </div>
        {!showAdd && (
          <button className="btn primary" onClick={handleAdd}>
            <span className="btn-icon">+</span>
            Add Nav Item
          </button>
        )}
      </div>

      {showAdd && (
        <div className="card">
          <div className="form-header">
            <div>
              <h3 className="form-title">Add New Navigation Item</h3>
              <p className="form-subtitle">Create a new item for the main navigation menu</p>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-section">
              <label className="form-label">
                <span className="label-text">Item Name *</span>
              </label>
              <input
                className="form-input"
                placeholder="e.g., Services, About Us"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="form-section">
              <label className="form-label">
                <span className="label-text">Display Order</span>
              </label>
              <input
                className="form-input"
                placeholder="Order number"
                type="number"
                value={newOrder}
                onChange={(e) => setNewOrder(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </button>
            <button 
              className="btn primary" 
              onClick={saveNewItem} 
              disabled={saving}
            >
              <span className="btn-icon">{saving ? '⏳' : '💾'}</span>
              {saving ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        </div>
      )}

      <div className="page-actions">
        <div className="search-input-wrapper">
          <span className="search-icon-small">🔍</span>
          <input 
            value={q} 
            onChange={(e) => setQ(e.target.value)} 
            placeholder="Search navigation items..." 
            className="input search-input" 
          />
        </div>
      </div>

      <div className="card table-card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔗</div>
            <p className="empty-text">No navigation items found</p>
            <p className="empty-subtext">{q ? 'Try a different search term' : 'Add your first navigation item above'}</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Order</th>
                  <th className="th">Name</th>
                  <th className="th">Slug</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i._id}>
                    <td className="td">
                      <div className="order-badge">{i.order}</div>
                    </td>
                    <td className="td">
                      <div className="nav-item-name">{i.name}</div>
                    </td>
                    <td className="td">
                      <code className="slug-text">{i.slug}</code>
                    </td>
                    <td className="td">
                      <div className="action-buttons">
                        <button 
                          className="btn btn-edit" 
                          onClick={() => navigate(`/admin/nav-items/${i._id}`)}
                        >
                          <span>✏️</span>
                          Edit
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={async () => {
                            if (!confirm('Are you sure? This will delete this navigation item and all its titles/subtitles.')) return;
                            await delJSON(`/nav-items/${i._id}`);
                            const refreshed = await getJSON<NavItem[]>('/nav-items');
                            setItems(refreshed);
                          }}
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
        )}
      </div>
    </div>
  );
}

