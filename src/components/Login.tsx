import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api'; // Import the Axios instance

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate(); // For redirection after login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const credentials = { email, password };

    try {
      const response = await api.post('/api/users/login', credentials);
      const { accessToken } = response.data; // Extract accessToken from response
      localStorage.setItem('accessToken', accessToken); // Store access token (refresh is in cookie)
      setSuccess('Login successful!');
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-white">
      <div className="bg-white rounded-lg shadow-lg flex overflow-hidden max-w-3xl">
        {/* Left Panel: White Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-8 text-center">Sign In</h1>
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
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
            <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-full font-semibold hover:bg-green-600">
              Sign In
            </button>
          </form>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {success && <p className="text-green-500 text-center mt-4">{success}</p>}
          <p className="text-center mt-4 md:hidden">
            Don't have an account? <Link to="/signup" className="text-green-500 hover:underline">Sign Up</Link>
          </p>
        </div>

        {/* Right Panel: Green "Hello" */}
        <div className="hidden md:flex w-1/2 bg-green-500 p-10 text-white flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold mb-2">Hello,</h1>
          <p className="mb-6">Enter your personal details</p>
          <Link to="/signup" className="bg-white text-green-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;