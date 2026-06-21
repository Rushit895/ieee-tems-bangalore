import { useEffect, useState } from 'react';
import { fetchBlogs, createBlog, deleteBlog, updateBlog } from '../../services/api';
import { resolveUpload } from '../../config';
import { 
  FileText, Trash2, Plus, Edit, Image, User, Calendar, 
  Upload, Link, Camera, Save, X, ChevronRight, Hash, 
  Info, Tag, BookOpen, AlertTriangle
} from 'lucide-react';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [mediaMethod, setMediaMethod] = useState('url');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const initialFormData = { 
    title: '', 
    content: '', 
    author: '', 
    image: '',
    articleUrl: '',
    category: 'Announcement',
    date: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(initialFormData);

  const loadBlogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchBlogs();
      console.log("ManageBlogs API Response:", res);
      if (res.error) {
        setError(res.error);
        setBlogs([]);
      } else {
        setBlogs(res.data || []);
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching blogs.");
      console.error('Failed to fetch blogs:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => { 
    loadBlogs(); 
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

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setMediaMethod('url');
    const imageUrl = blog.image || '';
    setImagePreview(imageUrl ? resolveUpload(imageUrl) : null);
    
    setFormData({
      title: blog.title || '',
      content: blog.content || '',
      author: blog.author || '',
      image: imageUrl,
      articleUrl: blog.articleUrl || '',
      category: blog.category || 'Announcement',
      date: blog.date ? new Date(blog.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
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
        if (key !== 'image') data.append(key, formData[key] || '');
      });

      if (mediaMethod === 'file' && selectedFile) {
        data.append('image', selectedFile);
      } else {
        data.append('image', formData.image || '');
      }

      const response = editingId ? await updateBlog(editingId, data) : await createBlog(data);

      if (response.error) {
        throw new Error(response.error);
      }
      
      cancelEdit();
      loadBlogs();
    } catch (err) {
      console.error("BLOG SAVE ERROR:", err);
      alert('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this blog post? This cannot be undone.')) {
      try {
        const response = await deleteBlog(id);
        if (response.error) {
          throw new Error(response.error);
        }
        loadBlogs();
      } catch (err) {
        console.error("BLOG DELETE ERROR:", err);
        alert('Error deleting blog: ' + err.message);
      }
    }
  };
  
  const safeBlogs = Array.isArray(blogs) ? blogs : [];

  return (
    <div className="manage-blogs-modern">
      <header className="dashboard-header">
        <div className="header-title-area">
          <h1>Editorial & News</h1>
          <p>Create and publish stories, technical insights, and section announcements.</p>
        </div>
        <div className="header-actions">
           <button className="btn-primary-modern" onClick={() => { cancelEdit(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
              <Plus size={18} /> <span>Compose New Story</span>
           </button>
        </div>
      </header>

      <form className="modern-form-layout" onSubmit={handleSubmit}>
        <div className="form-main-content">
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="icon-badge"><BookOpen size={18} /></div>
              <h4>{editingId ? 'Modify' : 'Compose'} Blog Post</h4>
            </div>
            
            <div className="form-body">
              <div className="form-group-modern full-width">
                <label>Story Title<span>*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g., The Future of Technology Management in 2026" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                  autoFocus
                />
              </div>

              <div className="form-group-modern full-width">
                <label>Article Content (Markdown Supported)<span>*</span></label>
                <textarea 
                  placeholder="Tell your story..." 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})} 
                  required
                  rows={12}
                />
              </div>

              <div className="form-group-modern">
                <label>Primary Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Announcement">Announcement</option>
                  <option value="Technical">Technical Insight</option>
                  <option value="Event Report">Event Report</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Community">Community Story</option>
                </select>
              </div>

              <div className="form-group-modern">
                <label>Published By / Author</label>
                <input 
                  type="text" 
                  placeholder="e.g., IEEE TEMS Editorial Team" 
                  value={formData.author} 
                  onChange={e => setFormData({...formData, author: e.target.value})} 
                />
              </div>

              <div className="form-group-modern">
                <label>Display Date</label>
                <input 
                  type="date" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})} 
                />
              </div>

              <div className="form-group-modern full-width">
                <label>Article URL (External Link)</label>
                <input 
                  type="url" 
                  placeholder="https://..." 
                  value={formData.articleUrl} 
                  onChange={e => setFormData({...formData, articleUrl: e.target.value})} 
                />
              </div>

              <div className="form-group-modern full-width">
                <label>Feature Media</label>
                <div className="tab-switcher-modern">
                  <button type="button" className={mediaMethod === 'url' ? 'active' : ''} onClick={() => setMediaMethod('url')}><Link size={14} /> Image URL</button>
                  <button type="button" className={mediaMethod === 'file' ? 'active' : ''} onClick={() => setMediaMethod('file')}><Upload size={14} /> Local File</button>
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
                      <p>{selectedFile ? selectedFile.name : 'Select high-quality feature image'}</p>
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
            <button type="button" className="btn-secondary-modern" onClick={cancelEdit}>Discard</button>
            <button type="submit" className="btn-primary-modern" disabled={isSaving}>
              {isSaving ? <span className="spinner"></span> : <Save size={18} />}
              {editingId ? 'Push Story Updates' : 'Publish to Feed'}
            </button>
          </div>
        </div>
      </form>

      <section className="table-card-modern">
        <div className="card-header">
          <h3><FileText size={18} /> Published Editorial Registry ({safeBlogs.length})</h3>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Story Identity</th>
                <th>Classification</th>
                <th>Author & Timeline</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="loading-cell">Syncing editorial database...</td></tr>
              ) : error ? (
                <tr>
                  <td colSpan="4">
                    <div className="error-state-modern">
                      <AlertTriangle size={32} />
                      <h4>Failed to Load Stories</h4>
                      <p>{error}</p>
                      <button onClick={loadBlogs}>Try Again</button>
                    </div>
                  </td>
                </tr>
              ) : safeBlogs.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state-modern">
                      <div className="empty-state-icon"><FileText size={32} /></div>
                      <h4>No Stories Found</h4>
                      <p>No stories published yet. Write your first insight above.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                safeBlogs.map(blog => (
                  <tr key={blog._id}>
                    <td>
                      <div className="blog-cell">
                        <img className="blog-thumb" src={resolveUpload(blog.image)} alt={blog.title || 'Blog post'}/>
                        <span className="blog-title-main">{blog.title || 'Untitled Post'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`category-tag ${(blog.category || 'general').toLowerCase().replace(' ', '-')}`}>{blog.category || 'General'}</span>
                    </td>
                    <td>
                      <div className="meta-cell">
                        <span className="author"><User size={12} /> {blog.author || 'IEEE TEMS'}</span>
                        <span className="date"><Calendar size={12} /> {new Date(blog.date || blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-flex-right">
                        <button className="icon-btn edit" onClick={() => handleEdit(blog)}><Edit size={16} /></button>
                        <button className="icon-btn delete" onClick={() => handleDelete(blog._id)}><Trash2 size={16} /></button>
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
        .blog-cell { display: flex; align-items: center; gap: 12px; }
        .blog-thumb { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; border: 1px solid #E2E8F0; background-color: #f8fafc; }
        .blog-title-main { font-weight: 700; color: #1E293B; font-size: 0.95rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        
        .category-tag { font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.05em; background: #F1F5F9; color: #64748B; }
        .category-tag.announcement { background: #FEF3C7; color: #92400E; }
        .category-tag.technical { background: #E0E7FF; color: #4338CA; }
        .category-tag.leadership { background: #DCFCE7; color: #166534; }
        
        .meta-cell { display: flex; flex-direction: column; gap: 4px; font-size: 0.8rem; color: #64748B; }
        .meta-cell span { display: flex; align-items: center; gap: 6px; }
        
        .action-flex-right { display: flex; justify-content: flex-end; gap: 8px; }
        .icon-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #E2E8F0; background: white; color: #64748B; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .icon-btn.edit:hover { background: #EFF6FF; border-color: var(--ieee-blue); color: var(--ieee-blue); }
        .icon-btn.delete:hover { background: #FEF2F2; border-color: var(--status-danger); color: var(--status-danger); }
        
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-cell { padding: 4rem !important; text-align: center; color: #94A3B8; font-style: italic; }
        
        .error-state-modern, .empty-state-modern { text-align: center; padding: 4rem 2rem; }
        .error-state-modern h4, .empty-state-modern h4 { font-size: 1.25rem; color: #1E293B; margin: 1rem 0 0.5rem; }
        .error-state-modern p, .empty-state-modern p { color: #64748B; margin-bottom: 1.5rem; max-width: 400px; margin-left: auto; margin-right: auto; }
        .error-state-modern svg, .empty-state-modern .empty-state-icon svg { color: var(--ieee-blue); }
        .error-state-modern button { background: var(--ieee-blue); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; }
      `}} />
    </div>
  );
};

export default ManageBlogs;