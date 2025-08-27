import React, { useEffect, useState } from 'react';
import api from '../../api';
import axios, { AxiosError } from 'axios'; // Import Axios and AxiosError

interface Profile {
  _id: string;
  Title: string;
}

interface Device {
  _id: string;
  Name: string;
  DEVICE_CODE: string;
  ALERT: number;
  CONNECTION: string;
  STATUS: string;
  LIGHT_LV: number;
  DATA: any[];
  CHANGE_STATUS: string;
}

interface Site {
  _id: string;
  name: string;
}

const DimmingManager: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [isGlobal, setIsGlobal] = useState<boolean>(true);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [searchName, setSearchName] = useState<string>('');
  const [searchAlarm, setSearchAlarm] = useState<string>('');
  const [searchDeviceStatus, setSearchDeviceStatus] = useState<string>('');
  const [searchConnectivity, setSearchConnectivity] = useState<string>('');
  const [showAddProfile, setShowAddProfile] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [newLampeLevel, setNewLampeLevel] = useState<string>('');
  const [newPeriodic, setNewPeriodic] = useState<number>(0);
  const [newAnnual, setNewAnnual] = useState<number>(0);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchProfiles();
    fetchSites();
    fetchDevices(selectedProfile);
  }, [selectedProfile]);

  const fetchProfiles = async () => {
    try {
      const response = await api.get('/api/dimming/profiles');
      setProfiles(response.data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error('Failed to fetch profiles:', err.response?.data?.message || err.message);
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  const fetchSites = async () => {
    try {
      const response = await api.get('/api/sites');
      setSites(response.data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error('Failed to fetch sites:', err.response?.data?.message || err.message);
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  const fetchDevices = async (profileId: string) => {
    if (!profileId) return;
    try {
      const response = await api.get(`/api/dimming/profiles/${profileId}/devices`);
      setDevices(response.data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error('Failed to fetch devices:', err.response?.data?.message || err.message);
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const timeArray = newTime.split(',').map(t => t.trim());
    const lampeLevelArray = newLampeLevel.split(',').map(l => parseFloat(l.trim()));
    try {
      await api.post('/api/dimming/profiles', {
        Title: newTitle,
        Time: timeArray,
        Lampe_level: lampeLevelArray,
        Periodic: newPeriodic,
        Annual: newAnnual,
      });
      showNotification('success', 'Profile added');
      fetchProfiles();
      setShowAddProfile(false);
      setNewTitle('');
      setNewTime('');
      setNewLampeLevel('');
      setNewPeriodic(0);
      setNewAnnual(0);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        showNotification('error', err.response?.data?.message || 'Failed to add profile');
      } else {
        showNotification('error', 'Unexpected error occurred');
      }
    }
  };

  const handleAssign = async () => {
    try {
      const payload = isGlobal ? 'global' : selectedSites;
      await api.post('/api/dimming/assign', { profileId: selectedProfile, sites: payload });
      showNotification('success', 'Profile assigned');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        showNotification('error', err.response?.data?.message || 'Failed to assign profile');
      } else {
        showNotification('error', 'Unexpected error occurred');
      }
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredDevices = devices.filter(device =>
    device.Name.toLowerCase().includes(searchName.toLowerCase()) &&
    String(device.ALERT).includes(searchAlarm) &&
    device.STATUS.toLowerCase().includes(searchDeviceStatus.toLowerCase()) &&
    device.CONNECTION.toLowerCase().includes(searchConnectivity.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dimming Manager</h2>
      <div className="space-y-4">
        <button onClick={() => setShowAddProfile(true)} className="bg-green-500 text-white px-4 py-2 rounded">
          Create Profile
        </button>
        <select value={selectedProfile} onChange={(e) => setSelectedProfile(e.target.value)} className="border p-2 rounded">
          <option value="">Assign Profile</option>
          {profiles.map((profile) => (
            <option key={profile._id} value={profile._id}>{profile.Title}</option>
          ))}
        </select>
        <div className="space-x-4">
          <label>
            <input type="checkbox" checked={isGlobal} onChange={(e) => setIsGlobal(e.target.checked)} />
            Global
          </label>
          {!isGlobal && (
            <div className="mt-2 space-y-2">
              {sites.map((site) => (
                <label key={site._id}>
                  <input
                    type="checkbox"
                    checked={selectedSites.includes(site._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSites([...selectedSites, site._id]);
                      } else {
                        setSelectedSites(selectedSites.filter(id => id !== site._id));
                      }
                    }}
                  />
                  {site.name}
                </label>
              ))}
            </div>
          )}
        </div>
        <button onClick={handleAssign} className="bg-green-500 text-white px-4 py-2 rounded" disabled={!selectedProfile}>
          Assign
        </button>
        <div className="flex space-x-4">
          <input placeholder="Search by name or id" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="border p-2 rounded flex-1" />
          <input placeholder="Search By Alarm" value={searchAlarm} onChange={(e) => setSearchAlarm(e.target.value)} className="border p-2 rounded flex-1" />
          <input placeholder="Search By Device Status" value={searchDeviceStatus} onChange={(e) => setSearchDeviceStatus(e.target.value)} className="border p-2 rounded flex-1" />
          <input placeholder="Search By Connectivity Status" value={searchConnectivity} onChange={(e) => setSearchConnectivity(e.target.value)} className="border p-2 rounded flex-1" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
        </div>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th>DEVICE NAME</th>
              <th>DEVICE CODE</th>
              <th>ALERT</th>
              <th>CONNECTION</th>
              <th>STATUS</th>
              <th>LIGHT LV</th>
              <th>DATA</th>
              <th>CHANGE STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((device) => (
              <tr key={device._id}>
                <td>{device.Name}</td>
                <td>{device.DEVICE_CODE}</td>
                <td>{device.ALERT}</td>
                <td>{device.CONNECTION}</td>
                <td>{device.STATUS}</td>
                <td>{device.LIGHT_LV}</td>
                <td>{JSON.stringify(device.DATA)}</td>
                <td>{device.CHANGE_STATUS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Profile Form */}
      {showAddProfile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h3 className="text-xl font-bold mb-4">Create Profile</h3>
            <form onSubmit={handleAddProfile} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Time (e.g., 10:00,14:00)"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Lampe Level (e.g., 50,75)"
                value={newLampeLevel}
                onChange={(e) => setNewLampeLevel(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Periodic"
                value={newPeriodic}
                onChange={(e) => setNewPeriodic(parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Annual"
                value={newAnnual}
                onChange={(e) => setNewAnnual(parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded"
                required
              />
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
                Add
              </button>
              <button onClick={() => setShowAddProfile(false)} className="w-full bg-gray-300 py-2 rounded mt-2">
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

export default DimmingManager;