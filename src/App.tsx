import { Routes, Route } from 'react-router-dom';
import Signup from './components/SignUp';
import ConfirmEmail from './components/ConfirmEmail';
function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Signup />} /> {/* Default route redirects to /signup */}
      <Route path="/confirm/:token" element={<ConfirmEmail />} /> {/* New confirmation route */}
      {/* Add more routes here later, e.g., <Route path="/login" element={<Login />} /> */}
    </Routes>
  );
}

export default App;