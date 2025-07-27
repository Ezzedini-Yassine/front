import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiUser, FiMapPin, FiUsers, FiSliders, FiSettings } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <FiGrid size={20} />, path: '/dashboard' },
    { name: 'Profile', icon: <FiUser size={20} />, path: '/dashboard/profile' },
    { name: 'Sites Manager', icon: <FiMapPin size={20} />, path: '/dashboard/sites-manager' },
    { name: 'User Manager', icon: <FiUsers size={20} />, path: '/dashboard/user-manager' },
    { name: 'Dimming Manager', icon: <FiSliders size={20} />, path: '/dashboard/dimming-manager' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Navbar with Settings Icon */}
      <header className="bg-white shadow-md p-4 flex justify-end items-center">
        <button className="text-gray-700 hover:text-green-500">
          <FiSettings size={24} /> {/* Settings icon; add onClick if needed */}
        </button>
      </header>

      <div className="flex flex-1">
        {/* Left Vertical Menu (Sidebar) */}
        <aside className="w-64 bg-white shadow-md flex flex-col p-6 space-y-6">
          <h1 className="text-2xl font-bold text-green-500 mb-8">LuxBoard</h1>
          <nav className="space-y-4">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="flex items-center space-x-3 text-gray-700 hover:text-green-500 w-full text-left"
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Center Content Area */}
        <main className="flex-1 p-10">
          <Outlet /> {/* Renders the sub-component based on route */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;