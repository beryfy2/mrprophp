import { useEffect, useState } from 'react';
import type { FileMeta, QA, Subtitle } from '../../../common/types';
import { getJSON, sendJSON, sendForm, delJSON } from '../lib/api';
import { useNavigate, useParams } from 'react-router-dom';

export default function SubtitleDetail() {
  const navigate = useNavigate();
  const { id = '' } = useParams();

  const [sub, setSub] = useState<Subtitle | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [questions, setQuestions] = useState<QA[]>([]);
  const [count, setCount] = useState<number>(0);
  const [faqs, setFaqs] = useState<QA[]>([]);
  const [faqCount, setFaqCount] = useState<number>(0);
  const [batchCount, setBatchCount] = useState<number>(0);
  const [batchNames, setBatchNames] = useState<string[]>([]);
  const [batchError, setBatchError] = useState<string>('');
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchUploading, setBatchUploading] = useState<boolean>(false);

  useEffect(() => {
    getJSON<Subtitle>(`/subtitles/${id}`).then((s) => {
      setSub(s);
      setTitle(s.title);
      setContent(s.content || '');
      setPrice(s.price || '');
      setFiles(s.files || []);
      setQuestions(normalizeQuestions(s.questions || []));
      setCount((s.questions || []).length);
      setFaqs(normalizeQuestions(s.faqs || []));
      setFaqCount((s.faqs || []).length);
    });
  }, [id]);

  function normalizeQuestions(list: QA[]) {
    return (list || []).map((q) => ({
      question: q.question || '',
      answer: q.answer || '',
      format: q.format || 'written',
      table: q.table || undefined,
      files: q.files || []
    }));
  }

  useEffect(() => {
    const next = [...questions];
    if (count > next.length) {
      for (let i = next.length; i < count; i++) {
        next.push({ question: '', answer: '', format: 'written', files: [] });
      }
    } else if (count < next.length) {
      next.length = count;
    }
    setQuestions(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    const next = [...faqs];
    if (faqCount > next.length) {
      for (let i = next.length; i < faqCount; i++) {
        next.push({ question: '', answer: '', format: 'written', files: [] });
      }
    } else if (faqCount < next.length) {
      next.length = faqCount;
    }
    setFaqs(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faqCount]);

  async function uploadBatch() {
    setBatchError('');
    if (batchFiles.length === 0) {
      setBatchError('Select files to upload');
      return;
    }
    const count = Number(batchCount) || 0;
    if (count <= 0) {
      setBatchError('Enter number of files');
      return;
    }
    if (batchFiles.length !== count) {
      setBatchError('Selected files count does not match');
      return;
    }
    const names = Array.from({ length: count }, (_, i) => String(batchNames[i] || '').trim());
    const form = new FormData();
    batchFiles.forEach((f, idx) => {
      form.append('files', f);
      if (names[idx]) {
        form.append(`customName_${idx}`, names[idx]);
      }
    });
    try {
      setBatchUploading(true);
      const updated = await sendForm<Subtitle>(`/subtitles/${id}/files`, form, 'POST');
      setFiles(updated.files || []);
      setBatchCount(0);
      setBatchNames([]);
      setBatchFiles([]);
    } catch (err) {
      const msg =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message?: unknown }).message || 'Failed to upload')
          : 'Failed to upload';
      setBatchError(msg);
    } finally {
      setBatchUploading(false);
    }
  }

  async function removeFile(
    fid?: string,
    fname?: string,
    furl?: string,
    cname?: string,
    vname?: string,
    lbl?: string
  ) {
    try {
      if (!confirm('Remove this file?')) return;
      const before = [...files];
      const filtered = before.filter((f) => {
        if (fid) return f._id !== fid;
        if (furl) return f.url !== furl;
        if (cname) return (f.customName || '') !== cname;
        if (lbl) return (f.label || '') !== lbl;
        if (vname) return ((f.customName || f.label || f.filename) || '') !== vname;
        if (fname) return f.filename !== fname;
        return true;
      });
      setFiles(filtered);
      let updated: Subtitle | null = null;
      try {
        if (fid) {
          updated = await delJSON<Subtitle>(`/subtitles/${id}/files/${String(fid)}`);
        } else if (furl) {
          updated = await delJSON<Subtitle>(`/subtitles/${id}/files?url=${encodeURIComponent(furl)}`);
        } else if (cname) {
          updated = await delJSON<Subtitle>(`/subtitles/${id}/files?customName=${encodeURIComponent(cname)}`);
        } else if (lbl) {
          updated = await delJSON<Subtitle>(`/subtitles/${id}/files?label=${encodeURIComponent(lbl)}`);
        } else if (vname) {
          // Try both as customName and label using visible name
          updated = await delJSON<Subtitle>(`/subtitles/${id}/files?customName=${encodeURIComponent(vname)}`).catch(() => null);
          if (!updated) {
            updated = await delJSON<Subtitle>(`/subtitles/${id}/files?label=${encodeURIComponent(vname)}`).catch(() => null);
          }
        } else if (fname) {
          updated = await delJSON<Subtitle>(`/subtitles/${id}/files?filename=${encodeURIComponent(fname)}`);
        }
      } catch { /* fall through */ }
      if (!updated) {
        try {
          const resp = await sendJSON<Subtitle>(
            `/subtitles/${id}`,
            { title, content, price, questions, faqs, files: filtered },
            'PUT'
          );
          updated = resp;
        } catch { /* fall through */ }
      }
      if (updated && Array.isArray(updated.files)) {
        setFiles(updated.files);
      } else {
        const ok = filtered.length < before.length;
        if (!ok) {
          setFiles(before);
          throw new Error('Failed to remove file');
        }
      }
    } catch (err) {
      const msg =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message?: unknown }).message || 'Failed to remove file')
          : 'Failed to remove file';
      alert(msg);
    } finally {
      /* noop */
    }
  }

  async function uploadQuestionFiles(idx: number, filesList: FileList | null) {
    if (!filesList || filesList.length === 0) return;
    const form = new FormData();
    Array.from(filesList).forEach((f) => form.append('files', f));
    const updated = await sendForm<Subtitle>(`/subtitles/${id}/questions/${idx}/files`, form, 'POST');
    setQuestions(normalizeQuestions(updated.questions || []));
  }

  async function removeQuestionFile(idx: number, fid: string) {
    try {
      if (!fid) {
        alert('Invalid file id');
        return;
      }
      if (!confirm('Remove this attached file?')) return;
      const updated = await delJSON<Subtitle>(`/subtitles/${id}/questions/${idx}/files/${String(fid)}`);
      setQuestions(normalizeQuestions(updated.questions || []));
    } catch (err) {
      const msg =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message?: unknown }).message || 'Failed to remove attached file')
          : 'Failed to remove attached file';
      alert(msg);
    }
  }

  async function saveAll() {
    const updated = await sendJSON<Subtitle>(
      `/subtitles/${id}`,
      { title, content, price, questions, faqs },
      'PUT'
    );
    setSub(updated);
    alert('Saved');
  }

  return (
    <div className="page">
      <div className="back-navigation">
        <button className="btn btn-secondary" onClick={() => sub && navigate(`/admin/titles/${sub.parentTitleId}`)}>
          ← Back
        </button>
      </div>

      {/* SUBTITLE INFO */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Subtitle Information</h2>
          {sub && (
            <button
              className="btn btn-danger"
              onClick={async () => {
                if (!confirm('Delete this subtitle?')) return;
                await delJSON(`/subtitles/${id}`);
                navigate(`/admin/titles/${sub.parentTitleId}`);
              }}
            >
              Delete
            </button>
          )}
        </div>

        <div className="form-section">
          <label className="form-label">
            <span className="label-text">Title</span>
          </label>
          <input 
            className="form-input" 
            placeholder="Enter subtitle title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid-1-2">
          <div className="form-section">
            <label className="form-label">
              <span className="label-text">Content</span>
            </label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Enter content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="form-section">
            <label className="form-label">
              <span className="label-text">Price</span>
            </label>
            <input
              className="form-input"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        

        <div className="form-section">
          <div className="card nested-card">
            <h3 className="section-title">Batch PDF Upload</h3>
            <div className="form-section">
              <label className="form-label">
                <span className="label-text">Number of Files</span>
              </label>
              <input
                className="form-input"
                type="number"
                placeholder="Number of files"
                value={batchCount || ''}
                onChange={(e) => setBatchCount(Number(e.target.value || 0))}
              />
            </div>
            {Array.from({ length: batchCount || 0 }).map((_, idx) => (
              <div key={idx} className="form-section">
                <label className="form-label">
                  <span className="label-text">File {idx + 1} Name</span>
                </label>
                <input
                  className="form-input"
                  placeholder={`File ${idx + 1} name`}
                  value={batchNames[idx] || ''}
                  onChange={(e) => {
                    const next = [...batchNames];
                    next[idx] = e.target.value;
                    setBatchNames(next);
                  }}
                />
              </div>
            ))}
            <div className="form-section">
              <input
                className="form-input"
                type="file"
                multiple
                accept="application/pdf"
                onChange={(e) => {
                  const list = Array.from(e.target.files || []);
                  setBatchFiles(list);
                  setBatchCount(list.length || 0);
                }}
              />
            </div>
            {batchFiles.length > 0 && (
              <div className="form-section">
                <button
                  className="btn success"
                  onClick={uploadBatch}
                  disabled={batchUploading}
                >
                  {batchUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            )}
            {batchError && <div className="error-message">{batchError}</div>}
          </div>
        </div>

        {files.length > 0 && (
          <div className="form-section">
            <label className="form-label">
              <span className="label-text">Uploaded Files</span>
            </label>
            <div className="files-grid">
              {files.map((f) => (
                <div key={f._id} className="file-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="file-card">
                    <div className="file-name" title={f.customName || f.label || f.filename}>
                      {f.customName || f.label || f.filename}
                    </div>
                  </div>
                  <button
                    className="btn btn-delete"
                    type="button"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() =>
                      removeFile(
                        f._id,
                        f.filename,
                        f.url,
                        f.customName,
                        (f.customName || f.label || f.filename),
                        f.label
                      )
                    }
                  >
                    <span>🗑️</span>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QUESTIONS */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Questions & Answers</h2>
          <div className="button-group">
            <button className="btn primary" onClick={() => setCount(count + 1)}>
              <span className="btn-icon">+</span>
              Add Question
            </button>
            {count > 0 && (
              <button className="btn btn-secondary" onClick={() => setCount(Math.max(0, count - 1))}>
                Remove Last
              </button>
            )}
          </div>
        </div>

        <div className="questions-list">
          {questions.map((qa, idx) => (
            <div key={idx} className="card nested-card">
              <div className="form-section">
                <label className="form-label">
                  <span className="label-text">Question {idx + 1}</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={qa.question}
                  onChange={(e) => {
                    const next = [...questions];
                    next[idx] = { ...qa, question: e.target.value };
                    setQuestions(next);
                  }}
                  placeholder="Enter your question"
                />
              </div>
              <div className="form-section">
                <label className="form-label">
                  <span className="label-text">Answer Format</span>
                </label>
                <select
                  className="form-input"
                  value={qa.format || 'written'}
                  onChange={(e) => {
                    const next = [...questions];
                    const fmt = e.target.value as QA['format'];
                    if (fmt === 'table' || fmt === 'both') {
                      const base = qa.table && Array.isArray(qa.table.headers) && Array.isArray(qa.table.rows)
                        ? qa.table
                        : { headers: ['Column 1'], rows: [['']] };
                      next[idx] = { ...qa, format: fmt, table: base };
                    } else {
                      next[idx] = { ...qa, format: fmt, table: undefined };
                    }
                    setQuestions(next);
                  }}
                >
                  <option value="written">Written</option>
                  <option value="table">Table</option>
                  <option value="both">Both</option>
                </select>
              </div>
              {(qa.format === 'table' || qa.format === 'both') && (
                <div className="table-editor">
                  <div className="form-section">
                    <h4 className="section-subtitle">Table Headers</h4>
                    <div className="table-headers-grid">
                      {(qa.table?.headers || []).map((h, hIdx) => (
                        <div key={hIdx} className="table-header-item">
                          <input
                            className="form-input"
                            value={h}
                            onChange={(e) => {
                              const next = [...questions];
                              const t = next[idx].table || { headers: [], rows: [] };
                              t.headers = [...(t.headers || [])];
                              t.headers[hIdx] = e.target.value;
                              next[idx] = { ...next[idx], table: t };
                              setQuestions(next);
                            }}
                            placeholder="Header name"
                          />
                          <button
                            className="btn btn-delete"
                            onClick={() => {
                              const next = [...questions];
                              const t = next[idx].table || { headers: [], rows: [] };
                              const col = hIdx;
                              t.headers = (t.headers || []).filter((_, i) => i !== col);
                              t.rows = (t.rows || []).map((r) => r.filter((_, i) => i !== col));
                              next[idx] = { ...next[idx], table: t };
                              setQuestions(next);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        const next = [...questions];
                        const t = next[idx].table || { headers: [], rows: [] };
                        t.headers = [...(t.headers || []), `Column ${((t.headers || []).length + 1)}`];
                        t.rows = (t.rows || []).map((r) => [...r, '']);
                        next[idx] = { ...next[idx], table: t };
                        setQuestions(next);
                      }}
                    >
                      + Add Column
                    </button>
                  </div>
                  <div className="form-section">
                    <h4 className="section-subtitle">Table Rows</h4>
                    <div className="table-rows-list">
                      {(qa.table?.rows || []).map((row, rIdx) => (
                        <div key={rIdx} className="table-row-item">
                          <div className="table-row-cells">
                            {(row || []).map((cell, cIdx) => (
                              <input
                                key={cIdx}
                                className="form-input"
                                value={cell}
                                onChange={(e) => {
                                  const next = [...questions];
                                  const t = next[idx].table || { headers: [], rows: [] };
                                  const rows = (t.rows || []).map((r) => [...r]);
                                  if (!rows[rIdx]) rows[rIdx] = [];
                                  rows[rIdx][cIdx] = e.target.value;
                                  next[idx] = { ...next[idx], table: { headers: t.headers || [], rows } };
                                  setQuestions(next);
                                }}
                                placeholder={`Cell ${cIdx + 1}`}
                              />
                            ))}
                          </div>
                          <button
                            className="btn btn-delete"
                            onClick={() => {
                              const next = [...questions];
                              const t = next[idx].table || { headers: [], rows: [] };
                              const rows = (t.rows || []).filter((_, i) => i !== rIdx);
                              next[idx] = { ...next[idx], table: { headers: t.headers || [], rows } };
                              setQuestions(next);
                            }}
                          >
                            Remove Row
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        const next = [...questions];
                        const t = next[idx].table || { headers: [], rows: [] };
                        const cols = (t.headers || []).length;
                        const newRow = Array.from({ length: cols || 1 }, () => '');
                        const rows = [...(t.rows || []), newRow];
                        next[idx] = { ...next[idx], table: { headers: t.headers || ['Column 1'], rows } };
                        setQuestions(next);
                      }}
                    >
                      + Add Row
                    </button>
                  </div>
                </div>
              )}
              <div className="form-section">
                <label className="form-label">
                  <span className="label-text">Answer</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={qa.answer}
                  onChange={(e) => {
                    const next = [...questions];
                    next[idx] = { ...qa, answer: e.target.value };
                    setQuestions(next);
                  }}
                  placeholder="Enter your answer"
                />
              </div>
              <div className="form-section">
                <label className="form-label">
                  <span className="label-text">Attach Files</span>
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={(e) => uploadQuestionFiles(idx, e.target.files)}
                  className="form-input"
                />
                {qa.files && qa.files.length > 0 && (
                  <div className="files-grid">
                    {qa.files.map((f) => (
                      <div key={f._id} className="file-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="file-card">
                          <div className="file-name" title={f.filename}>{f.filename}</div>
                        </div>
                        <button 
                          className="btn btn-delete" 
                          style={{ width: '100%', justifyContent: 'center' }}
                          onClick={() => removeQuestionFile(idx, f._id!)}
                        >
                          <span>🗑️</span>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    const next = [...questions];
                    next.splice(idx, 1);
                    setQuestions(next);
                    setCount(next.length);
                  }}
                >
                  <span>🗑️</span>
                  Delete Question
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQS */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Frequently Asked Questions</h2>
          <div className="button-group">
            <button className="btn primary" onClick={() => setFaqCount(faqCount + 1)}>
              <span className="btn-icon">+</span>
              Add FAQ
            </button>
            {faqCount > 0 && (
              <button className="btn btn-secondary" onClick={() => setFaqCount(Math.max(0, faqCount - 1))}>
                Remove Last
              </button>
            )}
          </div>
        </div>
        <div className="questions-list">
          {faqs.map((qa, idx) => (
            <div key={idx} className="card nested-card">
              <div className="form-section">
                <label className="form-label">
                  <span className="label-text">FAQ Question {idx + 1}</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={qa.question}
                  onChange={(e) => {
                    const next = [...faqs];
                    next[idx] = { ...qa, question: e.target.value };
                    setFaqs(next);
                  }}
                  placeholder="Enter your FAQ question"
                />
              </div>
              <div className="form-section">
                <label className="form-label">
                  <span className="label-text">Answer Format</span>
                </label>
                <select
                  className="form-input"
                  value={qa.format || 'written'}
                  onChange={(e) => {
                    const next = [...faqs];
                    const fmt = e.target.value as QA['format'];
                    if (fmt === 'table' || fmt === 'both') {
                      const base = qa.table && Array.isArray(qa.table.headers) && Array.isArray(qa.table.rows)
                        ? qa.table
                        : { headers: ['Column 1'], rows: [['']] };
                      next[idx] = { ...qa, format: fmt, table: base };
                    } else {
                      next[idx] = { ...qa, format: fmt, table: undefined };
                    }
                    setFaqs(next);
                  }}
                >
                  <option value="written">Written</option>
                  <option value="table">Table</option>
                  <option value="both">Both</option>
                </select>
              </div>
              {(qa.format === 'table' || qa.format === 'both') && (
                <div className="table-editor">
                  <div className="form-section">
                    <h4 className="section-subtitle">Table Headers</h4>
                    <div className="table-headers-grid">
                      {(qa.table?.headers || []).map((h, hIdx) => (
                        <div key={hIdx} className="table-header-item">
                          <input
                            className="form-input"
                            value={h}
                            onChange={(e) => {
                              const next = [...faqs];
                              const t = next[idx].table || { headers: [], rows: [] };
                              t.headers = [...(t.headers || [])];
                              t.headers[hIdx] = e.target.value;
                              next[idx] = { ...next[idx], table: t };
                              setFaqs(next);
                            }}
                            placeholder="Header name"
                          />
                          <button
                            className="btn btn-delete"
                            onClick={() => {
                              const next = [...faqs];
                              const t = next[idx].table || { headers: [], rows: [] };
                              const col = hIdx;
                              t.headers = (t.headers || []).filter((_, i) => i !== col);
                              t.rows = (t.rows || []).map((r) => r.filter((_, i) => i !== col));
                              next[idx] = { ...next[idx], table: t };
                              setFaqs(next);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        const next = [...faqs];
                        const t = next[idx].table || { headers: [], rows: [] };
                        t.headers = [...(t.headers || []), `Column ${((t.headers || []).length + 1)}`];
                        t.rows = (t.rows || []).map((r) => [...r, '']);
                        next[idx] = { ...next[idx], table: t };
                        setFaqs(next);
                      }}
                    >
                      + Add Column
                    </button>
                  </div>
                  <div className="form-section">
                    <h4 className="section-subtitle">Table Rows</h4>
                    <div className="table-rows-list">
                      {(qa.table?.rows || []).map((row, rIdx) => (
                        <div key={rIdx} className="table-row-item">
                          <div className="table-row-cells">
                            {(row || []).map((cell, cIdx) => (
                              <input
                                key={cIdx}
                                className="form-input"
                                value={cell}
                                onChange={(e) => {
                                  const next = [...faqs];
                                  const t = next[idx].table || { headers: [], rows: [] };
                                  const rows = (t.rows || []).map((r) => [...r]);
                                  if (!rows[rIdx]) rows[rIdx] = [];
                                  rows[rIdx][cIdx] = e.target.value;
                                  next[idx] = { ...next[idx], table: { headers: t.headers || [], rows } };
                                  setFaqs(next);
                                }}
                                placeholder={`Cell ${cIdx + 1}`}
                              />
                            ))}
                          </div>
                          <button
                            className="btn btn-delete"
                            onClick={() => {
                              const next = [...faqs];
                              const t = next[idx].table || { headers: [], rows: [] };
                              const rows = (t.rows || []).filter((_, i) => i !== rIdx);
                              next[idx] = { ...next[idx], table: { headers: t.headers || [], rows } };
                              setFaqs(next);
                            }}
                          >
                            Remove Row
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        const next = [...faqs];
                        const t = next[idx].table || { headers: [], rows: [] };
                        const cols = (t.headers || []).length;
                        const newRow = Array.from({ length: cols || 1 }, () => '');
                        const rows = [...(t.rows || []), newRow];
                        next[idx] = { ...next[idx], table: { headers: t.headers || ['Column 1'], rows } };
                        setFaqs(next);
                      }}
                    >
                      + Add Row
                    </button>
                  </div>
                </div>
              )}
              <div className="form-section">
                <label className="form-label">
                  <span className="label-text">Answer</span>
                </label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={qa.answer}
                  onChange={(e) => {
                    const next = [...faqs];
                    next[idx] = { ...qa, answer: e.target.value };
                    setFaqs(next);
                  }}
                  placeholder="Enter your answer"
                />
              </div>
              <div className="form-actions">
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    const next = [...faqs];
                    next.splice(idx, 1);
                    setFaqs(next);
                    setFaqCount(next.length);
                  }}
                >
                  <span>🗑️</span>
                  Delete FAQ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="form-actions">
        <button className="btn primary" onClick={saveAll}>
          <span className="btn-icon">💾</span>
          Save All Changes
        </button>
        <button className="btn btn-secondary" onClick={() => sub && navigate(`/admin/titles/${sub.parentTitleId}`)}>
          Cancel
        </button>
      </div>
    </div>
  );
}

