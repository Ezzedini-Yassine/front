import React, { useEffect, useState } from 'react';
import api from '../../api'; // Adjust path

interface User {
  _id: string;
  username: string;
  email: string;
  Date_Creation: string;
  MailConfirm: boolean;
  AdminConfirmation: boolean;
  useractive: boolean;
}

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New form state
  const [newUsername, setNewUsername] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users/all');
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (userId: string, field: string, value: boolean) => {
    try {
      await api.put(`/api/users/update/${userId}`, { [field]: value });
      setUsers(users.map(user => user._id === userId ? { ...user, [field]: value } : user));
      showNotification('success', 'User updated successfully');
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification('error', 'Passwords do not match');
      return;
    }
    try {
      await api.post('/api/users/create-user', { username: newUsername, email: newEmail, password: newPassword });
      showNotification('success', 'User added successfully');
      fetchUsers(); // Refresh list
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to add user');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">User Manager</h2>

      {/* Top Half: User Table */}
      <div className="flex-1 overflow-auto mb-8">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Creation Date</th>
              <th className="px-4 py-2 text-left">Mail Confirm</th>
              <th className="px-4 py-2 text-left">Admin Confirmation</th>
              <th className="px-4 py-2 text-left">User Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{new Date(user.Date_Creation).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <select
                    value={user.MailConfirm ? 'true' : 'false'}
                    onChange={(e) => handleUpdate(user._id, 'MailConfirm', e.target.value === 'true')}
                    className="border rounded p-1"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={user.AdminConfirmation ? 'true' : 'false'}
                    onChange={(e) => handleUpdate(user._id, 'AdminConfirmation', e.target.value === 'true')}
                    className="border rounded p-1"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={user.useractive ? 'true' : 'false'}
                    onChange={(e) => handleUpdate(user._id, 'useractive', e.target.value === 'true')}
                    className="border rounded p-1"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Half: Add User Form */}
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Add New User</h3>
        <form onSubmit={handleAddUser} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            required
          />
          <button
            type="submit"
            disabled={!newUsername || !newEmail || !newPassword || newPassword !== confirmPassword}
            className="w-full bg-green-500 text-white py-3 rounded-full font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add User
          </button>
        </form>
      </div>

      {notification && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default UserManager;