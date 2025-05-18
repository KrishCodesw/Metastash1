import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Both fields are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://metabackf.onrender.com/api/v1/auth/signin', {
        username,
        password,
      });

      if (response.status === 200) {
        toast.success('Sign in successful!');
        localStorage.setItem('token', response.data.token);
        navigate(`/dashboard/:id`);
      }
    } catch (err: any) {
      if (err.response) {
        toast.error(err.response.data.message || 'Invalid credentials.');
      } else {
        toast.error('Server error.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-sans px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm hover:text-white"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition-all duration-300 ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/50'
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="flex flex-col gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="w-full py-2 rounded-lg border border-indigo-500 text-indigo-400 hover:bg-indigo-600 hover:text-white transition"
            >
              Don't have an account? Sign Up
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2 rounded-lg border border-gray-500 text-gray-400 hover:bg-gray-700 hover:text-white transition"
            >
              Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
