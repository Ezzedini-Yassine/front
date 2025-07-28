import React, { useEffect, useState } from 'react';
import api from '../../api';
import { FiEye, FiTrash } from 'react-icons/fi'; // Icons

interface Site {
  _id: string;
  name: string;
  description: string;
  location: { lat: number; lng: number };
  assignedUser?: { username: string };
}

interface User {
  _id: string;
  username: string;
}

const SitesManager: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newAssignedUser, setNewAssignedUser] = useState<string>('');
  const [newLat, setNewLat] = useState<number | null>(36.8065); // Mock lat (Tunis)
  const [newLng, setNewLng] = useState<number | null>(10.1815); // Mock lng (Tunis)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchSites();
    fetchUsers();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await api.get('/api/sites');
      setSites(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch sites');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users/all');
      setUsers(response.data);
    } catch (err: any) {
      console.error('Failed to fetch users');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/sites/${id}`);
      fetchSites();
      showNotification('success', 'Site deleted successfully');
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to delete site');
    }
  };

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLat || !newLng) return showNotification('error', 'Please select location on map');
    try {
      await api.post('/api/sites', { name: newName, description: newDescription, lat: newLat, lng: newLng, assignedUser: newAssignedUser });
      showNotification('success', 'Site added successfully');
      fetchSites();
      setShowAddModal(false);
      setNewName('');
      setNewDescription('');
      setNewAssignedUser('');
      setNewLat(36.8065); // Reset to mock
      setNewLng(10.1815); // Reset to mock
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to add site');
    }
  };

  const handleMapClick = () => {}; // No-op for now

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Sites Manager</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Assigned User</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <tr key={site._id} className="border-b">
              <td className="px-4 py-2">{site.name}</td>
              <td className="px-4 py-2">{site.description}</td>
              <td className="px-4 py-2">{site.assignedUser?.username || 'Unassigned'}</td>
              <td className="px-4 py-2 flex space-x-2">
                <button onClick={() => setSelectedLocation(site.location)} className="text-blue-500 hover:text-blue-700">
                  <FiEye size={20} />
                </button>
                <button onClick={() => handleDelete(site._id)} className="text-red-500 hover:text-red-700">
                  <FiTrash size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowAddModal(true)} className="bg-green-500 text-white px-6 py-2 rounded mb-4">
        Add Site
      </button>

      {/* Add Site Modal (Mocked without Map) */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Add Site</h3>
            <form onSubmit={handleAddSite} className="space-y-4">
              <input
                type="text"
                placeholder="Site Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <select
                value={newAssignedUser}
                onChange={(e) => setNewAssignedUser(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>{user.username}</option>
                ))}
              </select>
              <p className="text-gray-500">Location: Mocked at Tunis (36.8065, 10.1815)</p>
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
                Add
              </button>
              <button onClick={() => setShowAddModal(false)} className="w-full bg-gray-300 py-2 rounded mt-2">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Map Modal for Eye Icon (Commented Out) */}
      {selectedLocation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Site Location</h3>
            <p>Location: {selectedLocation.lat}, {selectedLocation.lng}</p>
            {/* <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={{ height: '100%', width: '100%' }}
                center={selectedLocation}
                zoom={15}
              >
                <Marker position={selectedLocation} />
              </GoogleMap>
            </LoadScript> */}
            <button onClick={() => setSelectedLocation(null)} className="w-full bg-gray-300 py-2 rounded mt-4">
              Close
            </button>
          </div>
        </div>
      )}

      {notification && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default SitesManager;