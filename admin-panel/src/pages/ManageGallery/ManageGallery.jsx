import { useEffect, useState } from 'react';
import { fetchGallery, uploadGalleryImage, deleteGalleryImage } from '../../services/api';
import { resolveUpload } from '../../config';
import { 
  Image as ImageIcon, Trash2, Plus, Camera, Upload, Link, 
  Save, X, Grid, AlertTriangle
} from 'lucide-react';

const ManageGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('file');
  const [formData, setFormData] = useState({ 
    caption: '', 
    imageUrl: '',
    file: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const loadGallery = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchGallery();
      console.log("ManageGallery API Response:", res);
      if (res.error) {
        setError(res.error);
        setGallery([]);
      } else {
        setGallery(res.data || []);
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching gallery images.");
      console.error('Failed to fetch gallery:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    loadGallery(); 
  }, []);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ caption: '', imageUrl: '', file: null });
    setImagePreview(null);
    setUploadMethod('file');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const data = new FormData();
      data.append('caption', formData.caption);
      
      if (uploadMethod === 'file') {
        if (!formData.file) throw new Error('Please select a file');
        data.append('image', formData.file);
      } else {
        if (!formData.imageUrl) throw new Error('Please enter an image URL');
        data.append('imageUrl', formData.imageUrl);
      }

      const response = await uploadGalleryImage(data);
      if (response.error) {
        throw new Error(response.error);
      }
      
      resetForm();
      loadGallery();
    } catch (err) {
      console.error("GALLERY UPLOAD ERROR:", err);
      alert('Error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to remove this image from the gallery?')) {
      try {
        const response = await deleteGalleryImage(id);
        if(response.error) {
          throw new Error(response.error);
        }
        loadGallery();
      } catch (err) {
        console.error("GALLERY DELETE ERROR:", err);
        alert('Error deleting image: ' + err.message);
      }
    }
  };

  const safeGallery = Array.isArray(gallery) ? gallery : [];

  return (
    <div className="manage-gallery-modern">
      <header className="dashboard-header">
        <div className="header-title-area">
          <h1>Visual Assets Library</h1>
          <p>Curate and manage the photographic journey of IEEE TEMS Bangalore initiatives.</p>
        </div>
        <div className="header-actions">
           <button className="btn-primary-modern" onClick={() => { resetForm(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
              <Plus size={18} /> <span>Upload New Asset</span>
           </button>
        </div>
      </header>

      <form className="modern-form-layout" onSubmit={handleSubmit}>
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="icon-badge"><Plus size={18} /></div>
            <h4>Add New Visual Asset</h4>
          </div>
          
          <div className="form-body">
            <div className="form-group-modern full-width">
              <label>Asset Caption<span>*</span></label>
              <input 
                type="text" 
                placeholder="e.g., Delegates at TEMSCON 2026 Innovation Summit" 
                value={formData.caption} 
                onChange={e => setFormData({...formData, caption: e.target.value})} 
                required
                autoFocus
              />
            </div>
            
            <div className="form-group-modern full-width">
              <label>Media Capture Method</label>
              <div className="tab-switcher-modern">
                <button 
                    type="button"
                    className={uploadMethod === 'file' ? 'active' : ''} 
                    onClick={() => { setUploadMethod('file'); resetForm(); }}
                >
                    <Upload size={14} /> File Upload
                </button>
                <button 
                    type="button"
                    className={uploadMethod === 'url' ? 'active' : ''} 
                    onClick={() => { setUploadMethod('url'); resetForm(); }}
                >
                    <Link size={14} /> Remote URL
                </button>
              </div>

              <div className="media-input-box">
                {uploadMethod === 'file' ? (
                  <div className="file-drop-zone">
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <Camera size={32} />
                    <p>{formData.file ? formData.file.name : 'Click to select or drag image here'}</p>
                  </div>
                ) : (
                  <input 
                    type="url" 
                    placeholder="https://..." 
                    value={formData.imageUrl} 
                    onChange={e => {
                      setFormData({...formData, imageUrl: e.target.value, file: null});
                      setImagePreview(e.target.value);
                    }} 
                  />
                )}
                
                {imagePreview && (
                  <div className="image-preview-modern">
                    <img src={imagePreview} alt="Preview" />
                    <button type="button" className="remove-image-btn" onClick={() => { setImagePreview(null); setFormData({...formData, file: null, imageUrl: ''}); }}><X size={14} /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky-action-bar">
          <div className="bar-actions">
            <button type="submit" className="btn-primary-modern" disabled={isUploading}>
              {isUploading ? <span className="spinner"></span> : <Upload size={18} />}
              Push to Library
            </button>
          </div>
        </div>
      </form>

      <section className="table-card-modern">
        <div className="card-header">
          <h3><Grid size={18} /> Media Assets Inventory ({safeGallery.length})</h3>
        </div>
        
        {isLoading ? (
          <div className="loading-cell">Syncing media library...</div>
        ) : error ? (
           <div className="error-state-modern">
              <AlertTriangle size={32} />
              <h4>Failed to Load Gallery</h4>
              <p>{error}</p>
              <button onClick={loadGallery}>Try Again</button>
            </div>
        ) : safeGallery.length === 0 ? (
          <div className="empty-state-modern">
            <div className="empty-state-icon"><ImageIcon size={32} /></div>
            <h4>Library is Empty</h4>
            <p>Your visual asset library is currently empty. Upload your first asset above.</p>
          </div>
        ) : (
          <div className="admin-gallery-grid-modern">
            {safeGallery.map(img => (
              <div key={img._id} className="gallery-card-modern">
                <div className="card-media">
                  <img src={resolveUpload(img.imageUrl)} alt={img.caption || 'Gallery image'} />
                  <div className="card-overlay">
                    <button className="delete-btn-modern" onClick={() => handleDelete(img._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="card-details">
                  <p title={img.caption}>{img.caption || 'Untitled Asset'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .admin-gallery-grid-modern { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; padding: 2rem; }
        
        .gallery-card-modern { background: white; border-radius: 12px; border: 1px solid var(--admin-border); overflow: hidden; transition: 0.2s; }
        .gallery-card-modern:hover { transform: translateY(-4px); box-shadow: var(--admin-shadow-hover); }
        
        .card-media { position: relative; aspect-ratio: 4/3; overflow: hidden; background: #F8FAFC; }
        .card-media img { width: 100%; height: 100%; object-fit: cover; transition: 0.3s; }
        
        .card-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; }
        .gallery-card-modern:hover .card-overlay { opacity: 1; }
        
        .delete-btn-modern { width: 40px; height: 40px; border-radius: 50%; background: #EF4444; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .delete-btn-modern:hover { transform: scale(1.1); background: #DC2626; }
        
        .card-details { padding: 1rem; border-top: 1px solid #F1F5F9; }
        .card-details p { margin: 0; font-size: 0.85rem; font-weight: 600; color: #1E293B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-cell { padding: 5rem; text-align: center; color: #94A3B8; font-style: italic; }
        
        .error-state-modern, .empty-state-modern { text-align: center; padding: 4rem 2rem; }
        .error-state-modern h4, .empty-state-modern h4 { font-size: 1.25rem; color: #1E293B; margin: 1rem 0 0.5rem; }
        .error-state-modern p, .empty-state-modern p { color: #64748B; margin-bottom: 1.5rem; max-width: 400px; margin-left: auto; margin-right: auto; }
        .error-state-modern svg, .empty-state-modern .empty-state-icon svg { color: var(--ieee-blue); }
        .error-state-modern button { background: var(--ieee-blue); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; }
      `}} />
    </div>
  );
};

export default ManageGallery;