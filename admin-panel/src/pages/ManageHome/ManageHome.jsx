import { useState, useEffect } from 'react';
import { fetchHomeSection, createHomeEntry, deleteHomeEntry, updateHomeEntry } from '../../services/api';
import { resolveUpload } from '../../config';
import { 
  Plus, Trash2, Layout, Settings, Upload, Link, Camera, 
  Edit, Save, X, ChevronRight, Info, BarChart3, Users, 
  Image as ImageIcon, ListFilter, MousePointer2, Grid, Hash,
  Award, Zap, ListChecks, Target, Share2, FileText, MapPin, Phone, Mail, AlertTriangle
} from 'lucide-react';

const ManageHome = () => {
  const [section, setSection] = useState('hero');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [mediaMethod, setMediaMethod] = useState('url');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({});

  const sections = [
    { id: 'hero', label: 'Hero Slider', icon: <ImageIcon size={18} />, fields: [
      { name: 'title', label: 'Slide Title (HTML supported)', type: 'text', placeholder: 'Engineering Future <br><span>Strategic Leaders</span>' },
      { name: 'subtitle', label: 'Section Label', type: 'text', placeholder: 'Leadership • Innovation' },
      { name: 'content', label: 'Slide Description', type: 'textarea', placeholder: 'IEEE TEMS bridges technical excellence...' },
      { name: 'image', label: 'Slide Image', type: 'media' },
      { name: 'buttonText', label: 'CTA Button Text', type: 'text', placeholder: 'Become a Member' },
      { name: 'buttonLink', label: 'CTA Button Link', type: 'text', placeholder: 'join-ieee.html' },
      { name: 'order', label: 'Display Order', type: 'number' }
    ]},
    { id: 'live-updates', label: 'Live Ticker', icon: <ListFilter size={18} />, fields: [
      { name: 'text', label: 'Update Text', type: 'text', placeholder: 'Registration open for TEMSCON 2026' },
      { name: 'active', label: 'Visible on Site', type: 'checkbox' }
    ]},
    { id: 'counters', label: 'Stats Counters', icon: <BarChart3 size={18} />, fields: [
      { name: 'label', label: 'Label', type: 'text', placeholder: 'Total Members' },
      { name: 'value', label: 'Value', type: 'number', placeholder: '1500' },
      { name: 'icon', label: 'FontAwesome Icon Class', type: 'text', placeholder: 'fas fa-users' }
    ]},
    { id: 'karnataka', label: 'Karnataka Presence', icon: <MousePointer2 size={18} />, fields: [
      { name: 'title', label: 'Section Title', type: 'text' },
      { name: 'content', label: 'Body Content', type: 'textarea' },
      { name: 'image', label: 'Media (Video/Image)', type: 'media' }
    ]},
    { id: 'chair-message', label: 'Chair Message', icon: <Users size={18} />, fields: [
      { name: 'name', label: 'Chair Name', type: 'text', placeholder: 'Dr. S. Rama' },
      { name: 'designation', label: 'Designation', type: 'text', placeholder: 'Chair, IEEE TEMS Bangalore (2026)' },
      { name: 'message', label: 'Message Content', type: 'textarea' },
      { name: 'image', label: 'Chair Photo', type: 'media' }
    ]},
    { id: 'gif-section', label: 'Interactive GIF Block', icon: <Zap size={18} />, fields: [
      { name: 'title', label: 'Section Title', type: 'text' },
      { name: 'description', label: 'Body Text', type: 'textarea' },
      { name: 'gifUrl', label: 'GIF Image', type: 'media' }
    ]},
    { id: 'gallery', label: 'Home Gallery', icon: <Grid size={18} />, fields: [
      { name: 'imageUrl', label: 'Asset Image', type: 'media' },
      { name: 'caption', label: 'Caption', type: 'text' }
    ]},
    { id: 'current-updates', label: 'Student Activities', icon: <Hash size={18} />, fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'image', label: 'Cover Image', type: 'media' }
    ]},
    { id: 'activities', label: 'What We Do (About)', icon: <Zap size={18} />, fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'icon', label: 'Icon Class', type: 'text', placeholder: 'fas fa-check' },
      { name: 'order', label: 'Order', type: 'number' }
    ]},
    { id: 'membership-categories', label: 'Membership Types', icon: <Award size={18} />, fields: [
      { name: 'name', label: 'Category Name', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'benefits', label: 'Benefits (Comma separated)', type: 'text' },
      { name: 'isFeatured', label: 'Featured Category', type: 'checkbox' },
      { name: 'order', label: 'Order', type: 'number' }
    ]},
    { id: 'advantages', label: 'Why Join Advantages', icon: <ListChecks size={18} />, fields: [
      { name: 'title', label: 'Advantage Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'icon', label: 'Icon Class', type: 'text', placeholder: 'fas fa-globe' },
      { name: 'order', label: 'Order', type: 'number' }
    ]},
    { id: 'join-steps', label: 'How to Join Steps', icon: <ChevronRight size={18} />, fields: [
      { name: 'title', label: 'Step Title', type: 'text' },
      { name: 'description', label: 'Step Instructions', type: 'textarea' },
      { name: 'stepNumber', label: 'Step #', type: 'number' },
      { name: 'order', label: 'Sort Order', type: 'number' }
    ]},
    { id: 'focus-areas', label: 'Focus Areas (Pillars)', icon: <Target size={18} />, fields: [
      { name: 'title', label: 'Pillar Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'icon', label: 'Icon Class', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' }
    ]},
    { id: 'social-links', label: 'Social Media Links', icon: <Share2 size={18} />, fields: [
      { name: 'platform', label: 'Platform', type: 'text' },
      { name: 'url', label: 'Profile URL', type: 'text' },
      { name: 'icon', label: 'FontAwesome Icon', type: 'text', placeholder: 'fab fa-linkedin' },
      { name: 'order', label: 'Order', type: 'number' }
    ]},
    { id: 'about-intro', label: 'About Intro (Home)', icon: <FileText size={18} />, fields: [
      { name: 'title', label: 'Heading', type: 'text' },
      { name: 'content', label: 'Main Text', type: 'textarea' },
      { name: 'linkText', label: 'Button Text', type: 'text' },
      { name: 'linkUrl', label: 'Button Link', type: 'text' }
    ]},
    { id: 'contact-info', label: 'Section Contact Details', icon: <Phone size={18} />, fields: [
      { name: 'type', label: 'Type (address, phone, email)', type: 'text' },
      { name: 'value', label: 'Value (Text/No./Email)', type: 'text' },
      { name: 'label', label: 'Friendly Label', type: 'text' },
      { name: 'icon', label: 'Icon Class', type: 'text' }
    ]},
    { id: 'page-content', label: 'Page Hero Sections', icon: <Layout size={18} />, fields: [
      { name: 'page', label: 'Page', type: 'select', options: [
          { value: 'about', label: 'About' },
          { value: 'execom', label: 'ExeCom' },
          { value: 'branches', label: 'Student Branches' },
          { value: 'blogs', label: 'Blogs' },
          { value: 'resources', label: 'Resources' },
          { value: 'contact', label: 'Contact' },
          { value: 'gallery', label: 'Gallery' },
          { value: 'join', label: 'Join IEEE' },
          { value: 'search', label: 'Search Results' },
        ] },
      { name: 'section', label: 'Section ID', type: 'text', placeholder: 'hero' },
      { name: 'title', label: 'Main Title (HTML supported, e.g. <span> for gold text)', type: 'text' },
      { name: 'subtitle', label: 'Subtitle / Label', type: 'text' },
      { name: 'content', label: 'Description', type: 'textarea' },
      { name: 'mediaType', label: 'Hero Media Type', type: 'select', options: [
          { value: 'image', label: 'Image' },
          { value: 'video', label: 'Video' },
        ] },
      { name: 'image', label: 'Hero Media (Image or Video)', type: 'media' }
    ]}
  ];

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchHomeSection(section);
      console.log(`ManageHome API Response [${section}]:`, res);
      if (res.error) {
        setError(res.error);
        setData([]);
      } else {
        setData(res.data || []);
      }
      resetForm();
    } catch (err) {
      setError("An unexpected error occurred while fetching home section data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [section]);

  const resetForm = () => {
    const initialForm = {};
    const currentSection = sections.find(s => s.id === section);
    if (currentSection) {
      currentSection.fields.forEach(f => {
          if (f.type === 'checkbox') initialForm[f.name] = false;
          else if (f.type === 'number') initialForm[f.name] = 0;
          else if (f.type === 'select') initialForm[f.name] = (f.options && f.options[0] && f.options[0].value) || '';
          else initialForm[f.name] = '';
      });
      if (section === 'page-content') initialForm.section = 'hero';
    }
    setFormData(initialForm);
    setEditingId(null);
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setMediaMethod('url');
    const newForm = {};
    const currentSection = sections.find(s => s.id === section);
    if (currentSection) {
      currentSection.fields.forEach(f => {
          let val = item[f.name];
          if (f.name === 'benefits' && Array.isArray(val)) val = val.join(', ');
          newForm[f.name] = val !== undefined ? val : (f.type === 'checkbox' ? false : (f.type === 'number' ? 0 : ''));
      });
    }
    setFormData(newForm);
    
    const mediaField = currentSection?.fields.find(f => f.type === 'media')?.name;
    if (mediaField && item[mediaField]) {
      const rawVal = item[mediaField] || '';
      // Resolve preview URL: handle /uploads/file, bare filename, or full http URL
      let previewUrl;
      if (rawVal.startsWith('http')) {
        previewUrl = rawVal;
      } else if (rawVal.startsWith('/uploads/')) {
        previewUrl = resolveUpload(rawVal);
      } else {
        previewUrl = resolveUpload(rawVal);
      }
      setImagePreview(previewUrl);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        const currentSection = sections.find(s => s.id === section);
        const mediaField = currentSection?.fields.find(f => f.type === 'media')?.name;
        let payload;

        const processedData = { ...formData };
        if (processedData.benefits && typeof processedData.benefits === 'string') {
            processedData.benefits = processedData.benefits.split(',').map(b => b.trim());
        }

        if (mediaField) {
            payload = new FormData();
            Object.keys(processedData).forEach(key => {
                if (key !== mediaField) {
                    if (Array.isArray(processedData[key])) {
                        payload.append(key, JSON.stringify(processedData[key]));
                    } else {
                        payload.append(key, processedData[key]);
                    }
                }
            });
            
            if (mediaMethod === 'file' && selectedFile) {
                payload.append(mediaField, selectedFile);
            } else {
                payload.append(mediaField, processedData[mediaField] || '');
            }
        } else {
            payload = processedData;
        }

      const response = editingId 
        ? await updateHomeEntry(section, editingId, payload)
        : await createHomeEntry(section, payload);
      
      if (response.error) {
        throw new Error(response.error);
      }

      resetForm();
      fetchData();
    } catch (err) {
      console.error(`HOME SAVE ERROR [${section}]:`, err);
      alert('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this entry permanently?')) {
      try {
          const response = await deleteHomeEntry(section, id);
          if (response.error) {
            throw new Error(response.error);
          }
          fetchData();
      } catch (err) { 
        console.error("HOME DELETE ERROR:", err);
        alert('Error deleting entry: ' + err.message);
      }
    }
  };

  const activeSectionObj = sections.find(s => s.id === section);
  const safeData = data || [];

  return (
    <div className="manage-home-modern">
      <header className="dashboard-header">
        <div className="header-title-area">
          <h1>Homepage Control</h1>
          <p>Manage all visual components, informational blocks, and section pillars across the platform.</p>
        </div>
        <div className="header-actions">
           <button className="btn-primary-modern" onClick={() => { resetForm(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
              <Plus size={18} /> <span>Create New Entry</span>
           </button>
        </div>
      </header>

      <div className="dashboard-grid-layout">
        <aside className="sidebar-nav-card">
          <div className="nav-group-label">Component Modules</div>
          {sections.map(s => (
            <button 
              key={s.id} 
              className={`nav-item ${section === s.id ? 'active' : ''}`}
              onClick={() => { setSection(s.id); setMediaMethod('url'); }}
            >
              <span className="nav-icon">{s.icon}</span>
              <span className="nav-label">{s.label}</span>
              <ChevronRight size={14} className="chevron" />
            </button>
          ))}
        </aside>

        <main className="main-content-area">
          <form className="modern-form-layout" onSubmit={handleSubmit}>
            <div className="form-section-card">
              <div className="form-section-header">
                <div className="icon-badge">{activeSectionObj?.icon}</div>
                <h4>{editingId ? 'Edit' : 'Add New'} {activeSectionObj?.label} Entry</h4>
              </div>
              
              <div className="form-body">
                {(activeSectionObj?.fields || []).map(f => (
                  <div key={f.name} className={`form-group-modern ${f.type === 'textarea' || f.type === 'media' ? 'full-width' : ''}`}>
                    <label>{f.label}{f.required && <span>*</span>}</label>
                    
                    {f.type === 'select' ? (
                      <select
                        value={formData[f.name] ?? ''}
                        onChange={e => setFormData({...formData, [f.name]: e.target.value})}
                      >
                        {(f.options || []).map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea 
                        value={formData[f.name] || ''} 
                        onChange={e => setFormData({...formData, [f.name]: e.target.value})} 
                        placeholder={f.placeholder}
                        rows={4}
                      />
                    ) : f.type === 'checkbox' ? (
                      <div className="checkbox-wrap">
                          <input 
                            type="checkbox" 
                            id={`check-${f.name}`}
                            checked={formData[f.name] || false} 
                            onChange={e => setFormData({...formData, [f.name]: e.target.checked})} 
                          />
                          <label htmlFor={`check-${f.name}`}>Show this on the live website</label>
                      </div>
                    ) : f.type === 'media' ? (
                      <div className="media-upload-container">
                        <div className="tab-switcher-modern">
                            <button type="button" className={mediaMethod === 'url' ? 'active' : ''} onClick={() => setMediaMethod('url')}><Link size={14} /> Paste URL</button>
                            <button type="button" className={mediaMethod === 'file' ? 'active' : ''} onClick={() => setMediaMethod('file')}><Upload size={14} /> Upload Local</button>
                        </div>
                        
                        <div className="media-input-box">
                          {mediaMethod === 'url' ? (
                            <input 
                              type="text" 
                              value={formData[f.name] || ''} 
                              onChange={e => {
                                setFormData({...formData, [f.name]: e.target.value});
                                if (f.name === 'image' || f.name === 'imageUrl' || f.name === 'gifUrl') setImagePreview(e.target.value);
                              }} 
                              placeholder="https://..." 
                            />
                          ) : (
                            <div className="file-drop-zone">
                                <input type="file" onChange={handleFileChange} />
                                <Camera size={32} />
                                <p>{selectedFile ? selectedFile.name : 'Select file or drag here'}</p>
                            </div>
                          )}
                          
                          {imagePreview && (
                            <div className="image-preview-modern">
                                <img src={imagePreview} alt="Preview" />
                                <button type="button" className="remove-image-btn" onClick={() => { 
                                    setImagePreview(null); 
                                    setSelectedFile(null); 
                                    setFormData({...formData, [f.name]: ''}); 
                                }}><X size={14} /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <input 
                        type={f.type} 
                        value={formData[f.name] || ''} 
                        onChange={e => setFormData({...formData, [f.name]: e.target.value})} 
                        placeholder={f.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky-action-bar">
              <div className="bar-status">
                {editingId ? <span className="editing-tag"><Edit size={14}/> Editing Record</span> : <span className="new-tag"><Plus size={14}/> New Entry</span>}
              </div>
              <div className="bar-actions">
                <button type="button" className="btn-secondary-modern" onClick={resetForm}>Discard</button>
                <button type="submit" className="btn-primary-modern" disabled={isSaving}>
                  {isSaving ? <span className="spinner"></span> : <Save size={18} />}
                  {editingId ? 'Push Updates' : 'Publish Entry'}
                </button>
              </div>
            </div>
          </form>

          <div className="table-card-modern">
            <div className="card-header">
              <h3><Layout size={18} /> Component Registry</h3>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Entry Content</th>
                    <th>Metadata</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="3" className="loading-cell">Syncing records...</td></tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="3">
                        <div className="error-state-modern">
                          <AlertTriangle size={32} />
                          <h4>Failed to Load Section Data</h4>
                          <p>{error}</p>
                          <button onClick={fetchData}>Try Again</button>
                        </div>
                      </td>
                    </tr>
                  ) : safeData.length === 0 ? (
                    <tr>
                      <td colSpan="3">
                        <div className="empty-state-modern">
                          <div className="empty-state-icon"><ImageIcon size={32} /></div>
                          <h4>No Records Found</h4>
                          <p>No records found in this category.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    safeData.map(item => {
                        const mediaField = activeSectionObj?.fields.find(f => f.type === 'media')?.name;
                        const itemImg = mediaField ? item[mediaField] : null;
                        
                        return (
                          <tr key={item._id}>
                            <td>
                              <div className="entry-main-info">
                                {itemImg && <img className="entry-thumb" src={
                                  itemImg.startsWith('http') ? itemImg :
                                  resolveUpload(itemImg)
                                } alt={item.title || 'Entry'}/>}
                                <span className="entry-title">{item.text || item.title || item.name || item.label || item.platform || item.type || 'Unnamed Entry'}</span>
                              </div>
                            </td>
                            <td>
                              <span className="entry-sub-detail">{item.subtitle || item.category || item.page || (item.active !== undefined ? (item.active ? 'Visible' : 'Hidden') : item.value || '')}</span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="action-buttons-wrap">
                                <button className="icon-btn-edit" onClick={() => handleEdit(item)}><Edit size={16} /></button>
                                <button className="icon-btn-delete" onClick={() => handleDelete(item._id)}><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-grid-layout { display: grid; grid-template-columns: 280px 1fr; gap: 2rem; align-items: start; }
        
        .sidebar-nav-card { background: white; border-radius: 16px; border: 1px solid var(--admin-border); padding: 1rem; box-shadow: var(--admin-shadow); position: sticky; top: 1rem; }
        .nav-group-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #94A3B8; letter-spacing: 0.1em; padding: 0.5rem 1rem 1rem; }
        
        .nav-item { width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px; border: none; background: transparent; cursor: pointer; color: #64748B; transition: all 0.2s; text-align: left; }
        .nav-item:hover { background: #F1F5F9; color: var(--ieee-blue); }
        .nav-item.active { background: var(--admin-primary-light); color: var(--ieee-blue); }
        .nav-icon { display: flex; align-items: center; justify-content: center; width: 20px; }
        .nav-label { flex-grow: 1; font-weight: 600; font-size: 0.9rem; }
        .nav-item .chevron { opacity: 0; transition: 0.2s; }
        .nav-item.active .chevron { opacity: 1; transform: translateX(4px); }
        
        .checkbox-wrap { display: flex; align-items: center; gap: 10px; padding: 0.5rem 0; }
        .checkbox-wrap input { width: 18px; height: 18px; cursor: pointer; }
        .checkbox-wrap label { font-size: 0.9rem; color: #475569; cursor: pointer; }
        
        .entry-main-info { display: flex; align-items: center; gap: 12px; }
        .entry-thumb { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; border: 1px solid #E2E8F0; background-color: #f8fafc; }
        .entry-title { font-weight: 700; color: #1E293B; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }
        .entry-sub-detail { font-size: 0.8rem; color: #64748B; background: #F1F5F9; padding: 2px 8px; border-radius: 4px; }
        
        .action-buttons-wrap { display: flex; justify-content: flex-end; gap: 8px; }
        .icon-btn-edit { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #E2E8F0; background: white; color: #64748B; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .icon-btn-edit:hover { background: #EFF6FF; border-color: var(--ieee-blue); color: var(--ieee-blue); }
        .icon-btn-delete { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #FEE2E2; background: #FEF2F2; color: var(--status-danger); cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .icon-btn-delete:hover { background: var(--status-danger); color: white; }
        
        .bar-status { display: flex; align-items: center; gap: 12px; }
        .editing-tag { background: #FEF9C3; color: #713F12; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 6px; }
        .new-tag { background: #DCFCE7; color: #166534; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 6px; }
        
        .loading-cell, .error-state-modern, .empty-state-modern { padding: 4rem !important; text-align: center; color: #94A3B8; font-style: italic; }
        .error-state-modern h4, .empty-state-modern h4 { font-size: 1.25rem; color: #1E293B; margin: 1rem 0 0.5rem; }
        .error-state-modern p, .empty-state-modern p { color: #64748B; margin-bottom: 1.5rem; max-width: 400px; margin-left: auto; margin-right: auto; }
        .error-state-modern svg, .empty-state-modern .empty-state-icon svg { color: var(--ieee-blue); }
        .error-state-modern button { background: var(--ieee-blue); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1200px) {
          .dashboard-grid-layout { grid-template-columns: 1fr; }
          .sidebar-nav-card { position: static; display: flex; overflow-x: auto; white-space: nowrap; gap: 0.5rem; padding: 0.75rem; }
          .nav-item { width: auto; }
          .nav-group-label, .chevron { display: none; }
        }
      `}} />
    </div>
  );
};

export default ManageHome;