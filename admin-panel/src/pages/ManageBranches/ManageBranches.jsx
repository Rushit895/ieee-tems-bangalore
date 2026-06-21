import { useEffect, useState } from 'react';
import { fetchBranches, createBranch, updateBranch, deleteBranch } from '../../services/api';
import { resolveUpload } from '../../config';
import { 
  School, Trash2, Plus, Info, Edit, Globe, Users, 
  Linkedin, User, MapPin, Upload, Link, Camera, 
  ChevronRight, Save, X, Image as ImageIcon, Facebook, Instagram, AlertTriangle 
} from 'lucide-react';

const ManageBranches = () => {
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [mediaMethod, setMediaMethod] = useState('url');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [advisorPhotoFile, setAdvisorPhotoFile] = useState(null);
  const [chairPhotoFile, setChairPhotoFile] = useState(null);
  
  const initialFormData = { 
    name: '', 
    institutionImage: '', 
    city: '',
    formationDate: '', 
    memberCount: 0,
    description: '',
    website: '',
    socialLinks: { facebook: '', instagram: '', linkedin: '' },
    advisor: { name: '', photo: '', linkedin: '' },
    chair: { name: '', photo: '', linkedin: '' },
    latitude: 12.9716,
    longitude: 77.5946,
    order: 0
  };
  
  const [formData, setFormData] = useState(initialFormData);

  const loadBranches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchBranches();
      console.log("ManageBranches API Response:", res);
      if (res.error) {
        setError(res.error);
        setBranches([]);
      } else {
        setBranches(res.data || []);
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching branches.");
      console.error('Failed to fetch branches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    loadBranches(); 
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

  const handleEdit = (branch) => {
    setEditingId(branch._id);
    setMediaMethod('url');
    const imageUrl = branch.institutionImage || '';
    setImagePreview(imageUrl ? 
      resolveUpload(imageUrl)
      : null);
    
    setFormData({
      name: branch.name || '',
      institutionImage: imageUrl,
      city: branch.city || '',
      formationDate: branch.formationDate ? branch.formationDate.split('T')[0] : '',
      memberCount: branch.memberCount || 0,
      description: branch.description || '',
      website: branch.website || '',
      socialLinks: branch.socialLinks || { facebook: '', instagram: '', linkedin: '' },
      advisor: branch.advisor || { name: '', photo: '', linkedin: '' },
      chair: branch.chair || { name: '', photo: '', linkedin: '' },
      latitude: branch.latitude || 12.9716,
      longitude: branch.longitude || 77.5946,
      order: branch.order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSelectedFile(null);
    setImagePreview(null);
    setAdvisorPhotoFile(null);
    setChairPhotoFile(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.city.trim()) {
      alert("Name and City are required.");
      return;
    }

    setIsSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (['socialLinks', 'advisor', 'chair'].includes(key)) {
            data.append(key, JSON.stringify(formData[key] || {}));
        } else if (key !== 'institutionImage') {
            data.append(key, formData[key]);
        }
      });

      if (mediaMethod === 'file' && selectedFile) {
        data.append('image', selectedFile);
      } else {
        data.append('institutionImage', formData.institutionImage || '');
      }

      if (advisorPhotoFile) data.append('advisorPhoto', advisorPhotoFile);
      if (chairPhotoFile) data.append('chairPhoto', chairPhotoFile);

      const response = editingId ? await updateBranch(editingId, data) : await createBranch(data);

      if (response.error) {
        throw new Error(response.error);
      }
      
      cancelEdit();
      loadBranches();
    } catch (err) {
      console.error("BRANCH SAVE ERROR:", err);
      alert('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this branch?')) {
      try {
        const response = await deleteBranch(id);
        if (response.error) {
          throw new Error(response.error);
        }
        loadBranches();
      } catch (err) {
        console.error("BRANCH DELETE ERROR:", err);
        alert('Error deleting branch: ' + err.message);
      }
    }
  };
  
  const safeBranches = Array.isArray(branches) ? branches : [];

  return (
    <div className="manage-branches-container">
      <header className="dashboard-header">
        <div className="header-with-icon">
          <div className="header-icon-box"><School size={24} /></div>
          <div>
            <h1>Student Branches</h1>
            <p>Enterprise management of the TEMS academic network in Karnataka.</p>
          </div>
        </div>
        <div className="header-actions">
           <button className="btn-primary-modern" onClick={() => { cancelEdit(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
              <Plus size={18} /> <span>Add New Branch</span>
           </button>
        </div>
      </header>

      <form className="modern-form-layout" onSubmit={handleSubmit}>
        <div className="form-main-content">
          {/* Section 1: Basic Identity */}
          <div className="form-card">
            <div className="card-indicator"></div>
            <div className="card-header-modern">
              <div className="icon-badge"><Info size={18} /></div>
              <h3>Basic Information</h3>
            </div>
            <div className="form-grid-2">
              <div className="form-group-modern full-width">
                <label>Branch / Institution Name<span>*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g., IEEE TEMS REVA University" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                  autoFocus
                />
                <span className="helper-text">Official name as registered with IEEE.</span>
              </div>
              <div className="form-group-modern">
                <label>City / Campus Location<span>*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g., Bangalore, Hubli" 
                  value={formData.city} 
                  onChange={e => setFormData({...formData, city: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group-modern">
                <label>Formation Date</label>
                <input 
                  type="date" 
                  value={formData.formationDate} 
                  onChange={e => setFormData({...formData, formationDate: e.target.value})} 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Branch Analytics & Logistics */}
          <div className="form-card">
            <div className="card-indicator orange"></div>
            <div className="card-header-modern">
              <div className="icon-badge orange"><Users size={18} /></div>
              <h3>Branch Details & Logistics</h3>
            </div>
            <div className="form-grid-2">
              <div className="form-group-modern">
                <label>Active Members Count</label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={formData.memberCount} 
                  onChange={e => setFormData({...formData, memberCount: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div className="form-group-modern">
                <label>Display Order</label>
                <input 
                  type="number" 
                  value={formData.order} 
                  onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div className="form-group-modern full-width">
                <label>Institutional Website</label>
                <div className="input-with-prefix">
                  <div className="prefix"><Globe size={14} /></div>
                  <input 
                    type="url" 
                    placeholder="https://reva.edu.in/ieee-tems" 
                    value={formData.website} 
                    onChange={e => setFormData({...formData, website: e.target.value})} 
                  />
                </div>
              </div>
              <div className="form-group-modern full-width">
                <label>About the Branch</label>
                <textarea 
                  placeholder="Describe the activities, impact, and uniqueness of this chapter..." 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Geographic Precision */}
          <div className="form-card">
            <div className="card-indicator blue"></div>
            <div className="card-header-modern">
              <div className="icon-badge blue"><MapPin size={18} /></div>
              <h3>Location & Map Coordinates</h3>
            </div>
            <p className="section-intro">Mandatory for accurate placement on the Karnataka interactive map.</p>
            <div className="form-grid-2">
              <div className="form-group-modern">
                <label>Latitude<span>*</span></label>
                <input 
                  type="number" 
                  step="0.000001"
                  placeholder="e.g., 12.9716" 
                  value={formData.latitude} 
                  onChange={e => setFormData({...formData, latitude: parseFloat(e.target.value) || 0})} 
                  required
                />
              </div>
              <div className="form-group-modern">
                <label>Longitude<span>*</span></label>
                <input 
                  type="number" 
                  step="0.000001"
                  placeholder="e.g., 77.5946" 
                  value={formData.longitude} 
                  onChange={e => setFormData({...formData, longitude: parseFloat(e.target.value) || 0})} 
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4: Media & Branding */}
          <div className="form-card">
            <div className="card-indicator purple"></div>
            <div className="card-header-modern">
              <div className="icon-badge purple"><ImageIcon size={18} /></div>
              <h3>Media & Institution Branding</h3>
            </div>
            <div className="media-management">
              <div className="tab-switcher-modern">
                <button type="button" className={mediaMethod === 'url' ? 'active' : ''} onClick={() => setMediaMethod('url')}><Link size={14} /> Paste URL</button>
                <button type="button" className={mediaMethod === 'file' ? 'active' : ''} onClick={() => setMediaMethod('file')}><Upload size={14} /> Upload Local</button>
              </div>

              <div className="media-input-zone">
                {mediaMethod === 'url' ? (
                  <div className="form-group-modern">
                    <input 
                      type="text" 
                      placeholder="https://images.unsplash.com/photo-..." 
                      value={formData.institutionImage} 
                      onChange={e => {
                        setFormData({...formData, institutionImage: e.target.value});
                        setImagePreview(e.target.value);
                      }} 
                    />
                  </div>
                ) : (
                  <div className="file-drop-zone">
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <Camera size={32} />
                    <p>{selectedFile ? selectedFile.name : 'Drag campus image here or click to browse'}</p>
                  </div>
                )}
                
                {imagePreview && (
                  <div className="image-preview-frame">
                    <img src={imagePreview} alt="Preview" />
                    <button type="button" className="remove-preview" onClick={() => { setImagePreview(null); setSelectedFile(null); setFormData({...formData, institutionImage: ''}); }}><X size={14} /></button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Leadership Hub */}
          <div className="form-card">
            <div className="card-indicator gold"></div>
            <div className="card-header-modern">
              <div className="icon-badge gold"><User size={18} /></div>
              <h3>Leadership Profile</h3>
            </div>
            <div className="leadership-flex-grid">
              <div className="leader-column">
                <h4>Branch Advisor</h4>
                <div className="form-group-modern">
                  <label>Full Name</label>
                  <input type="text" value={formData.advisor?.name || ''} onChange={e => setFormData({...formData, advisor: {...formData.advisor, name: e.target.value}})} />
                </div>
                <div className="form-group-modern">
                  <label>Photo</label>
                  <div className="leader-photo-upload">
                    <input
                      type="file"
                      accept="image/*"
                      id="advisor-photo-input"
                      style={{ display: 'none' }}
                      onChange={e => setAdvisorPhotoFile(e.target.files[0] || null)}
                    />
                    <label htmlFor="advisor-photo-input" className="leader-photo-btn">
                      <Upload size={14} />
                      {advisorPhotoFile ? advisorPhotoFile.name : (formData.advisor?.photo ? 'Replace photo' : 'Upload photo')}
                    </label>
                    {(advisorPhotoFile || formData.advisor?.photo) && (
                      <img
                        className="leader-photo-preview"
                        src={advisorPhotoFile ? URL.createObjectURL(advisorPhotoFile) : resolveUpload(formData.advisor.photo)}
                        alt="Advisor"
                      />
                    )}
                  </div>
                </div>
                <div className="form-group-modern">
                  <label>LinkedIn URL</label>
                  <input type="url" value={formData.advisor?.linkedin || ''} onChange={e => setFormData({...formData, advisor: {...formData.advisor, linkedin: e.target.value}})} />
                </div>
              </div>
              <div className="leader-column">
                <h4>Branch Chair</h4>
                <div className="form-group-modern">
                  <label>Full Name</label>
                  <input type="text" value={formData.chair?.name || ''} onChange={e => setFormData({...formData, chair: {...formData.chair, name: e.target.value}})} />
                </div>
                <div className="form-group-modern">
                  <label>Photo</label>
                  <div className="leader-photo-upload">
                    <input
                      type="file"
                      accept="image/*"
                      id="chair-photo-input"
                      style={{ display: 'none' }}
                      onChange={e => setChairPhotoFile(e.target.files[0] || null)}
                    />
                    <label htmlFor="chair-photo-input" className="leader-photo-btn">
                      <Upload size={14} />
                      {chairPhotoFile ? chairPhotoFile.name : (formData.chair?.photo ? 'Replace photo' : 'Upload photo')}
                    </label>
                    {(chairPhotoFile || formData.chair?.photo) && (
                      <img
                        className="leader-photo-preview"
                        src={chairPhotoFile ? URL.createObjectURL(chairPhotoFile) : resolveUpload(formData.chair.photo)}
                        alt="Chair"
                      />
                    )}
                  </div>
                </div>
                <div className="form-group-modern">
                  <label>LinkedIn URL</label>
                  <input type="url" value={formData.chair?.linkedin || ''} onChange={e => setFormData({...formData, chair: {...formData.chair, linkedin: e.target.value}})} />
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Social Presence */}
          <div className="form-card">
            <div className="card-indicator green"></div>
            <div className="card-header-modern">
              <div className="icon-badge green"><Facebook size={18} /></div>
              <h3>Social Presence</h3>
            </div>
            <div className="form-grid-2">
              <div className="form-group-modern">
                <label>LinkedIn Profile</label>
                <div className="input-with-prefix">
                  <div className="prefix"><Linkedin size={14} /></div>
                  <input type="url" value={formData.socialLinks?.linkedin || ''} onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})} />
                </div>
              </div>
              <div className="form-group-modern">
                <label>Instagram Handle</label>
                <div className="input-with-prefix">
                  <div className="prefix"><Instagram size={14} /></div>
                  <input type="url" value={formData.socialLinks?.instagram || ''} onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, instagram: e.target.value}})} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="sticky-action-bar">
          <div className="action-bar-container">
            <p className="form-status">{editingId ? `Currently editing: ${formData.name}` : 'Ready to add new branch'}</p>
            <div className="action-btns">
              <button type="button" className="btn-secondary" onClick={cancelEdit}>Cancel</button>
              <button type="submit" className="btn-primary-modern" disabled={isSaving}>
                {isSaving ? <span className="spinner"></span> : <Save size={18} />}
                {editingId ? 'Update Branch Record' : 'Save New Branch'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Listing Table */}
      <section className="listing-section-modern">
        <div className="table-card-modern">
          <div className="card-header-modern">
             <div className="icon-badge"><Users size={18} /></div>
             <h3>Active Branches Across Karnataka ({safeBranches.length})</h3>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Identity & Location</th>
                  <th>Statistics</th>
                  <th>Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="3" className="loading-cell">Syncing database records...</td></tr>
                ) : error ? (
                  <tr>
                    <td colSpan="3">
                      <div className="error-state-modern">
                        <AlertTriangle size={32} />
                        <h4>Failed to Load Branches</h4>
                        <p>{error}</p>
                        <button onClick={loadBranches}>Try Again</button>
                      </div>
                    </td>
                  </tr>
                ) : safeBranches.length === 0 ? (
                  <tr>
                    <td colSpan="3">
                      <div className="empty-state-modern">
                        <School size={32} />
                        <h4>No Branches Found</h4>
                        <p>The registry is empty. Add your first student branch using the form above.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  safeBranches.map(branch => (
                    <tr key={branch._id}>
                      <td>
                        <div className="branch-id-cell">
                          <img src={resolveUpload(branch.institutionImage)} alt={branch.name || 'Branch'} />
                          <div className="id-info">
                            <span className="branch-name-main">{branch.name || 'Unnamed Branch'}</span>
                            <span className="branch-city-tag"><MapPin size={10} /> {branch.city || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="stats-pills">
                          <span className="pill"><Users size={12} /> {branch.memberCount || 0} Members</span>
                          <span className="pill gray">Order: {branch.order || 0}</span>
                        </div>
                      </td>
                      <td>
                        <div className="action-flex">
                          <button className="icon-btn edit" onClick={() => handleEdit(branch)}><Edit size={16} /></button>
                          <button className="icon-btn delete" onClick={() => handleDelete(branch._id)}><Trash2 size={16} /></button>
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
        .manage-branches-container { max-width: 1200px; margin: 0 auto; padding-bottom: 100px; }
        .header-with-icon { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .header-icon-box { background: var(--admin-primary); color: white; padding: 12px; border-radius: 12px; box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.3); }
        
        .modern-form-layout { position: relative; }
        .form-main-content { display: flex; flex-direction: column; gap: 2rem; max-width: 900px; margin: 0 auto; }
        
        .form-card { background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 2rem; position: relative; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .card-indicator { position: absolute; left: 0; top: 2rem; bottom: 2rem; width: 4px; background: var(--admin-primary); border-radius: 0 4px 4px 0; }
        .card-indicator.orange { background: #f97316; }
        .card-indicator.blue { background: #3b82f6; }
        .card-indicator.purple { background: #8b5cf6; }
        .card-indicator.gold { background: #eab308; }
        .card-indicator.green { background: #10b981; }

        .card-header-modern { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; }
        .icon-badge { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #eff6ff; color: #2563eb; }
        .icon-badge.orange { background: #fff7ed; color: #ea580c; }
        .icon-badge.blue { background: #eff6ff; color: #2563eb; }
        .icon-badge.purple { background: #f5f3ff; color: #7c3aed; }
        .icon-badge.gold { background: #fefce8; color: #ca8a04; }
        .icon-badge.green { background: #ecfdf5; color: #059669; }
        .card-header-modern h3 { margin: 0; font-size: 1.1rem; font-weight: 700; color: #1e293b; }
        
        .section-intro { font-size: 0.85rem; color: #64748b; margin-top: -1rem; margin-bottom: 1.5rem; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .full-width { grid-column: span 2; }
        
        .form-group-modern { display: flex; flex-direction: column; gap: 8px; }
        .form-group-modern label { font-size: 0.85rem; font-weight: 600; color: #475569; }
        .form-group-modern label span { color: #ef4444; margin-left: 4px; }
        
        .form-group-modern input, .form-group-modern textarea {
          padding: 12px 16px; border-radius: 10px; border: 1px solid #e2e8f0; background: #f9fafb;
          font-size: 0.95rem; transition: all 0.2s; outline: none;
        }
        .form-group-modern input:focus, .form-group-modern textarea:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        .helper-text { font-size: 0.75rem; color: #94a3b8; }
        
        .input-with-prefix { display: flex; align-items: center; background: #f9fafb; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; transition: 0.2s; }
        .input-with-prefix:focus-within { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        .prefix { padding: 0 12px; color: #94a3b8; background: #f1f5f9; height: 100%; display: flex; align-items: center; border-right: 1px solid #e2e8f0; }
        .input-with-prefix input { border: none !important; background: transparent !important; flex: 1; box-shadow: none !important; }

        /* Media Management */
        .tab-switcher-modern { display: flex; gap: 4px; background: #f1f5f9; padding: 4px; border-radius: 10px; margin-bottom: 1.5rem; width: fit-content; }
        .tab-switcher-modern button { border: none; padding: 8px 16px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; color: #64748b; background: none; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
        .tab-switcher-modern button.active { background: white; color: #2563eb; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        
        .file-drop-zone { border: 2px dashed #e2e8f0; border-radius: 12px; padding: 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; color: #94a3b8; cursor: pointer; position: relative; transition: 0.2s; }
        .file-drop-zone:hover { border-color: #3b82f6; background: #f0f7ff; color: #3b82f6; }
        .file-drop-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        
        .image-preview-frame { margin-top: 1.5rem; position: relative; width: 100%; max-width: 300px; border-radius: 12px; overflow: hidden; border: 4px solid white; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .image-preview-frame img { width: 100%; display: block; }
        .remove-preview { position: absolute; top: 8px; right: 8px; background: rgba(255,255,255,0.9); border: none; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ef4444; }

        /* Leadership */
        .leadership-flex-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .leader-column { display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
        .leader-column h4 { margin: 0 0 0.5rem; font-size: 0.9rem; color: #1e293b; text-transform: uppercase; letter-spacing: 0.05em; }
        .leader-photo-upload { display: flex; flex-direction: column; gap: 8px; }
        .leader-photo-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 10px; border: 1px dashed #cbd5e1; background: #f9fafb; font-size: 0.85rem; font-weight: 600; color: #475569; cursor: pointer; transition: 0.2s; width: 100%; box-sizing: border-box; }
        .leader-photo-btn:hover { border-color: #3b82f6; background: #eff6ff; color: #2563eb; }
        .leader-photo-preview { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; }

        /* Sticky Bar */
        .sticky-action-bar { position: sticky; bottom: 0; left: 0; right: 0; background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); padding: 1.25rem; border-top: 1px solid #e2e8f0; z-index: 100; margin-top: 3rem; }
        .action-bar-container { max-width: 900px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .form-status { font-size: 0.85rem; font-weight: 600; color: #64748b; }
        .action-btns { display: flex; gap: 1rem; }
        .btn-primary-modern { background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .btn-primary-modern:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4); }
        .btn-secondary { background: white; border: 1px solid #e2e8f0; padding: 12px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-secondary:hover { background: #f1f5f9; }

        /* Listing Section */
        .listing-section-modern { margin-top: 4rem; }
        .table-card-modern { background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .branch-id-cell { display: flex; align-items: center; gap: 1rem; padding: 10px 0; }
        .branch-id-cell img { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; border: 1px solid #e2e8f0; background-color: #f8fafc; }
        .id-info { display: flex; flex-direction: column; gap: 4px; }
        .branch-name-main { font-weight: 700; color: #1e293b; }
        .branch-city-tag { font-size: 0.75rem; color: #2563eb; font-weight: 700; background: #eff6ff; padding: 2px 8px; border-radius: 4px; width: fit-content; display: flex; align-items: center; gap: 4px; }
        
        .stats-pills { display: flex; gap: 8px; }
        .pill { font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; background: #f0fdf4; color: #166534; display: flex; align-items: center; gap: 6px; }
        .pill.gray { background: #f1f5f9; color: #475569; }
        
        .action-flex { display: flex; gap: 8px; }
        .icon-btn { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; background: white; cursor: pointer; transition: 0.2s; color: #64748b; }
        .icon-btn.edit:hover { background: #eff6ff; border-color: #3b82f6; color: #3b82f6; }
        .icon-btn.delete:hover { background: #fef2f2; border-color: #ef4444; color: #ef4444; }

        .spinner { width: 18px; height: 18px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .error-state-modern, .empty-state-modern { text-align: center; padding: 4rem 2rem; }
        .error-state-modern h4, .empty-state-modern h4 { font-size: 1.25rem; color: #1E293B; margin: 1rem 0 0.5rem; }
        .error-state-modern p, .empty-state-modern p { color: #64748B; margin-bottom: 1.5rem; max-width: 400px; margin-left: auto; margin-right: auto; }
        .error-state-modern svg, .empty-state-modern svg { color: var(--ieee-blue); }
        .error-state-modern button { background: var(--ieee-blue); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; }
        
        @media (max-width: 768px) {
          .form-grid-2, .leadership-flex-grid { grid-template-columns: 1fr; }
          .full-width { grid-column: span 1; }
          .action-bar-container { flex-direction: column; gap: 1rem; text-align: center; }
          .manage-branches-container { padding: 1rem; }
        }
      `}} />
    </div>
  );
};

export default ManageBranches;