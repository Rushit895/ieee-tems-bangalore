import { useEffect, useState } from 'react';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../../services/api';
import { resolveUpload } from '../../config';
import { 
  Calendar, Trash2, Plus, Edit, MapPin, Tag, Info, Link, 
  Upload, Camera, Save, X, ChevronRight, Clock, Hash, AlertTriangle
} from 'lucide-react';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [mediaMethod, setMediaMethod] = useState('url');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Workshops',
    image: '',
    registerLink: '',
    moreInfoLink: ''
  });

  const loadEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchEvents();
      console.log("ManageEvents API Response:", res);
      if (res.error) {
        setError(res.error);
        setEvents([]);
      } else {
        setEvents(res.data || []);
      }
    } catch (err) {
      // This is a fallback for unexpected errors, though the interceptor should handle most cases.
      setError("An unexpected error occurred while fetching events.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    loadEvents(); 
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

  const handleEdit = (event) => {
    setEditingId(event._id);
    setMediaMethod('url');
    const imageUrl = event.image || '';
    setImagePreview(imageUrl ? resolveUpload(imageUrl) : null);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      date: event.date ? event.date.split('T')[0] : '',
      location: event.location || '',
      category: event.category || 'Workshops',
      image: imageUrl,
      registerLink: event.registerLink || '',
      moreInfoLink: event.moreInfoLink || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedFile(null);
    setImagePreview(null);
    setFormData({ 
      title: '', 
      description: '', 
      date: '', 
      location: '', 
      category: 'Workshops', 
      image: '', 
      registerLink: '', 
      moreInfoLink: '' 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'image') {
          data.append(key, formData[key] || '');
        }
      });

      if (mediaMethod === 'file' && selectedFile) {
        data.append('image', selectedFile);
      } else {
        data.append('image', formData.image || '');
      }

      const response = editingId ? await updateEvent(editingId, data) : await createEvent(data);
      
      if (response.error) {
        throw new Error(response.error);
      }

      resetForm();
      loadEvents();
    } catch (err) {
      console.error("EVENT SAVE ERROR:", err);
      const msg = err.message || "Check inputs and try again";
      alert('Error saving event: ' + msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event? This action is permanent.')) {
      try {
        const response = await deleteEvent(id);
        if (response.error) {
          throw new Error(response.error);
        }
        loadEvents();
      } catch (err) {
        console.error("EVENT DELETE ERROR:", err);
        alert('Error deleting event: ' + err.message);
      }
    }
  };

  const safeEvents = Array.isArray(events) ? events : [];

  return (
    <div className="manage-events-modern">
      <header className="dashboard-header">
        <div className="header-title-area">
          <h1>Events Ecosystem</h1>
          <p>Schedule and coordinate upcoming summits, technical workshops, and society meetings.</p>
        </div>
        <div className="header-actions">
           <button className="btn-primary-modern" onClick={() => { resetForm(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
              <Plus size={18} /> <span>Create New Event</span>
           </button>
        </div>
      </header>

      <form className="modern-form-layout" onSubmit={handleSubmit}>
        <div className="form-main-content">
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="icon-badge"><Calendar size={18} /></div>
              <h4>{editingId ? 'Modify' : 'Publish'} Section Activity</h4>
            </div>
            
            <div className="form-body">
              <div className="form-group-modern full-width">
                <label>Event Nomenclature<span>*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g., TEMSCON 2026: Global Innovation Summit" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                  autoFocus
                />
              </div>

              <div className="form-group-modern full-width">
                <label>Operational Description<span>*</span></label>
                <textarea 
                  placeholder="Elaborate on the event scope, key speakers, and agenda..." 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  rows={5}
                  required
                />
              </div>

              <div className="form-group-modern">
                <label>Scheduled Date<span>*</span></label>
                <div className="input-with-icon">
                  <input 
                    type="date" 
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group-modern">
                <label>Event Taxonomy</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Workshops">Technical Workshops</option>
                  <option value="Conferences">Conferences & Summits</option>
                  <option value="Talks">Expert Talks</option>
                  <option value="AGM">Administrative / AGM</option>
                  <option value="Competitions">Competitions & Hackathons</option>
                </select>
              </div>

              <div className="form-group-modern">
                <label>Geographic Venue<span>*</span></label>
                <div className="input-with-prefix">
                   <div className="prefix"><MapPin size={14} /></div>
                   <input 
                    type="text" 
                    placeholder="e.g., IISc Bangalore / Virtual" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group-modern">
                <label>Registration Gateway URL</label>
                <div className="input-with-prefix">
                   <div className="prefix"><Link size={14} /></div>
                   <input 
                    type="url" 
                    placeholder="https://events.ieee.org/..." 
                    value={formData.registerLink} 
                    onChange={e => setFormData({...formData, registerLink: e.target.value})} 
                  />
                </div>
              </div>

              <div className="form-group-modern">
                <label>Additional Information URL</label>
                <div className="input-with-prefix">
                   <div className="prefix"><Link size={14} /></div>
                   <input 
                    type="url" 
                    placeholder="https://..." 
                    value={formData.moreInfoLink} 
                    onChange={e => setFormData({...formData, moreInfoLink: e.target.value})} 
                  />
                </div>
              </div>

              <div className="form-group-modern full-width">
                <label>Visual Identity (Banner)</label>
                <div className="tab-switcher-modern">
                  <button type="button" className={mediaMethod === 'url' ? 'active' : ''} onClick={() => setMediaMethod('url')}><Link size={14} /> Media URL</button>
                  <button type="button" className={mediaMethod === 'file' ? 'active' : ''} onClick={() => setMediaMethod('file')}><Upload size={14} /> File Selection</button>
                </div>

                <div className="media-input-box">
                  {mediaMethod === 'url' ? (
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      value={formData.image} 
                      onChange={e => {
                        setFormData({...formData, image: e.target.value});
                        setImagePreview(e.target.value);
                      }} 
                    />
                  ) : (
                    <div className="file-drop-zone">
                      <input type="file" accept="image/*" onChange={handleFileChange} />
                      <Camera size={32} />
                      <p>{selectedFile ? selectedFile.name : 'Select high-resolution event banner'}</p>
                    </div>
                  )}
                  
                  {imagePreview && (
                    <div className="image-preview-modern">
                      <img src={imagePreview} alt="Preview" />
                      <button type="button" className="remove-image-btn" onClick={() => { setImagePreview(null); setSelectedFile(null); setFormData({...formData, image: ''}); }}><X size={14} /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky-action-bar">
          <div className="bar-actions">
            <button type="button" className="btn-secondary-modern" onClick={resetForm}>Discard</button>
            <button type="submit" className="btn-primary-modern" disabled={isSaving}>
              {isSaving ? <span className="spinner"></span> : <Save size={18} />}
              {editingId ? 'Push Event Updates' : 'Publish Activity'}
            </button>
          </div>
        </div>
      </form>

      <section className="table-card-modern">
        <div className="card-header">
          <h3><Calendar size={18} /> Activity Registry ({safeEvents.length})</h3>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Activity Identity</th>
                <th>Logistics</th>
                <th>Classification</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="loading-cell">Syncing activity records...</td></tr>
              ) : error ? (
                <tr>
                  <td colSpan="4">
                    <div className="error-state-modern">
                      <AlertTriangle size={32} />
                      <h4>Failed to Load Events</h4>
                      <p>{error}</p>
                      <button onClick={loadEvents}>Try Again</button>
                    </div>
                  </td>
                </tr>
              ) : safeEvents.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state-modern">
                      <div className="empty-state-icon"><Calendar size={32} /></div>
                      <h4>No Events Found</h4>
                      <p>The registry is currently empty. Define your first section activity above to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                safeEvents.sort((a,b) => new Date(b.date) - new Date(a.date)).map(event => (
                  <tr key={event._id}>
                    <td>
                      <div className="event-cell-modern">
                        <img className="event-thumb" src={resolveUpload(event.image)} alt={event.title || 'Event'}/>
                        <div className="event-info-box">
                          <span className="event-title-text">{event.title || 'Untitled Event'}</span>
                          <span className="event-date-text"><Clock size={10} /> {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="location-info">
                        <MapPin size={12} />
                        <span>{event.location || 'Not specified'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`cat-pill ${(event.category || 'general').toLowerCase().replace(' ', '-')}`}>{event.category || 'General'}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-flex-right">
                        <button className="icon-btn edit" onClick={() => handleEdit(event)}><Edit size={16} /></button>
                        <button className="icon-btn delete" onClick={() => handleDelete(event._id)}><Trash2 size={16} /></button>
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
        .event-cell-modern { display: flex; align-items: center; gap: 12px; }
        .event-thumb { width: 52px; height: 52px; border-radius: 8px; object-fit: cover; border: 1px solid #E2E8F0; background-color: #f8fafc; }
        .event-info-box { display: flex; flex-direction: column; gap: 2px; }
        .event-title-text { font-weight: 700; color: #1E293B; font-size: 0.95rem; }
        .event-date-text { font-size: 0.75rem; color: var(--ieee-blue); font-weight: 600; display: flex; align-items: center; gap: 4px; }
        
        .location-info { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #64748B; font-weight: 500; }
        
        .cat-pill { font-size: 0.65rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.05em; background: #F1F5F9; color: #64748B; }
        .cat-pill.workshops { background: #E0E7FF; color: #4338CA; }
        .cat-pill.conferences { background: #FEF3C7; color: #92400E; }
        .cat-pill.talks { background: #D1FAE5; color: #065F46; }
        
        .action-flex-right { display: flex; justify-content: flex-end; gap: 8px; }
        .icon-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #E2E8F0; background: white; color: #64748B; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .icon-btn.edit:hover { background: #EFF6FF; border-color: var(--ieee-blue); color: var(--ieee-blue); }
        .icon-btn.delete:hover { background: #FEF2F2; border-color: var(--status-danger); color: var(--status-danger); }

        .input-with-prefix { display: flex; align-items: center; background: #F9FAFB; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; }
        .prefix { padding: 0 12px; color: #94A3B8; background: #F1F5F9; border-right: 1px solid #E2E8F0; display: flex; align-items: center; height: 42px; }
        .input-with-prefix input { border: none !important; box-shadow: none !important; background: transparent !important; flex: 1; }

        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-cell { padding: 5rem !important; text-align: center; color: #94A3B8; font-style: italic; }
        
        .error-state-modern, .empty-state-modern { text-align: center; padding: 4rem 2rem; }
        .error-state-modern h4, .empty-state-modern h4 { font-size: 1.25rem; color: #1E293B; margin: 1rem 0 0.5rem; }
        .error-state-modern p, .empty-state-modern p { color: #64748B; margin-bottom: 1.5rem; max-width: 400px; margin-left: auto; margin-right: auto; }
        .error-state-modern svg, .empty-state-modern .empty-state-icon svg { color: var(--ieee-blue); }
        .error-state-modern button { background: var(--ieee-blue); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; }
      `}} />
    </div>
  );
};

export default ManageEvents;