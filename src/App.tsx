import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/SignUp';
import ConfirmEmail from './components/ConfirmEmail';
import Login from './components/Login';
import Dashboard from './components/Dashboard'; // Parent dashboard layout
import DashboardContent from './components/dashboard/DashboardContent'; // Sub-components
import Profile from './components/dashboard/Profile';
import SitesManager from './components/dashboard/SitesManager';
import UserManager from './components/dashboard/UserManager';
import DimmingManager from './components/dashboard/DimmingManager';

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Signup />} />
      <Route path="/confirm/:token" element={<ConfirmEmail />} />
      <Route path="/login" element={<Login />} />
      {/* Protected dashboard with sub-routes */}
      <Route path="/dashboard" element={localStorage.getItem('authToken') ? <Dashboard /> : <Navigate to="/login" />}>
        <Route index element={<DashboardContent />} /> {/* Default sub-route */}
        <Route path="profile" element={<Profile />} />
        <Route path="sites-manager" element={<SitesManager />} />
        <Route path="user-manager" element={<UserManager />} />
        <Route path="dimming-manager" element={<DimmingManager />} />
      </Route>
    </Routes>
  );
}

export default App;