import { useEffect, useState, useMemo } from 'react';
import type { Enquiry } from '../../../common/types';
import { getJSON, delJSON, sendJSON } from '../lib/api';
import '../payment-status.css';

type SortOption = 'newest' | 'oldest' | 'company' | 'subject';
type FilterOption = 'all' | 'with-attachment' | 'without-attachment';

export default function Enquiries() {
  const [list, setList] = useState<Enquiry[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [expandedAll, setExpandedAll] = useState(false);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const data = await getJSON<Enquiry[]>('/enquiries');
      setList(data);
    } catch (error) {
      console.error('Failed to load enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return formatDate(dateString);
  };

  const filteredAndSorted = useMemo(() => {
    let filtered = [...list];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.subject.toLowerCase().includes(query) ||
          e.companyName.toLowerCase().includes(query) ||
          e.contactPerson.toLowerCase().includes(query) ||
          e.email.toLowerCase().includes(query) ||
          e.message.toLowerCase().includes(query)
      );
    }

    // Apply attachment filter
    if (filterBy === 'with-attachment') {
      filtered = filtered.filter((e) => e.file);
    } else if (filterBy === 'without-attachment') {
      filtered = filtered.filter((e) => !e.file);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        case 'oldest':
          return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
        case 'company':
          return a.companyName.localeCompare(b.companyName);
        case 'subject':
          return a.subject.localeCompare(b.subject);
        default:
          return 0;
      }
    });

    return filtered;
  }, [list, searchQuery, sortBy, filterBy]);

  const stats = useMemo(() => {
    const total = list.length;
    const withAttachment = list.filter((e) => e.file).length;
    const today = list.filter((e) => {
      if (!e.date) return false;
      const date = new Date(e.date);
      const today = new Date();
      return date.toDateString() === today.toDateString();
    }).length;
    const thisWeek = list.filter((e) => {
      if (!e.date) return false;
      const date = new Date(e.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length;

    return { total, withAttachment, today, thisWeek };
  }, [list]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} copied to clipboard!`);
    });
  };

  const toggleAllDetails = () => {
    if (expandedAll) {
      setOpenId(null);
    } else {
      setOpenId(filteredAndSorted[0]?._id || null);
    }
    setExpandedAll(!expandedAll);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading enquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Enquiries</h1>
          <p className="page-subtitle">View and manage customer enquiries</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={toggleAllDetails}
            title={expandedAll ? 'Collapse all' : 'Expand all'}
          >
            <span>{expandedAll ? '📄' : '📋'}</span>
            {expandedAll ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {list.length > 0 && (
        <div className="enquiry-stats">
          <div className="stat-card">
            <div className="stat-icon">📧</div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Enquiries</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📎</div>
            <div className="stat-content">
              <div className="stat-value">{stats.withAttachment}</div>
              <div className="stat-label">With Attachments</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.today}</div>
              <div className="stat-label">Today</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.thisWeek}</div>
              <div className="stat-label">This Week</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      {list.length > 0 && (
        <div className="enquiry-filters">
          <div className="search-input-wrapper">
            <span className="search-icon-small">🔍</span>
            <input
              type="text"
              className="input search-input"
              placeholder="Search by subject, company, contact, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-group">
            <select
              className="form-select filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              title="Sort enquiries"
              aria-label="Sort enquiries"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="company">Sort: By Company</option>
              <option value="subject">Sort: By Subject</option>
            </select>

            <select
              className="form-select filter-select"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              title="Filter enquiries"
              aria-label="Filter enquiries"
            >
              <option value="all">All Enquiries</option>
              <option value="with-attachment">With Attachments</option>
              <option value="without-attachment">Without Attachments</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Count */}
      {list.length > 0 && (
        <div className="results-info">
          <span className="results-count">
            Showing {filteredAndSorted.length} of {list.length} enquiries
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
        </div>
      )}

      {/* Enquiries List */}
      {list.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📧</div>
            <p className="empty-text">No enquiries yet</p>
            <p className="empty-subtext">New enquiries will appear here</p>
          </div>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-text">No enquiries found</p>
            <p className="empty-subtext">Try adjusting your search or filters</p>
            <button className="btn" onClick={() => { setSearchQuery(''); setFilterBy('all'); }}>
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="enquiries-list">
          {filteredAndSorted.map((e) => (
            <div key={e._id} className={`enquiry-card ${openId === e._id ? 'expanded' : ''}`}>
              <div className="enquiry-header">
                <div className="enquiry-main">
                  <div className="enquiry-subject-row">
                    <h3 className="enquiry-subject">{e.subject}</h3>
                    {e.file && (
                      <span className="attachment-indicator" title="Has attachment">
                        📎
                      </span>
                    )}
                    {e.paymentStatus && (
                      <span className={`status-badge status-${e.paymentStatus.toLowerCase()}`}>
                        {e.paymentStatus}
                      </span>
                    )}
                  </div>
                  <div className="enquiry-meta">
                    <span className="meta-item" title={e.companyName}>
                      <span className="meta-icon">🏢</span>
                      <span className="meta-text">{e.companyName}</span>
                    </span>
                    <span className="meta-item" title={e.contactPerson}>
                      <span className="meta-icon">👤</span>
                      <span className="meta-text">{e.contactPerson}</span>
                    </span>
                    <span
                      className="meta-item clickable"
                      title={`${e.email} (Click to copy)`}
                      onClick={() => copyToClipboard(e.email, 'Email')}
                    >
                      <span className="meta-icon">📧</span>
                      <span className="meta-text">{e.email}</span>
                      <span className="copy-hint">📋</span>
                    </span>
                  </div>
                </div>
                <div className="enquiry-date-group">
                  <div className="enquiry-date">{formatDate(e.date)}</div>
                  <div className="enquiry-time">{getRelativeTime(e.date)}</div>
                </div>
              </div>

              {openId === e._id && (
                <div className="enquiry-details">
                  <div className="detail-section">
                    <div className="detail-item">
                      <span className="detail-label">Subject:</span>
                      <span className="detail-value">{e.subject}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Company:</span>
                      <span className="detail-value">{e.companyName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Contact Person:</span>
                      <span className="detail-value">{e.contactPerson}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">
                        <a href={`mailto:${e.email}`} className="email-link">
                          {e.email}
                        </a>
                        <button
                          className="copy-btn"
                          onClick={() => copyToClipboard(e.email, 'Email')}
                          title="Copy email"
                        >
                          📋
                        </button>
                      </span>
                    </div>

                    {e.paymentStatus && (
                      <>
                        <div className="detail-item">
                          <span className="detail-label">Payment Status:</span>
                          <span className={`detail-value status-text-${e.paymentStatus.toLowerCase()}`}>
                            {e.paymentStatus}
                          </span>
                        </div>
                        {e.amount && (
                          <div className="detail-item">
                            <span className="detail-label">Amount:</span>
                            <span className="detail-value">₹{e.amount}</span>
                          </div>
                        )}
                        {e.transactionId && (
                          <div className="detail-item">
                            <span className="detail-label">Transaction ID:</span>
                            <span className="detail-value">{e.transactionId}</span>
                          </div>
                        )}
                      </>
                    )}

                    {e.file && (
                      <div className="detail-item">
                        <span className="detail-label">Attachment:</span>
                        <div className="attachment-detail">
                          <a
                            href={`http://localhost:5000${e.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="attachment-link"
                          >
                            <span className="attachment-icon">📎</span>
                            <span className="attachment-name">
                              {e.file.split('/').pop() || 'View Document'}
                            </span>
                            <span className="attachment-action">Open</span>
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="detail-item full-width">
                      <span className="detail-label">Message:</span>
                      <div className="message-content">{e.message}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="enquiry-actions">
                {e.file && (
                  <a
                    className="btn btn-secondary"
                    href={`http://localhost:5000${e.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>📎</span>
                    Attachment
                  </a>
                )}

                <a
                  className="btn btn-primary"
                  href={`mailto:${e.email}?subject=Re: ${encodeURIComponent(e.subject)}`}
                >
                  <span>✉️</span>
                  Respond
                </a>

                <button
                  className="btn btn-secondary"
                  onClick={async () => {
                    setOpenId(openId === e._id ? null : e._id!);
                    if (openId !== e._id && !e.read) {
                      try {
                        await sendJSON('', `/enquiries/${e._id}/read`, 'PUT');
                        setList(prev => prev.map(item => 
                          item._id === e._id ? { ...item, read: true } : item
                        ));
                      } catch (err) {
                        console.error('Failed to mark as read', err);
                      }
                    }
                  }}
                >
                  <span>{openId === e._id ? '👁️‍🗨️' : '👁️'}</span>
                  {openId === e._id ? 'Hide' : 'View'} Details
                </button>

                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    if (!confirm('Are you sure you want to delete this enquiry?')) return;
                    try {
                      await delJSON(`/enquiries/${e._id}`);
                      await loadEnquiries();
                    } catch {
                      alert('Failed to delete enquiry. Please try again.');
                    }
                  }}
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
  );
}

