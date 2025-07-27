import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const userData = {
      username,
      email,
      password,
      license: isAdmin ? undefined : [],
    };

    try {
      const endpoint = isAdmin ? '/api/users/register' : '/api/users/registeruser';
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Registration successful! Check your email for confirmation.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-white">
      <div className="bg-white rounded-lg shadow-lg flex overflow-hidden max-w-3xl">
        {/* Left Panel: Green "Welcome Back" */}
        <div className="hidden md:flex w-1/2 bg-green-500 p-10 text-white flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold mb-2">Welcome Back!</h1>
          <p className="mb-6">To keep connected with us please login with your personal info</p>
          <Link to="/login" className="bg-white text-green-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100">
            Sign In
          </Link>
        </div>

        {/* Right Panel: White Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-8 text-center">Create Account</h1>
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-green-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-green-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-green-500"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-green-500"
              required
            />

            {/* iOS-Style Toggle Switch */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Register as Admin</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={() => setIsAdmin(!isAdmin)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </div>
            </label>

            <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-full font-semibold hover:bg-green-600">
              Sign Up
            </button>
          </form>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {success && <p className="text-green-500 text-center mt-4">{success}</p>}
          <p className="text-center mt-4 md:hidden">
            Already have an account? <Link to="/login" className="text-green-500 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;