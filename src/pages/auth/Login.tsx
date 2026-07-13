import React, { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Role } from '../../types';

export const Login = () => {
  const { login } = useAuth();
  const location = useLocation();
  
  // Determine role from URL
  const role: Role = location.pathname.includes('admin') 
    ? 'admin' 
    : location.pathname.includes('pm') 
      ? 'pm' 
      : 'user';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    
    // Frontend validation
    if (!formData.email.trim()) {
      setError('Email cannot be empty');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Must follow a valid email format');
      return;
    }
    
    if (!formData.password.trim()) {
      setError('Password cannot be empty');
      return;
    }
    
    try {
      // Try real login (backend). Include password so AuthContext will call API.
      await login({
        name: role === 'user' ? 'John Doe' : role === 'admin' ? 'Admin User' : 'Product Manager',
        email: formData.email,
        phone: '9876543210',
        role: role,
        password: formData.password
      } as any);
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle different types of errors
      if (err.message && err.message.includes('Invalid email or password')) {
        setError('Invalid email or password');
      } else if (err.errors && Array.isArray(err.errors)) {
        setError(err.errors[0] || 'Login failed. Please try again.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  const titles = {
    user: 'User Login',
    admin: 'Admin Portal',
    pm: 'Product Management'
  };

  const colors = {
    user: 'indigo',
    admin: 'slate',
    pm: 'emerald'
  };

  const colorClass = `text-${colors[role]}-600`;
  const bgClass = `bg-${colors[role]}-600`;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md border border-gray-100">
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold ${colorClass}`}>{titles[role]}</h2>
        <p className="text-gray-500 mt-2">Secure Access Control</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-opacity-50 focus:outline-none focus:ring-indigo-500"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-opacity-50 focus:outline-none focus:ring-indigo-500"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" className={`w-full ${role === 'admin' ? 'bg-slate-800 hover:bg-slate-900' : role === 'pm' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}>
          Login
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-500">
          Don't have an account?{' '}
          <Link to={`/${role}/signup`} className={`font-medium ${colorClass} hover:underline`}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
