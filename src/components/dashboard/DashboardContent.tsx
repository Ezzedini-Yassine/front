import React, { useEffect, useState } from 'react';
import api from '../../api'; // Adjust path if needed (e.g., '../api' based on structure)
import Card from '../Card'; // Import Card component

interface UserStats {
  totalUsers: number;
  confirmedUsers: number;
  activeUsers: number;
}

const DashboardContent: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/users/stats');
        setStats(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Dashboard</h2>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Total Users" value={stats.totalUsers} />
          <Card title="Confirmed Users" value={stats.confirmedUsers} />
          <Card title="Active Users" value={stats.activeUsers} />
        </div>
      )}
    </div>
  );
};

export default DashboardContent;