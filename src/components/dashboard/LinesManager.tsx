import React, { useEffect, useState } from 'react';
import api from '../../api';
import { FiEdit, FiTrash } from 'react-icons/fi';

interface Line {
  _id: string;
  Id: string;
  Name: string;
  Description: string;
  Profil: string | { _id: string; Title: string } | null;
  Device: { _id: string; Name: string }[] | null;
}

interface Site {
  _id: string;
  name: string;
}

interface Profile {
  _id: string;
  Title: string;
}

const LinesManager: React.FC = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedLine, setSelectedLine] = useState<Line | null>(null);
  const [newLine, setNewLine] = useState<{ Id: string; Name: string; Description: string; Profil: string; Device: string[] }>({
    Id: '',
    Name: '',
    Description: '',
    Profil: '',
    Device: [],
  });
  const [editLine, setEditLine] = useState<{ Id: string; Name: string; Description: string; Profil: string; Device: string[] }>({
    Id: '',
    Name: '',
    Description: '',
    Profil: '',
    Device: [],
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [linesResponse, sitesResponse, profilesResponse] = await Promise.all([
        api.get('/api/lines'),
        api.get('/api/sites'),
        api.get('/api/dimming/profiles'),
      ]);
      // Transform and validate response data
      const formattedLines = linesResponse.data.map((item: any) => {
        const line: Line = {
          _id: item._id || '',
          Id: item.Id || '',
          Name: item.Name || '',
          Description: item.Description || '',
          Profil: null,
          Device: null,
        };
        // Handle Profil
        if (item.Profil && typeof item.Profil === 'object' && '_id' in item.Profil) {
          line.Profil = item.Profil._id;
        } else if (typeof item.Profil === 'string') {
          line.Profil = item.Profil;
        }
        // Handle Device
        if (Array.isArray(item.Device)) {
          line.Device = item.Device.map((d: any) => ({
            _id: d._id || '',
            Name: d.Name || '',
          }));
        }
        return line;
      });
      setLines(formattedLines);
      setSites(sitesResponse.data.map((item: any) => ({ _id: item._id || '', name: item.name || '' })));
      setProfiles(profilesResponse.data.map((item: any) => ({ _id: item._id || '', Title: item.Title || '' })));
    } catch (err: any) {
      console.error('Fetch error:', {
        message: err.message,
        response: err.response ? err.response.data : 'No response',
        status: err.response?.status,
      });
      setError(`Failed to fetch data: ${err.response?.data?.message || err.message}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/lines', newLine);
      showNotification('success', 'Line created');
      fetchData();
      setShowAddModal(false);
      setNewLine({ Id: '', Name: '', Description: '', Profil: '', Device: [] });
    } catch (err: any) {
      console.error('Create error:', err.response?.data || err.message);
      showNotification('error', err.response?.data?.message || 'Failed to create line');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLine) return;
    try {
      await api.put(`/api/lines/${selectedLine._id}`, editLine);
      showNotification('success', 'Line updated');
      fetchData();
      setShowEditModal(false);
    } catch (err: any) {
      console.error('Update error:', err.response?.data || err.message);
      showNotification('error', err.response?.data?.message || 'Failed to update line');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/lines/${id}`);
      showNotification('success', 'Line deleted');
      fetchData();
    } catch (err: any) {
      console.error('Delete error:', err.response?.data || err.message);
      showNotification('error', err.response?.data?.message || 'Failed to delete line');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Lines Manager</h2>
      <button onClick={() => setShowAddModal(true)} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
        Add Line
      </button>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Profile</th>
            <th className="px-4 py-2 text-left">Devices</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line._id} className="border-b">
              <td className="px-4 py-2">{line.Id}</td>
              <td className="px-4 py-2">{line.Name}</td>
              <td className="px-4 py-2">{line.Description}</td>
              <td className="px-4 py-2">{line.Profil ? (typeof line.Profil === 'string' ? 'N/A' : line.Profil.Title) : 'None'}</td>
              <td className="px-4 py-2">{line.Device?.map(d => d.Name).join(', ') || 'None'}</td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedLine(line);
                    setEditLine({
                      Id: line.Id,
                      Name: line.Name,
                      Description: line.Description || '',
                      Profil: typeof line.Profil === 'object' && line.Profil ? line.Profil._id : (line.Profil || ''),
                      Device: line.Device?.map(d => d._id) || [],
                    });
                    setShowEditModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FiEdit size={20} />
                </button>
                <button onClick={() => handleDelete(line._id)} className="text-red-500 hover:text-red-700">
                  <FiTrash size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Line Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-xl font-bold mb-4">Add Line</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                placeholder="ID"
                value={newLine.Id}
                onChange={(e) => setNewLine({ ...newLine, Id: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={newLine.Name}
                onChange={(e) => setNewLine({ ...newLine, Name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newLine.Description}
                onChange={(e) => setNewLine({ ...newLine, Description: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <select
                value={newLine.Profil}
                onChange={(e) => setNewLine({ ...newLine, Profil: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">No Profile</option>
                {profiles.map((profile) => (
                  <option key={profile._id} value={profile._id}>{profile.Title}</option>
                ))}
              </select>
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

      {/* Edit Line Modal */}
      {showEditModal && selectedLine && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Line</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="ID"
                value={editLine.Id}
                onChange={(e) => setEditLine({ ...editLine, Id: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={editLine.Name}
                onChange={(e) => setEditLine({ ...editLine, Name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={editLine.Description}
                onChange={(e) => setEditLine({ ...editLine, Description: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <select
                value={editLine.Profil}
                onChange={(e) => setEditLine({ ...editLine, Profil: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">No Profile</option>
                {profiles.map((profile) => (
                  <option key={profile._id} value={profile._id}>{profile.Title}</option>
                ))}
              </select>
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
                Save
              </button>
              <button onClick={() => setShowEditModal(false)} className="w-full bg-gray-300 py-2 rounded mt-2">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default LinesManager;