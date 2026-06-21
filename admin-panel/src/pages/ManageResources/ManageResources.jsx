import { useEffect, useState } from 'react';
import { fetchResources, createResource, updateResource, deleteResource } from '../../services/api';
import { resolveUpload } from '../../config';
import { 
  Download, Trash2, Plus, Edit, Image as ImageIcon, FileText, 
  Filter, Tag, Upload, Link, Camera, Save, X, ChevronRight,
  Info, Box, Briefcase, AlertTriangle
} from 'lucide-react';

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [mediaMethod, setMediaMethod] = useState('url');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const initialFormData = { 
    name: '', 
    description: '', 
    previewImage: '', 
    downloadUrl: '',
    fileType: 'PNG',
    fileSize: '',
    category: 'IEEE',
    order: 0
  };
  
  const [formData, setFormData] = useState(initialFormData);

  const loadResources = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchResources();
      console.log("ManageResources API Response:", res);
      if (res.error) {
        setError(res.error);
        setResources([]);
      } else {
        setResources(res.data || []);
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching resources.");
      console.error('Failed to fetch resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    loadResources(); 
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

  const handleEdit = (resource) => {
    setEditingId(resource._id);
    setMediaMethod('url');
    const imageUrl = resource.previewImage || '';
    setImagePreview(imageUrl ? resolveUpload(imageUrl) : null);
    
    setFormData({
      name: resource.name || '',
      description: resource.description || '',
      previewImage: imageUrl,
      downloadUrl: resource.downloadUrl || '',
      fileType: resource.fileType || 'PNG',
      fileSize: resource.fileSize || '',
      category: resource.category || 'IEEE',
      order: resource.order || 0
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
    setIsSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'previewImage') data.append(key, formData[key] || '');
      });

      if (mediaMethod === 'file' && selectedFile) {
        data.append('image', selectedFile);
      } else {
        data.append('previewImage', formData.previewImage || '');
      }

      const response = editingId ? await updateResource(editingId, data) : await createResource(data);

      if (response.error) {
        throw new Error(response.error);
      }
      cancelEdit();
      loadResources();
    } catch (err) {
      console.error("RESOURCE SAVE ERROR:", err);
      alert('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to remove this resource from the library?')) {
      try {
        const response = await deleteResource(id);
        if(response.error) {
          throw new Error(response.error);
        }
        loadResources();
      } catch (err) {
        console.error("RESOURCE DELETE ERROR:", err);
        alert('Error deleting resource: ' + err.message);
      }
    }
  };

  const safeResources = resources || [];

  return (
    <div className="manage-resources-modern">
      <header className="dashboard-header">
        <div className="header-title-area">
          <h1>Asset Repository</h1>
          <p>Curate official brand assets, logos, and high-performance templates for section initiatives.</p>
        </div>
        <div className="header-actions">
           <button className="btn-primary-modern" onClick={() => { cancelEdit(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
              <Plus size={18} /> <span>Register New Asset</span>
           </button>
        </div>
      </header>

      <form className="modern-form-layout" onSubmit={handleSubmit}>
        <div className="form-main-content">
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="icon-badge"><Box size={18} /></div>
              <h4>{editingId ? 'Modify' : 'Register'} Brand Asset</h4>
            </div>
            
            <div className="form-body">
              <div className="form-group-modern full-width">
                <label>Resource Name<span>*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g., IEEE TEMS Primary Logo (Vector)" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                  autoFocus
                />
              </div>

              <div className="form-group-modern">
                <label>Classification<span>*</span></label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                  <option value="IEEE">IEEE Official</option>
                  <option value="TEMS">IEEE TEMS Global</option>
                  <option value="BANGALORE SECTION">Bangalore Section</option>
                  <option value="AGM REPORT">AGM & Governance</option>
                  <option value="TEMPLATES">Templates & Kits</option>
                  <option value="OTHER">Other Assets</option>
                </select>
              </div>

              <div className="form-group-modern">
                <label>Format & extension</label>
                <select value={formData.fileType} onChange={e => setFormData({...formData, fileType: e.target.value})}>
                  <option value="PNG">PNG Image</option>
                  <option value="SVG">SVG Vector</option>
                  <option value="JPG">JPG / JPEG</option>
                  <option value="PDF">PDF Document</option>
                  <option value="ZIP">ZIP Archive</option>
                </select>
              </div>

              <div className="form-group-modern full-width">
                <label>Asset Description</label>
                <textarea 
                  placeholder="Usage guidelines, variants, or context for this specific asset..." 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  rows={3}
                />
              </div>

              <div className="form-group-modern">
                <label>Direct Download URL<span>*</span></label>
                <div className="input-with-icon">
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    value={formData.downloadUrl} 
                    onChange={e => setFormData({...formData, downloadUrl: e.target.value})} 
                    required
                  />
                </div>
              </div>

              <div className="form-group-modern">
                <label>File Weight (e.g., 2.4 MB)</label>
                <input 
                  type="text" 
                  placeholder="Size info for users" 
                  value={formData.fileSize} 
                  onChange={e => setFormData({...formData, fileSize: e.target.value})} 
                />
              </div>

              <div className="form-group-modern full-width">
                <label>Visual Preview / Thumbnail</label>
                <div className="tab-switcher-modern">
                  <button type="button" className={mediaMethod === 'url' ? 'active' : ''} onClick={() => setMediaMethod('url')}><Link size={14} /> Preview URL</button>
                  <button type="button" className={mediaMethod === 'file' ? 'active' : ''} onClick={() => setMediaMethod('file')}><Upload size={14} /> Upload Local</button>
                </div>

                <div className="media-input-box">
                  {mediaMethod === 'url' ? (
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      value={formData.previewImage} 
                      onChange={e => {
                        setFormData({...formData, previewImage: e.target.value});
                        setImagePreview(e.target.value);
                      }} 
                    />
                  ) : (
                    <div className="file-drop-zone">
                      <input type="file" accept="image/*" onChange={handleFileChange} />
                      <Camera size={32} />
                      <p>{selectedFile ? selectedFile.name : 'Click to select preview thumbnail'}</p>
                    </div>
                  )}
                  
                  {imagePreview && (
                    <div className="image-preview-modern">
                      <img src={imagePreview} alt="Preview" style={{ objectFit: 'contain', padding: '10px', background: '#f8fafc' }} />
                      <button type="button" className="remove-image-btn" onClick={() => { setImagePreview(null); setSelectedFile(null); setFormData({...formData, previewImage: ''}); }}><X size={14} /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky-action-bar">
          <div className="bar-actions">
            <button type="button" className="btn-secondary-modern" onClick={cancelEdit}>Reset</button>
            <button type="submit" className="btn-primary-modern" disabled={isSaving}>
              {isSaving ? <span className="spinner"></span> : <Save size={18} />}
              {editingId ? 'Push Asset Updates' : 'Publish to Library'}
            </button>
          </div>
        </div>
      </form>

      <section className="table-card-modern">
        <div className="card-header">
          <h3><Briefcase size={18} /> Resource Inventory ({safeResources.length})</h3>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Asset Identity</th>
                <th>Classification</th>
                <th>Specifications</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="loading-cell">Syncing resource database...</td></tr>
              ) : error ? (
                <tr>
                  <td colSpan="4">
                    <div className="error-state-modern">
                      <AlertTriangle size={32} />
                      <h4>Failed to Load Resources</h4>
                      <p>{error}</p>
                      <button onClick={loadResources}>Try Again</button>
                    </div>
                  </td>
                </tr>
              ) : safeResources.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state-modern">
                      <div className="empty-state-icon"><Box size={32} /></div>
                      <h4>Library is Empty</h4>
                      <p>Library is currently empty. Onboard your first asset above.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                safeResources.map(item => (
                  <tr key={item._id}>
                    <td>
                      <div className="resource-cell">
                        <div className="resource-thumb-box">
                          <img src={resolveUpload(item.previewImage)}
                               alt={item.name || 'Resource'} onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=📦' }} />
                        </div>
                        <div className="resource-info">
                          <span className="resource-name-main">{item.name || 'Untitled Resource'}</span>
                          <a href={item.downloadUrl} target="_blank" rel="noreferrer" className="dl-link"><Download size={10} /> Get Source</a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`cat-badge ${(item.category || '').toLowerCase().replace(' ', '-')}`}>{item.category || 'N/A'}</span>
                    </td>
                    <td>
                      <div className="spec-cell">
                        <span className="type-pill">{item.fileType || 'N/A'}</span>
                        <span className="size-label">{item.fileSize || 'Size N/A'}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-flex-right">
                        <button className="icon-btn edit" onClick={() => handleEdit(item)}><Edit size={16} /></button>
                        <button className="icon-btn delete" onClick={() => handleDelete(item._id)}><Trash2 size={16} /></button>
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
        .resource-cell { display: flex; align-items: center; gap: 12px; }
        .resource-thumb-box { width: 44px; height: 44px; padding: 6px; background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .resource-thumb-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .resource-info { display: flex; flex-direction: column; gap: 2px; }
        .resource-name-main { font-weight: 700; color: #1E293B; font-size: 0.95rem; }
        .dl-link { font-size: 0.75rem; color: #2563EB; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 4px; }
        .dl-link:hover { text-decoration: underline; }
        
        .cat-badge { font-size: 0.65rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.05em; background: #F1F5F9; color: #64748B; }
        .cat-badge.ieee-official, .cat-badge.ieee { background: #EFF6FF; color: #2563EB; }
        .cat-badge.agm-report { background: #FEF3C7; color: #92400E; }
        
        .spec-cell { display: flex; align-items: center; gap: 8px; }
        .type-pill { font-size: 0.7rem; font-weight: 700; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 2px 6px; border-radius: 4px; color: #475569; }
        .size-label { font-size: 0.75rem; color: #94A3B8; }
        
        .action-flex-right { display: flex; justify-content: flex-end; gap: 8px; }
        .icon-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #E2E8F0; background: white; color: #64748B; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .icon-btn.edit:hover { background: #EFF6FF; border-color: var(--ieee-blue); color: var(--ieee-blue); }
        .icon-btn.delete:hover { background: #FEF2F2; border-color: var(--status-danger); color: var(--status-danger); }
        
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

export default ManageResources;