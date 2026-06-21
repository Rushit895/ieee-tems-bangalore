import { useEffect, useState } from 'react';
import { fetchTeam, createTeamMember, deleteTeamMember, updateTeamMember } from '../../services/api';
import { resolveUpload } from '../../config';
import { 
  Users, Trash2, Plus, Info, Edit, Mail, Linkedin, 
  Upload, Link, Camera, ChevronRight, Save, X, 
  User as UserIcon, Calendar, Hash, AlertTriangle
} from 'lucide-react';

const ManageTeam = () => {
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [mediaMethod, setMediaMethod] = useState('url');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const initialFormData = { 
    name: '', 
    role: '', 
    photo: '', 
    bio: '',
    email: '',
    linkedin: '',
    year: new Date().getFullYear(),
    order: 0
  };

  const [formData, setFormData] = useState(initialFormData);

  const loadTeam = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const raw = await fetchTeam();
      // Backend may return a plain array OR a wrapped { status, data: [...] } object
      const data = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : null);
      if (!data) {
        console.error('API did not return an array. Response:', raw);
        throw new Error('Bad response from server: Expected an array of team members.');
      }
      const sorted = data.sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return a.order - b.order;
      });
      setTeam(sorted);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch team members:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    loadTeam(); 
  }, []);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setMediaMethod('url');
    const imageUrl = member.photo || '';
    setImagePreview(imageUrl ? resolveUpload(imageUrl) : null);
    
    setFormData({
      name: member.name || '',
      role: member.role || '',
      photo: imageUrl,
      bio: member.bio || '',
      email: member.email || '',
      linkedin: member.linkedin || '',
      year: member.year || new Date().getFullYear(),
      order: member.order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSelectedFile(null);
    setImagePreview(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      alert("Name and Role are required.");
      return;
    }
    setIsSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (mediaMethod === 'file' && selectedFile) {
        data.set('photo', selectedFile);
      }

      await (editingId ? updateTeamMember(editingId, data) : createTeamMember(data));
      
      cancelEdit();
      await loadTeam(); // Re-fetch data after submission
    } catch (err) {
      console.error("TEAM SAVE ERROR:", err);
      alert('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await deleteTeamMember(id);
        await loadTeam(); // Re-fetch data after deletion
      } catch (err) {
        console.error("TEAM DELETE ERROR:", err);
        alert('Error deleting team member: ' + err.message);
      }
    }
  };

  const safeTeam = Array.isArray(team) ? team : [];

  return (
    <div className="manage-team-modern">
      <header className="dashboard-header">
        <div className="header-title-area">
          <h1>Leadership Hub</h1>
          <p>Manage the Executive Committee (ExeCom) for active and historical sections.</p>
        </div>
        <div className="header-actions">
           <button className="btn-primary-modern" onClick={() => { cancelEdit(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
              <Plus size={18} /> <span>Add New Member</span>
           </button>
        </div>
      </header>

      <form className="modern-form-layout" onSubmit={handleSubmit}>
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="icon-badge"><Users size={18} /></div>
            <h4>{editingId ? 'Modify' : 'Onboard'} Team Member</h4>
          </div>
          
          <div className="form-body">
            <div className="form-group-modern">
              <label>Full Name<span>*</span></label>
              <div className="input-with-icon">
                <input 
                  type="text" 
                  placeholder="e.g., Dr. Anita Desai" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                  autoFocus
                />
              </div>
            </div>
            
            <div className="form-group-modern">
              <label>Designation / Society Role<span>*</span></label>
              <input 
                type="text" 
                placeholder="e.g., Section Chair" 
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group-modern">
              <label>Academic / Service Year<span>*</span></label>
              <div className="input-with-icon">
                <input 
                  type="number" 
                  placeholder="2026" 
                  value={formData.year} 
                  onChange={e => setFormData({...formData, year: parseInt(e.target.value) || new Date().getFullYear()})} 
                  required
                />
              </div>
            </div>

            <div className="form-group-modern">
              <label>Visual Order Index</label>
              <input 
                type="number" 
                placeholder="0"
                value={formData.order} 
                onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} 
              />
            </div>

            <div className="form-group-modern full-width">
              <label>Professional Biography</label>
              <textarea 
                placeholder="Brief introduction and professional achievements..." 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
                rows={4}
              />
            </div>

            <div className="form-group-modern full-width">
              <label>Official Profile Photo</label>
              <div className="tab-switcher-modern">
                <button type="button" className={mediaMethod === 'url' ? 'active' : ''} onClick={() => setMediaMethod('url')}><Link size={14} /> Profile URL</button>
                <button type="button" className={mediaMethod === 'file' ? 'active' : ''} onClick={() => setMediaMethod('file')}><Upload size={14} /> Upload Local</button>
              </div>

              <div className="media-input-box">
                {mediaMethod === 'url' ? (
                  <input 
                    type="text" 
                    placeholder="https://..." 
                    value={formData.photo} 
                    onChange={e => {
                      setFormData({...formData, photo: e.target.value});
                      setImagePreview(e.target.value);
                    }} 
                  />
                ) : (
                  <div className="file-drop-zone">
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <Camera size={32} />
                    <p>{selectedFile ? selectedFile.name : 'Select high-resolution profile photo'}</p>
                  </div>
                )}
                
                {imagePreview && (
                  <div className="image-preview-modern">
                    <img src={imagePreview} alt="Preview" style={{ objectFit: 'contain', background: '#f8fafc' }} />
                    <button type="button" className="remove-image-btn" onClick={() => { setImagePreview(null); setSelectedFile(null); setFormData({...formData, photo: ''}); }}><X size={14} /></button>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group-modern">
              <label>Official Email</label>
              <input 
                type="email" 
                placeholder="member@ieee.org" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>

            <div className="form-group-modern">
              <label>LinkedIn ID / URL</label>
              <div className="input-with-prefix">
                <input 
                  type="url" 
                  placeholder="https://linkedin.com/in/..." 
                  value={formData.linkedin} 
                  onChange={e => setFormData({...formData, linkedin: e.target.value})} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky-action-bar">
          <div className="bar-actions">
            <button type="button" className="btn-secondary-modern" onClick={cancelEdit}>Cancel</button>
            <button type="submit" className="btn-primary-modern" disabled={isSaving}>
              {isSaving ? <span className="spinner"></span> : <Save size={18} />}
              {editingId ? 'Commit Member Updates' : 'Add to ExeCom'}
            </button>
          </div>
        </div>
      </form>

      <section className="table-card-modern">
        <div className="card-header">
          <h3><Users size={18} /> Section Leadership Directory ({safeTeam.length})</h3>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Member Identity</th>
                <th>Service Period</th>
                <th>Designation</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="loading-cell">Loading leadership records...</td></tr>
              ) : error ? (
                <tr>
                  <td colSpan="4">
                    <div className="error-state-modern">
                      <AlertTriangle size={32} />
                      <h4>Failed to Load Team Members</h4>
                      <p>{error}</p>
                      <button onClick={loadTeam}>Try Again</button>
                    </div>
                  </td>
                </tr>
              ) : safeTeam.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state-modern">
                      <div className="empty-state-icon"><UserIcon size={32} /></div>
                      <h4>No Members Found</h4>
                      <p>No members registered. Start building your committee above.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                safeTeam.map(member => (
                  <tr key={member._id}>
                    <td>
                      <div className="member-cell">
                        <img className="member-avatar" src={resolveUpload(member.photo)} alt={member.name || 'Member'}/>
                        <div className="member-info">
                          <span className="member-name-main">{member.name || 'Unnamed Member'}</span>
                          <div className="member-social-links">
                             {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer"><Linkedin size={12} /></a>}
                             {member.email && <a href={`mailto:${member.email}`}><Mail size={12} /></a>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="year-pill"><Calendar size={12} /> {member.year}</span>
                    </td>
                    <td>
                      <span className="role-tag">{member.role}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-flex-right">
                        <button className="icon-btn edit" onClick={() => handleEdit(member)}><Edit size={16} /></button>
                        <button className="icon-btn delete" onClick={() => handleDelete(member._id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .member-cell { display: flex; align-items: center; gap: 12px; }
        .member-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); background-color: #f8fafc; }
        .member-info { display: flex; flex-direction: column; gap: 2px; }
        .member-name-main { font-weight: 700; color: #1E293B; font-size: 0.95rem; }
        .member-social-links { display: flex; gap: 8px; color: #94A3B8; }
        .member-social-links a { color: inherit; transition: 0.2s; }
        .member-social-links a:hover { color: var(--ieee-blue); }
        
        .year-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: #EFF6FF; color: #2563EB; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
        .role-tag { font-size: 0.85rem; font-weight: 600; color: #475569; }
        
        .action-flex-right { display: flex; justify-content: flex-end; gap: 8px; }
        .icon-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #E2E8F0; background: white; color: #64748B; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .icon-btn.edit:hover { background: #EFF6FF; border-color: var(--ieee-blue); color: var(--ieee-blue); }
        .icon-btn.delete:hover { background: #FEF2F2; border-color: var(--status-danger); color: var(--status-danger); }
        
        .bar-actions { display: flex; gap: 1rem; }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-cell, .error-state-modern, .empty-state-modern { padding: 4rem !important; text-align: center; color: #94A3B8; font-style: italic; }
        .error-state-modern h4, .empty-state-modern h4 { font-size: 1.25rem; color: #1E293B; margin: 1rem 0 0.5rem; }
        .error-state-modern p, .empty-state-modern p { color: #64748B; margin-bottom: 1.5rem; max-width: 400px; margin-left: auto; margin-right: auto; }
        .error-state-modern svg, .empty-state-modern .empty-state-icon svg { color: var(--ieee-blue); }
        .error-state-modern button { background: var(--ieee-blue); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; }
      `}} />
    </div>
  );
};

export default ManageTeam;