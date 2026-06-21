import { useEffect, useState } from 'react';
import { 
  Mail, Trash2, Calendar, User, MessageSquare, CheckCircle, 
  Reply, ChevronRight, Inbox, Clock, ShieldCheck, Search, Filter, AlertTriangle
} from 'lucide-react';
import { fetchMessages, updateMessageStatus, deleteMessage } from '../../services/api';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchMessages();
      console.log("ManageMessages API Response:", res);
      if (res.error) {
        setError(res.error);
        setMessages([]);
      } else {
        setMessages(res.data || []);
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching messages.");
      console.error('Failed to fetch messages:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadMessages();
  }, []);


  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await updateMessageStatus(id, status);
      if (response.error) {
        throw new Error(response.error);
      }
      setMessages(messages.map(m => m._id === id ? { ...m, status } : m));
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleReply = (msg) => {
      const mailtoLink = `mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}&body=Dear ${encodeURIComponent(msg.name)},%0D%0A%0D%0AThank you for contacting IEEE TEMS Bangalore...`;
      window.open(mailtoLink, '_blank');
      handleUpdateStatus(msg._id, 'replied');
  };

  const handleDelete = async (id) => {
      if (window.confirm('Delete this message permanently?')) {
          try {
              const response = await deleteMessage(id);
              if (response.error) {
                throw new Error(response.error);
              }
              setMessages(messages.filter(m => m._id !== id));
              if (selectedMessage && selectedMessage._id === id) setSelectedMessage(null);
          } catch (err) {
              alert('Error deleting message: ' + err.message);
          }
      }
  };

  const safeMessages = messages || [];
  const filteredMessages = safeMessages.filter(m => {
    const matchesFilter = filter === 'all' || m.status === filter;
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = (m.name || '').toLowerCase().includes(searchTermLower) || 
                         (m.subject || '').toLowerCase().includes(searchTermLower);
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      unread: { bg: '#FEE2E2', color: '#EF4444', label: 'UNREAD' },
      read: { bg: '#DBEAFE', color: '#3B82F6', label: 'READ' },
      replied: { bg: '#DCFCE7', color: '#10B981', label: 'REPLIED' }
    };
    const s = styles[status] || styles.unread;
    return (
      <span className="status-pill" style={{ background: s.bg, color: s.color }}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="manage-messages-modern">
      <header className="dashboard-header">
        <div className="header-title-area">
          <h1>Inquiry Inbox</h1>
          <p>Process community questions, collaboration requests, and member support tickets.</p>
        </div>
        <div className="header-actions">
           <div className="filter-group-modern">
              <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
              <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>Unread</button>
              <button className={filter === 'replied' ? 'active' : ''} onClick={() => setFilter('replied')}>Replied</button>
           </div>
        </div>
      </header>

      <div className="inbox-container-grid">
        {/* Inbox Sidebar */}
        <aside className="inbox-sidebar-card">
          <div className="sidebar-search">
            <Search size={16} />
            <input 
                type="text" 
                placeholder="Search sender or subject..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="inbox-list-area">
            {isLoading ? (
              <div className="list-loading">Syncing secure channel...</div>
            ) : error ? (
              <div className="error-state-modern" style={{padding: '2rem'}}>
                <AlertTriangle size={24} />
                <h4>Failed to Load Inbox</h4>
                <p>{error}</p>
                <button onClick={loadMessages}>Retry</button>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="list-empty">
                <Inbox size={32} />
                <p>No messages found.</p>
              </div>
            ) : (
              filteredMessages.map(msg => (
                <div 
                  key={msg._id} 
                  className={`inbox-item-modern ${selectedMessage?._id === msg._id ? 'active' : ''} ${msg.status === 'unread' ? 'unread' : ''}`}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (msg.status === 'unread') handleUpdateStatus(msg._id, 'read');
                  }}
                >
                  <div className="item-top">
                    <span className="sender-name">{msg.name || 'Anonymous'}</span>
                    <span className="item-date">{new Date(msg.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                  </div>
                  <div className="item-subject">{msg.subject || 'No Subject'}</div>
                  <div className="item-footer">
                    {getStatusBadge(msg.status)}
                    <ChevronRight size={14} className="arrow" />
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Message Viewer */}
        <main className="message-viewer-area">
          {selectedMessage ? (
            <div className="viewer-card-modern">
              <div className="viewer-header">
                <div className="sender-profile-large">
                  <div className="avatar-letter">{(selectedMessage.name || 'A')[0]}</div>
                  <div className="sender-info">
                    <h2>{selectedMessage.name || 'Anonymous'}</h2>
                    <p><Mail size={14} /> {selectedMessage.email || 'No email'}</p>
                  </div>
                </div>
                <div className="viewer-actions">
                  <button className="btn-reply-modern" onClick={() => handleReply(selectedMessage)}>
                    <Reply size={16} /> <span>Compose Reply</span>
                  </button>
                  <button className="btn-delete-modern" onClick={() => handleDelete(selectedMessage._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="viewer-body-modern">
                <div className="message-container">
                  <div className="subject-line">
                    <span className="label">Subject</span>
                    <h3>{selectedMessage.subject || 'No Subject'}</h3>
                  </div>
                  <div className="content-payload">
                    <span className="label">Message</span>
                    <div className="payload-box">
                      {selectedMessage.message || 'No message content.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="viewer-footer-modern">
                <div className="timestamp-info">
                  <Clock size={14} /> Registered at {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
                <div className="status-selector">
                  <label>Update Thread Status:</label>
                  <select 
                    value={selectedMessage.status} 
                    onChange={(e) => handleUpdateStatus(selectedMessage._id, e.target.value)}
                  >
                    <option value="unread">Mark Unread</option>
                    <option value="read">Mark Read</option>
                    <option value="replied">Mark Replied</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="viewer-placeholder-modern">
              <div className="placeholder-icon-box"><MessageSquare size={48} /></div>
              <h3>Select a Message</h3>
              <p>Choose an inquiry from the inbox sidebar to view the full communication thread and respond.</p>
            </div>
          )}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .inbox-container-grid { display: grid; grid-template-columns: 360px 1fr; gap: 2rem; height: calc(100vh - 200px); }
        
        .inbox-sidebar-card { background: white; border-radius: 16px; border: 1px solid var(--admin-border); box-shadow: var(--admin-shadow); display: flex; flex-direction: column; overflow: hidden; }
        .sidebar-search { padding: 1.25rem; border-bottom: 1px solid var(--admin-border); display: flex; align-items: center; gap: 10px; background: #F8FAFC; }
        .sidebar-search input { border: none; background: transparent; outline: none; font-size: 0.9rem; flex-grow: 1; }
        .inbox-list-area { overflow-y: auto; flex-grow: 1; }
        
        .inbox-item-modern { padding: 1.5rem; border-bottom: 1px solid #F1F5F9; cursor: pointer; transition: 0.2s; position: relative; }
        .inbox-item-modern:hover { background: #F8FAFC; }
        .inbox-item-modern.active { background: var(--admin-primary-light); }
        .inbox-item-modern.active::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--ieee-blue); }
        .inbox-item-modern.unread .sender-name, .inbox-item-modern.unread .item-subject { font-weight: 800; color: #0F172A; }
        
        .item-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
        .sender-name { font-weight: 700; font-size: 0.95rem; color: #1E293B; }
        .item-date { font-size: 0.75rem; color: #94A3B8; }
        .item-subject { font-size: 0.85rem; color: #64748B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 12px; }
        .item-footer { display: flex; justify-content: space-between; align-items: center; }
        .status-pill { font-size: 0.65rem; font-weight: 800; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.05em; }
        .arrow { color: #CBD5E1; transition: 0.2s; }
        .inbox-item-modern:hover .arrow { transform: translateX(3px); color: var(--ieee-blue); }
        
        .message-viewer-area { height: 100%; }
        .viewer-card-modern { height: 100%; background: white; border-radius: 16px; border: 1px solid var(--admin-border); box-shadow: var(--admin-shadow); display: flex; flex-direction: column; overflow: hidden; }
        
        .viewer-header { padding: 1.5rem 2rem; border-bottom: 1px solid var(--admin-border); display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; }
        .sender-profile-large { display: flex; align-items: center; gap: 1rem; }
        .avatar-letter { width: 52px; height: 52px; border-radius: 50%; background: var(--ieee-blue); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; }
        .sender-info h2 { margin: 0; font-size: 1.25rem; color: #1E293B; }
        .sender-info p { margin: 2px 0 0; font-size: 0.85rem; color: #64748B; display: flex; align-items: center; gap: 6px; }
        
        .viewer-actions { display: flex; gap: 10px; }
        .btn-reply-modern { background: var(--ieee-blue); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .btn-reply-modern:hover { background: var(--ieee-blue-dark); transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0, 98, 155, 0.2); }
        .btn-delete-modern { background: #FEF2F2; color: #EF4444; border: 1px solid #FEE2E2; width: 40px; height: 40px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .btn-delete-modern:hover { background: #EF4444; color: white; }
        
        .viewer-body-modern { flex-grow: 1; overflow-y: auto; padding: 2rem; }
        .label { font-size: 0.7rem; font-weight: 800; color: var(--ieee-blue); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px; }
        .subject-line { margin-bottom: 2.5rem; }
        .subject-line h3 { margin: 0; font-size: 1.4rem; color: #0F172A; }
        .payload-box { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 2rem; border-radius: 12px; font-size: 1.05rem; line-height: 1.8; color: #334155; white-space: pre-wrap; }
        
        .viewer-footer-modern { padding: 1.25rem 2rem; background: #F8FAFC; border-top: 1px solid var(--admin-border); display: flex; justify-content: space-between; align-items: center; }
        .timestamp-info { font-size: 0.8rem; color: #94A3B8; display: flex; align-items: center; gap: 6px; }
        .status-selector { display: flex; align-items: center; gap: 12px; font-size: 0.85rem; font-weight: 600; }
        .status-selector select { padding: 6px 12px; border-radius: 8px; border: 1px solid #E2E8F0; outline: none; background: white; }
        
        .viewer-placeholder-modern { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 4rem; color: #94A3B8; }
        .placeholder-icon-box { width: 100px; height: 100px; background: #F1F5F9; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #CBD5E1; margin-bottom: 2rem; }
        .viewer-placeholder-modern h3 { color: #475569; margin-bottom: 0.5rem; }
        
        .filter-group-modern { display: flex; background: #F1F5F9; padding: 4px; border-radius: 10px; }
        .filter-group-modern button { border: none; background: none; padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; color: #64748B; cursor: pointer; transition: 0.2s; }
        .filter-group-modern button.active { background: white; color: var(--ieee-blue); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

        .list-loading, .list-empty { padding: 3rem; text-align: center; color: #94A3B8; font-style: italic; }
        .list-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; }

        @media (max-width: 1024px) {
          .inbox-container-grid { grid-template-columns: 1fr; height: auto; }
          .inbox-sidebar-card { height: 400px; }
        }
      `}} />
    </div>
  );
};

export default ManageMessages;