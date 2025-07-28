import React, { useEffect, useState } from 'react';
import api from '../../api'; // Adjust path if needed

const DashboardContent: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await api.get('/api/protected'); // Your backend protected endpoint
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchProtectedData();
  }, []);

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">Welcome to Dashboard</h2>
      {data && <p>Protected data: {JSON.stringify(data)}</p>}
    </div>
  );
};

export default DashboardContent;