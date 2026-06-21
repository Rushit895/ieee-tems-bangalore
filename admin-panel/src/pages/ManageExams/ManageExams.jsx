import { useEffect, useState } from 'react';
import { fetchExams, createExam, updateExam, deleteExam } from '../../services/api';
import { resolveUpload } from '../../config';
import { 
  GraduationCap, Trash2, Plus, Edit, Calendar, Link, FileText, 
  Upload, Camera, Save, X, ChevronRight, Hash, Info, Filter, Search, AlertTriangle
} from 'lucide-react';

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [mediaMethod, setMediaMethod] = useState('url');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const initialFormData = {
    title: '',
    year: new Date().getFullYear(),
    date: new Date().toISOString().split('T')[0],
    description: '',
    fileUrl: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const loadExams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchExams();
      console.log("ManageExams API Response:", res);
      if (res.error) {
        setError(res.error);
        setExams([]);
      } else {
        setExams(res.data || []);
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching exams.");
      console.error('Failed to fetch exams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    loadExams(); 
  }, []);

  const handleEdit = (exam) => {
    setEditingId(exam._id);
    setMediaMethod('url');
    setFormData({
      title: exam.title || '',
      year: exam.year || new Date().getFullYear(),
      date: exam.date ? new Date(exam.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      description: exam.description || '',
      fileUrl: exam.fileUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSelectedFile(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'fileUrl') data.append(key, formData[key] || '');
      });

      if (mediaMethod === 'file' && selectedFile) {
        data.append('file', selectedFile);
      } else {
        data.append('fileUrl', formData.fileUrl || '');
      }

      const response = editingId ? await updateExam(editingId, data) : await createExam(data);
      if (response.error) {
        throw new Error(response.error);
      }
      cancelEdit();
      loadExams();
    } catch (err) {
      console.error("EXAM SAVE ERROR:", err);
      alert('Error: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this exam record?')) {
      try {
        const response = await deleteExam(id);
        if (response.error) {
          throw new Error(response.error);
        }
        loadExams();
      } catch (err) {
        console.error("EXAM DELETE ERROR:", err);
        alert('Error deleting exam: ' + err.message);
      }
    }
  };

  const safeExams = exams || [];

  return (
    <div className="manage-exams-modern">
      <header className="dashboard-header">
        <div className="header-title-area">
          <h1>Academic Archives</h1>
          <p>Preserve and organize previous examination papers for the student community.</p>
        </div>
        <div className="header-actions">
           <button className="btn-primary-modern" onClick={() => { cancelEdit(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
              <Plus size={18} /> <span>Archive New Paper</span>
           </button>
        </div>
      </header>

      <form className="modern-form-layout" onSubmit={handleSubmit}>
        <div className="form-section-card">
          <div className="form-section-header">
            <div className="icon-badge"><GraduationCap size={18} /></div>
            <h4>{editingId ? 'Modify' : 'Archive New'} Examination Paper</h4>
          </div>
          
          <div className="form-body">
            <div className="form-group-modern full-width">
              <label>Examination Title<span>*</span></label>
              <input 
                type="text" 
                placeholder="e.g., TEMS Graduate Proficiency Entrance Test" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
                autoFocus
              />
            </div>

            <div className="form-group-modern">
              <label>Academic Year<span>*</span></label>
              <input 
                type="number" 
                placeholder="2026" 
                value={formData.year} 
                onChange={e => setFormData({...formData, year: parseInt(e.target.value) || new Date().getFullYear()})} 
                required
              />
            </div>

            <div className="form-group-modern">
              <label>Examination Date<span>*</span></label>
              <input 
                type="date" 
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
                required
              />
            </div>

            <div className="form-group-modern full-width">
              <label>Document Source</label>
              <div className="tab-switcher-modern">
                <button type="button" className={mediaMethod === 'url' ? 'active' : ''} onClick={() => setMediaMethod('url')}><Link size={14} /> Remote URL</button>
                <button type="button" className={mediaMethod === 'file' ? 'active' : ''} onClick={() => setMediaMethod('file')}><Upload size={14} /> Direct Upload</button>
              </div>

              <div className="media-input-box">
                {mediaMethod === 'url' ? (
                  <input 
                    type="url" 
                    placeholder="https://example.com/exam-paper.pdf" 
                    value={formData.fileUrl} 
                    onChange={e => setFormData({...formData, fileUrl: e.target.value})} 
                  />
                ) : (
                  <div className="file-drop-zone">
                    <input type="file" onChange={e => setSelectedFile(e.target.files[0])} />
                    <FileText size={32} />
                    <p>{selectedFile ? selectedFile.name : 'Select PDF or Document file (Max 10MB)'}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group-modern full-width">
              <label>Archival Description (Optional)</label>
              <textarea 
                placeholder="Context, syllabus covered, or instructions for students..." 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                rows={4}
              />
            </div>
          </div>
        </div>

        <div className="sticky-action-bar">
          <div className="bar-actions">
            <button type="button" className="btn-secondary-modern" onClick={cancelEdit}>Discard</button>
            <button type="submit" className="btn-primary-modern" disabled={isSaving}>
              {isSaving ? <span className="spinner"></span> : <Save size={18} />}
              {editingId ? 'Push Record Updates' : 'Commit to Archive'}
            </button>
          </div>
        </div>
      </form>

      <section className="table-card-modern">
        <div className="card-header">
          <h3><FileText size={18} /> Examination Registry ({safeExams.length})</h3>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Document Details</th>
                <th>Academic Year</th>
                <th>Timeline</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" className="loading-cell">Loading digital archives...</td></tr>
              ) : error ? (
                <tr>
                  <td colSpan="4">
                    <div className="error-state-modern">
                      <AlertTriangle size={32} />
                      <h4>Failed to Load Exams</h4>
                      <p>{error}</p>
                      <button onClick={loadExams}>Try Again</button>
                    </div>
                  </td>
                </tr>
              ) : safeExams.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="empty-state-modern">
                      <div className="empty-state-icon"><GraduationCap size={32} /></div>
                      <h4>Archive is Empty</h4>
                      <p>Archive is currently empty. Digitize your first exam above.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                safeExams.sort((a,b) => b.year - a.year).map(exam => (
                  <tr key={exam._id}>
                    <td>
                      <div className="exam-cell">
                        <div className="exam-icon-box"><FileText size={20} /></div>
                        <div className="exam-info">
                          <span className="exam-title-main">{exam.title || 'Untitled Exam'}</span>
                          <a 
                            href={resolveUpload(exam.fileUrl)}
                            target="_blank" rel="noreferrer" className="doc-link"
                          >
                            <Link size={10} /> {(exam.fileUrl || 'No URL').substring(0, 30)}...
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="year-tag">{exam.year}</span>
                    </td>
                    <td>
                      <span className="date-tag"><Calendar size={12} /> {new Date(exam.date).toLocaleDateString()}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="action-flex-right">
                        <button className="icon-btn edit" onClick={() => handleEdit(exam)}><Edit size={16} /></button>
                        <button className="icon-btn delete" onClick={() => handleDelete(exam._id)}><Trash2 size={16} /></button>
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
        .exam-cell { display: flex; align-items: center; gap: 12px; }
        .exam-icon-box { width: 40px; height: 40px; border-radius: 8px; background: #F1F5F9; color: var(--ieee-blue); display: flex; align-items: center; justify-content: center; }
        .exam-info { display: flex; flex-direction: column; gap: 2px; }
        .exam-title-main { font-weight: 700; color: #1E293B; font-size: 0.95rem; }
        .doc-link { font-size: 0.75rem; color: #94A3B8; display: flex; align-items: center; gap: 4px; text-decoration: none; }
        .doc-link:hover { color: var(--ieee-blue); text-decoration: underline; }
        
        .year-tag { font-size: 0.8rem; font-weight: 800; padding: 4px 10px; background: #FEF9C3; color: #854D0E; border-radius: 6px; }
        .date-tag { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #64748B; font-weight: 500; }
        
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

export default ManageExams;