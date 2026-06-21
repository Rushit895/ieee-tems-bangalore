import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Home, 
  FileText,
  Settings,
  ChevronRight,
  School,
  Image,
  Library,
  Mail,
  History,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const adminUser = localStorage.getItem('adminUser') || 'Administrator';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };
  const menuGroups = [
    {
      title: "Main",
      items: [
        { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
      ]
    },
    {
      title: "Management",
      items: [
        { path: "/messages", label: "Inquiries", icon: <Mail size={20} /> },
        { path: "/home-manager", label: "Manage Home", icon: <Home size={20} /> },
        { path: "/events", label: "Events", icon: <Calendar size={20} /> },
        { path: "/team", label: "Team Members", icon: <Users size={20} /> },
        { path: "/branches", label: "Student Branches", icon: <School size={20} /> },
        { path: "/gallery-manager", label: "Gallery Management", icon: <Image size={20} /> },
        { path: "/blogs", label: "Blog Posts", icon: <FileText size={20} /> },
        { path: "/past-execom", label: "Past ExeCom", icon: <History size={20} /> },
        { path: "/resources-manager", label: "Resource Library", icon: <Library size={20} /> },
      ]
    }
  ];
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-container">
          <div className="logo-icon">I</div>
          <div className="logo-text">
            <span className="logo-brand">IEEE TEMS</span>
            <span className="logo-subtitle">Admin Panel</span>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuGroups.map((group, index) => (
          <div key={index} className="nav-group">
            <h3 className="nav-group-title">{group.title}</h3>
            {group.items.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path}
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                <ChevronRight className="nav-arrow" size={14} />
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <span className="nav-icon"><LogOut size={20} /></span>
          <span className="nav-label">Logout</span>
        </button>
        <div className="user-profile">
          <div className="user-avatar">{adminUser.slice(0, 2).toUpperCase()}</div>
          <div className="user-info">
            <p className="user-name">{adminUser}</p>
            <p className="user-role">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
