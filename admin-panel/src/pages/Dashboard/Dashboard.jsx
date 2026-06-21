import { useEffect, useState } from 'react';
import { fetchEvents, fetchTeam, fetchMessages, fetchBlogs } from '../../services/api';
import { Calendar, Users, Mail, TrendingUp, Layout, FileText, Image, School, Library, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  console.log("DASHBOARD RENDER");
  const [stats, setStats] = useState({ events: 0, team: 0, messages: 0, blogs: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await Promise.allSettled([
          fetchEvents(),
          fetchTeam(),
          fetchMessages(),
          fetchBlogs()
        ]);
        console.log("API Responses:", results);

        const [eventsResult, teamResult, messagesResult, blogsResult] = results;

        const getFulfilledData = (result, defaultValue = []) => 
          result.status === 'fulfilled' && result.value.data ? result.value.data : defaultValue;

        const eventsData = getFulfilledData(eventsResult);
        const teamData = getFulfilledData(teamResult);
        const messagesData = getFulfilledData(messagesResult);
        const blogsData = getFulfilledData(blogsResult);
        
        setStats({
          events: eventsData.length,
          team: teamData.length,
          messages: messagesData.length,
          blogs: blogsData.length
        });

        // Get top 3 recent events (sorted by date)
        const sortedEvents = [...eventsData].sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentEvents(sortedEvents.slice(0, 3));
        
        // Get top 3 recent messages
        setRecentMessages(messagesData.slice(0, 3));

        // Check for any failed requests and set a general error message
        if (results.some(res => res.status === 'rejected' || res.value.error)) {
          setError("Some data could not be loaded. The displayed stats might be incomplete.");
          console.error("Dashboard data loading errors:", results.filter(res => res.status === 'rejected' || res.value.error));
        }

      } catch (err) {
        // This catch is for catastrophic errors, not API ones handled by the interceptor
        console.error('Catastrophic data loading error:', err);
        setError("A major error occurred while loading dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const cards = [
    { label: "Total Events", value: stats.events, icon: <Calendar size={24} />, color: "#0ea5e9" },
    { label: "Team Members", value: stats.team, icon: <Users size={24} />, color: "#8b5cf6" },
    { label: "New Inquiries", value: stats.messages, icon: <Mail size={24} />, color: "#10b981" },
  ];

  const allActivities = [
    ...(recentEvents || []).map(e => ({
      name: e.title,
      category: e.category,
      type: 'Event',
      date: new Date(e.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: new Date(e.date) >= new Date() ? 'Upcoming' : 'Past'
    })),
    ...(recentMessages || []).map(m => ({
      name: `Inquiry: ${m.subject}`,
      category: 'Message',
      type: 'Inquiry',
      date: new Date(m.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'New'
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with IEEE TEMS Bangalore.</p>
      </header>

      {error && (
        <div className="error-banner">
          <AlertTriangle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="stats-grid">
        {cards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <span className="stat-label">{card.label}</span>
              <div className="stat-icon-wrapper" style={{ color: card.color, backgroundColor: `${card.color}15` }}>
                {card.icon}
              </div>
            </div>
            <p className="stat-number">{isLoading ? "..." : (card.value || 0)}</p>
            <div className="stat-footer">
              <span className="stat-trend" style={{ opacity: 0.7 }}>System actively monitored</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="table-container" style={{ margin: 0 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Quick Actions</h3>
          </div>
          <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            <a href="/" target="_blank" rel="noreferrer" className="action-card-link">
              <div className="action-card highlight">
                <TrendingUp size={20} />
                <span>View Public Site</span>
              </div>
            </a>
            <a href="/messages" className="action-card-link">
              <div className="action-card">
                <Mail size={20} />
                <span>Inquiries Inbox</span>
              </div>
            </a>
            <a href="/home-manager" className="action-card-link">
              <div className="action-card">
                <Layout size={20} />
                <span>Homepage Control</span>
              </div>
            </a>
            <a href="/events" className="action-card-link">
              <div className="action-card">
                <Calendar size={20} />
                <span>Events Registry</span>
              </div>
            </a>
            <a href="/team" className="action-card-link">
                <div className="action-card">
                    <Users size={20} />
                    <span>Leadership Hub</span>
                </div>
            </a>
            <a href="/branches" className="action-card-link">
                <div className="action-card">
                    <School size={20} />
                    <span>Student Network</span>
                </div>
            </a>
            <a href="/gallery-manager" className="action-card-link">
                <div className="action-card">
                    <Image size={20} />
                    <span>Gallery Assets</span>
                </div>
            </a>
            <a href="/blogs" className="action-card-link">
              <div className="action-card">
                <FileText size={20} />
                <span>Editorial Blog</span>
              </div>
            </a>
            <a href="/resources-manager" className="action-card-link">
              <div className="action-card">
                <Library size={20} />
                <span>Asset Repository</span>
              </div>
            </a>
          </div>

          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--admin-border)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Recent Activities</h3>
            <a href="/events" className="btn btn-primary" style={{ fontSize: '0.8rem', textDecoration: 'none' }}>View Events</a>
          </div>
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading activities...</td></tr>
              ) : allActivities.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No recent activities found.</td></tr>
              ) : (
                allActivities.map((act, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 500 }}>{act.name}</td>
                    <td><span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{act.category}</span></td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        backgroundColor: act.status === 'Upcoming' ? '#fef9c3' : act.status === 'New' ? '#dbeafe' : '#dcfce7', 
                        color: act.status === 'Upcoming' ? '#854d0e' : act.status === 'New' ? '#1e40af' : '#166534', 
                        fontSize: '0.75rem', 
                        fontWeight: 600 
                      }}>
                        {act.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>{act.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="stat-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>System Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Database</span>
              <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.875rem' }}>Connected</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>API Status</span>
              <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.875rem' }}>Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Environment</span>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Development</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>Node Version</span>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>v20.x</span>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .action-card-link { text-decoration: none; color: inherit; }
        .action-card { 
          padding: 1.5rem; 
          border: 1px solid var(--admin-border); 
          border-radius: 8px; 
          display: flex; 
          flex-direction: column; 
          gap: 12px; 
          align-items: center; 
          justify-content: center;
          transition: 0.2s;
          background: #f8fafc;
        }
        .action-card:hover {
          background: var(--admin-primary-light);
          border-color: var(--admin-primary);
          color: var(--admin-primary);
          transform: translateY(-2px);
        }
        .action-card span { font-weight: 600; font-size: 0.9rem; }
        .error-banner {
          background-color: #FFFBEB;
          color: #B45309;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .error-banner p { margin: 0; font-weight: 500; }
      `}} />
    </div>
  );
};

export default Dashboard;