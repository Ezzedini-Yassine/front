import { Routes, Route } from 'react-router-dom';
import Signup from './components/SignUp';
import ConfirmEmail from './components/ConfirmEmail';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DashboardContent from './components/dashboard/DashboardContent';
import Profile from './components/dashboard/Profile';
import SitesManager from './components/dashboard/SitesManager';
import UserManager from './components/dashboard/UserManager';
import DimmingManager from './components/dashboard/DimmingManager';
import LinesManager from './components/dashboard/LinesManager'; // New import
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Signup />} />
      <Route path="/confirm/:token" element={<ConfirmEmail />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardContent />} />
          <Route path="profile" element={<Profile />} />
          <Route path="sites-manager" element={<SitesManager />} />
          <Route path="user-manager" element={<UserManager />} />
          <Route path="dimming-manager" element={<DimmingManager />} />
          <Route path="lines-manager" element={<LinesManager />} /> {/* New route */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;