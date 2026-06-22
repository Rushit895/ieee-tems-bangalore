import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ManageEvents from './pages/ManageEvents/ManageEvents';
import ManageTeam from './pages/ManageTeam/ManageTeam';
import ManageBranches from './pages/ManageBranches/ManageBranches';
import ManageGallery from './pages/ManageGallery/ManageGallery';
import ManageResources from './pages/ManageResources/ManageResources';
import ManageHome from './pages/ManageHome/ManageHome';
import ManageMessages from './pages/ManageMessages/ManageMessages';
import ManageBlogs from './pages/ManageBlogs/ManageBlogs';
import ManagePastExeCom from './pages/ManagePastExeCom/ManagePastExeCom';
import ErrorBoundary from './components/ErrorBoundary';

const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) return false;
  try {
    // Treat an expired JWT as logged-out so the user is sent back to login
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const AdminLayout = ({ children }) => (
  <div className="admin-app">
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><AdminLayout><ManageEvents /></AdminLayout></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><AdminLayout><ManageTeam /></AdminLayout></ProtectedRoute>} />
        <Route path="/branches" element={<ProtectedRoute><AdminLayout><ManageBranches /></AdminLayout></ProtectedRoute>} />
        <Route path="/gallery-manager" element={<ProtectedRoute><AdminLayout><ManageGallery /></AdminLayout></ProtectedRoute>} />
        <Route path="/blogs" element={<ProtectedRoute><AdminLayout><ManageBlogs /></AdminLayout></ProtectedRoute>} />
        <Route path="/past-execom" element={<ProtectedRoute><AdminLayout><ManagePastExeCom /></AdminLayout></ProtectedRoute>} />
        <Route path="/resources-manager" element={<ProtectedRoute><AdminLayout><ManageResources /></AdminLayout></ProtectedRoute>} />
        <Route path="/home-manager" element={<ProtectedRoute><AdminLayout><ManageHome /></AdminLayout></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><AdminLayout><ManageMessages /></AdminLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
