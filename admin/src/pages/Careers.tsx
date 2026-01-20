import { useEffect, useState, useMemo } from 'react';
import { getJSON, sendJSON, delJSON } from '../lib/api';
import type { Job } from '../../../common/types';
import { useNavigate } from 'react-router-dom';

export default function Careers() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [experience, setExperience] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [location, setLocation] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [qualificationsText, setQualificationsText] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getJSON<Job[]>('/jobs');
      setJobs(data || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      setError('Failed to load jobs. Please try again.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  function resetForm() {
    setEditing(null);
    setTitle('');
    setDescription('');
    setType('');
    setExperience('');
    setUrgent(false);
    setExperienceLevel('');
    setLocation('');
    setResponsibilitiesText('');
    setQualificationsText('');
  }

  function startEdit(j: Job) {
    setEditing(j);
    setTitle(j.title || '');
    setDescription(j.description || '');
    setType(j.type || '');
    setExperience(j.experience || '');
    setUrgent(!!j.urgent);
    setExperienceLevel(j.experienceLevel || '');
    setLocation(j.location || '');
    setResponsibilitiesText(
      Array.isArray(j.responsibilities) ? j.responsibilities.join('\n') : ''
    );
    setQualificationsText(
      Array.isArray(j.qualifications) ? j.qualifications.join('\n') : ''
    );
  }

  async function removeJob(id: string) {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await delJSON(`/jobs/${id}`);
      await loadJobs(); // Reload to ensure data is fresh
    } catch (err) {
      console.error('Failed to delete job:', err);
      alert('Failed to delete job. Please try again.');
    }
  }

  async function saveJob() {
    if (!title.trim() || !description.trim()) {
      alert('Title and description are required');
      return;
    }

    try {

    const responsibilities = responsibilitiesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const qualifications = qualificationsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      type: type.trim(),
      experience: experience.trim(),
      urgent,
      experienceLevel: experienceLevel.trim(),
      location: location.trim(),
      responsibilities,
      qualifications
    };

      if (editing && editing._id) {
        const updated = await sendJSON<Job>(
          `/jobs/${editing._id}`,
          payload,
          'PUT'
        );
        setJobs((prev) =>
          prev.map((x) => (x._id === updated._id ? updated : x))
        );
      } else {
        const created = await sendJSON<Job>('/jobs', payload, 'POST');
        setJobs((prev) => [created, ...prev]);
      }

      resetForm();
      await loadJobs(); // Reload to ensure data is fresh
    } catch (err) {
      console.error('Failed to save job:', err);
      alert('Failed to save job. Please try again.');
    }
  }

  const filtered = useMemo(() => {
    if (!q.trim()) return jobs;
    const query = q.toLowerCase();
    return jobs.filter((j) =>
      j.title?.toLowerCase().includes(query) ||
      j.description?.toLowerCase().includes(query) ||
      j.type?.toLowerCase().includes(query) ||
      j.location?.toLowerCase().includes(query)
    );
  }, [jobs, q]);

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <p className="empty-text">{error}</p>
            <button className="btn primary" onClick={loadJobs}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Careers</h1>
          <p className="page-subtitle">
            Manage job openings shown on the Careers page
          </p>
        </div>
        <div className="header-actions">
          <button className="btn" onClick={() => navigate('/admin/dashboard')}>
            ← Back
          </button>
          <button className="btn primary" onClick={resetForm}>
            <span className="btn-icon">+</span>
            Add Job
          </button>
        </div>
      </div>

      {/* CREATE / EDIT FORM */}
      <div className="card">
        <div className="form-header">
          <div>
            <h3 className="form-title">{editing ? 'Edit Job Posting' : 'Create New Job Posting'}</h3>
            <p className="form-subtitle">
              {editing ? 'Update the job details below' : 'Fill in the details to create a new job posting'}
            </p>
          </div>
          {editing && (
            <button className="btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>

        <div className="form-section">
          <label className="form-label">
            <span className="label-text">Job Title *</span>
          </label>
          <input
            className="form-input"
            placeholder="e.g., Senior Software Engineer"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid-2">
          <div className="form-section">
            <label className="form-label">
              <span className="label-text">Employment Type</span>
            </label>
            <input
              className="form-input"
              placeholder="e.g., Full-time, Part-time"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className="form-section">
            <label className="form-label">
              <span className="label-text">Experience Required</span>
            </label>
            <input
              className="form-input"
              placeholder="e.g., 2–4 years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-section">
            <label className="form-label">
              <span className="label-text">Experience Level</span>
            </label>
            <input
              className="form-input"
              placeholder="e.g., Junior, Mid, Senior"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            />
          </div>
          <div className="form-section">
            <label className="form-label">
              <span className="label-text">Location</span>
            </label>
            <input
              className="form-input"
              placeholder="e.g., New Delhi, Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="form-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
            />
            <span className="checkbox-text">
              <span className="checkbox-icon">⚡</span>
              Mark as Urgent Hiring
            </span>
          </label>
        </div>

        <div className="form-section">
          <label className="form-label">
            <span className="label-text">Key Responsibilities</span>
            <span className="label-hint">Enter one responsibility per line</span>
          </label>
          <textarea
            className="form-textarea"
            rows={4}
            placeholder="• Develop and maintain web applications&#10;• Collaborate with cross-functional teams&#10;• Write clean and maintainable code"
            value={responsibilitiesText}
            onChange={(e) => setResponsibilitiesText(e.target.value)}
          />
        </div>

        <div className="form-section">
          <label className="form-label">
            <span className="label-text">Qualifications & Skills</span>
            <span className="label-hint">Enter one qualification per line</span>
          </label>
          <textarea
            className="form-textarea"
            rows={4}
            placeholder="• Bachelor's degree in Computer Science&#10;• 3+ years of experience&#10;• Proficiency in React and Node.js"
            value={qualificationsText}
            onChange={(e) => setQualificationsText(e.target.value)}
          />
        </div>

        <div className="form-section">
          <label className="form-label">
            <span className="label-text">Job Description *</span>
            <span className="label-hint">Provide a detailed description of the role</span>
          </label>
          <textarea
            className="form-textarea"
            rows={6}
            placeholder="Write a comprehensive job description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-actions">
          {editing && (
            <button className="btn" onClick={resetForm}>
              Cancel
            </button>
          )}
          <button className="btn primary" onClick={saveJob}>
            <span className="btn-icon">💾</span>
            {editing ? 'Save Changes' : 'Create Job'}
          </button>
        </div>
      </div>

      {/* SEARCH */}
      {jobs.length > 0 && (
        <div className="page-actions">
          <div className="search-input-wrapper">
            <span className="search-icon-small">🔍</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search jobs by title, description, type, or location..."
              className="input search-input"
            />
            {q && (
              <button
                className="clear-search"
                onClick={() => setQ('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <div className="results-info">
            <span className="results-count">
              Showing {filtered.length} of {jobs.length} jobs
              {q && ` matching "${q}"`}
            </span>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="card table-card">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💼</div>
            <p className="empty-text">No jobs posted yet</p>
            <p className="empty-subtext">Create your first job posting using the form above</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-text">No jobs found</p>
            <p className="empty-subtext">Try a different search term</p>
            <button className="btn" onClick={() => setQ('')}>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Title</th>
                  <th className="th">Type</th>
                  <th className="th">Experience</th>
                  <th className="th">Urgent</th>
                  <th className="th">Description</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((j) => (
                  <tr key={j._id}>
                    <td className="td">
                      <strong>{j.title}</strong>
                    </td>
                    <td className="td">
                      <span className="type-badge">{j.type || 'Not specified'}</span>
                    </td>
                    <td className="td">{j.experience || '-'}</td>
                    <td className="td">
                      {j.urgent ? (
                        <span className="urgent-badge">⚡ Urgent</span>
                      ) : (
                        <span className="normal-badge">Normal</span>
                      )}
                    </td>
                    <td className="td">
                      <div className="description-preview">
                        {j.description.slice(0, 100)}
                        {j.description.length > 100 && '...'}
                      </div>
                    </td>
                    <td className="td">
                      <div className="action-buttons">
                        <button
                          className="btn btn-edit"
                          onClick={() => startEdit(j)}
                        >
                          <span>✏️</span>
                          Edit
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => removeJob(j._id!)}
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

