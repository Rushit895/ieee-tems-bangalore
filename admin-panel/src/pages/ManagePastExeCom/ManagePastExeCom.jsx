import { useEffect, useState } from 'react';
import { resolveUpload } from '../../config';
import {
  fetchPastExeCom, createPastExeComMember,
  updatePastExeComMember, deletePastExeComMember
} from '../../services/api';
import {
  Users, Trash2, Plus, Edit, Upload, Save, X,
  Calendar, Hash, AlertTriangle, User as UserIcon
} from 'lucide-react';

const ROLES = ['Chair', 'Vice Chair', 'Secretary', 'Treasurer', 'Webmaster',
               'Technical Lead', 'Events Lead', 'Design Lead', 'Member'];

const ManagePastExeCom = () => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [filterYear, setFilterYear] = useState('all');

  const initialForm = {
    name: '', role: 'Chair', year: new Date().getFullYear(),
    linkedin: '', order: 0
  };
  const [formData, setFormData] = useState(initialForm);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchPastExeCom();
      setMembers(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const years = [...new Set(members.map(m => m.year))].sort((a, b) => b - a);
  const displayed = filterYear === 'all'
    ? members
    : members.filter(m => m.year === Number(filterYear));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleEdit = (m) => {
    setEditingId(m._id);
    setPhotoFile(null);
    setPhotoPreview(m.photo
      ? resolveUpload(m.photo)
      : null);
    setFormData({
      name: m.name || '', role: m.role || 'Chair',
      year: m.year || new Date().getFullYear(),
      linkedin: m.linkedin || '', order: m.order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(k => data.append(k, formData[k]));
      if (photoFile) data.append('photo', photoFile);
      if (editingId) {
        await updatePastExeComMember(editingId, data);
      } else {
        await createPastExeComMember(data);
      }
      cancelEdit();
      await load();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member permanently?')) return;
    try {
      await deletePastExeComMember(id);
      await load();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="manage-branches-container">
      <header className="dashboard-header">
        <div className="header-with-icon">
          <div className="header-icon-box"><Users size={24} /></div>
          <div>
            <h1>Past ExeCom</h1>
            <p>Manage historical Executive Committee members by year.</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-primary-modern" onClick={() => { cancelEdit(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <Plus size={18} /> <span>Add Member</span>
          </button>
        </div>
      </header>

      {/* Form */}
      <form className="modern-form-layout" onSubmit={handleSubmit}>
        <div className="form-main-content">
          <div className="form-card">
            <div className="card-indicator gold"></div>
            <div className="card-header-modern">
              <div className="icon-badge gold"><UserIcon size={18} /></div>
              <h3>{editingId ? 'Edit' : 'Add'} Past ExeCom Member</h3>
            </div>
            <div className="form-grid-2">
              <div className="form-group-modern full-width">
                <label>Full Name<span>*</span></label>
                <input type="text" placeholder="e.g., Dr. Anita Desai" required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>

              <div className="form-group-modern">
                <label>Role<span>*</span></label>
                <select value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="form-group-modern">
                <label>Year<span>*</span></label>
                <input type="number" placeholder="2025" required
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })} />
              </div>

              <div className="form-group-modern">
                <label>LinkedIn URL</label>
                <input type="url" placeholder="https://linkedin.com/in/..."
                  value={formData.linkedin}
                  onChange={e => setFormData({ ...formData, linkedin: e.target.value })} />
              </div>

              <div className="form-group-modern">
                <label>Display Order</label>
                <input type="number" value={formData.order}
                  onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
              </div>

              <div className="form-group-modern full-width">
                <label>Photo</label>
                <div className="leader-photo-upload">
                  <input type="file" accept="image/*" id="past-execom-photo"
                    style={{ display: 'none' }}
                    onChange={handleFileChange} />
                  <label htmlFor="past-execom-photo" className="leader-photo-btn">
                    <Upload size={14} />
                    {photoFile ? photoFile.name : (formData.photo ? 'Replace photo' : 'Upload photo')}
                  </label>
                  {photoPreview && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                      <img src={photoPreview} alt="Preview"
                        style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                      <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                        onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}>
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky-action-bar">
          <div className="action-bar-container">
            <p className="form-status">{editingId ? `Editing member` : 'Add new member'}</p>
            <div className="action-btns">
              {editingId && (
                <button type="button" className="btn-secondary" onClick={cancelEdit}>Cancel</button>
              )}
              <button type="submit" className="btn-primary-modern" disabled={isSaving}>
                {isSaving ? <span className="spinner"></span> : <Save size={18} />}
                {editingId ? 'Update Member' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Filter + Table */}
      <section className="listing-section-modern">
        <div className="table-card-modern">
          <div className="card-header-modern" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="icon-badge"><Users size={18} /></div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                Past ExeCom Members ({displayed.length})
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                <Calendar size={14} style={{ marginRight: 4 }} /> Filter by Year:
              </label>
              <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.875rem' }}>
                <option value="all">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Role</th>
                  <th>Year</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="4" className="loading-cell">Loading records...</td></tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4">
                      <div className="error-state-modern">
                        <AlertTriangle size={32} />
                        <h4>Failed to Load</h4>
                        <p>{error}</p>
                        <button onClick={load}>Try Again</button>
                      </div>
                    </td>
                  </tr>
                ) : displayed.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state-modern">
                        <UserIcon size={32} />
                        <h4>No Members Found</h4>
                        <p>Add your first past ExeCom member above.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayed.map(m => (
                    <tr key={m._id}>
                      <td>
                        <div className="member-cell">
                          {m.photo
                            ? <img className="member-avatar"
                                src={resolveUpload(m.photo)}
                                alt={m.name} />
                            : <div className="member-avatar" style={{ background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                <UserIcon size={20} />
                              </div>
                          }
                          <div className="member-info">
                            <span className="member-name-main">{m.name}</span>
                            {m.linkedin && (
                              <a href={m.linkedin} target="_blank" rel="noreferrer"
                                style={{ fontSize: '0.75rem', color: '#0077b5' }}>LinkedIn</a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td><span className="role-tag">{m.role}</span></td>
                      <td><span className="year-pill"><Calendar size={12} /> {m.year}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-flex-right">
                          <button className="icon-btn edit" onClick={() => handleEdit(m)}><Edit size={16} /></button>
                          <button className="icon-btn delete" onClick={() => handleDelete(m._id)}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .member-cell { display: flex; align-items: center; gap: 12px; }
        .member-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); background-color: #f8fafc; flex-shrink: 0; }
        .member-info { display: flex; flex-direction: column; gap: 2px; }
        .member-name-main { font-weight: 700; color: #1E293B; font-size: 0.95rem; }
        .year-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: #EFF6FF; color: #2563EB; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
        .role-tag { font-size: 0.85rem; font-weight: 600; color: #475569; }
        .action-flex-right { display: flex; justify-content: flex-end; gap: 8px; }
        .icon-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #E2E8F0; background: white; color: #64748B; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .icon-btn.edit:hover { background: #EFF6FF; border-color: var(--ieee-blue); color: var(--ieee-blue); }
        .icon-btn.delete:hover { background: #FEF2F2; border-color: var(--status-danger); color: var(--status-danger); }
        .spinner { width: 18px; height: 18px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-cell, .error-state-modern, .empty-state-modern { padding: 4rem !important; text-align: center; color: #94A3B8; }
        .error-state-modern h4, .empty-state-modern h4 { font-size: 1.1rem; color: #1E293B; margin: 1rem 0 0.5rem; }
        .error-state-modern p, .empty-state-modern p { color: #64748B; margin-bottom: 1rem; }
        .error-state-modern button { background: var(--ieee-blue); color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .form-grid-2 select { padding: 12px 16px; border-radius: 10px; border: 1px solid #e2e8f0; background: #f9fafb; font-size: 0.95rem; outline: none; }
        .form-grid-2 select:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59,130,246,0.1); }
      `}} />
    </div>
  );
};

export default ManagePastExeCom;
