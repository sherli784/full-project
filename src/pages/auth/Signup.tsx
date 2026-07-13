import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Role } from '../../types';

export const Signup = () => {
  const auth = useAuth();
  const location = useLocation();
  
  // Debug log
  console.log('Auth context:', auth);
  
  const register = auth?.register;
  const login = auth?.login;
  
  const role: Role = location.pathname.includes('admin') 
    ? 'admin' 
    : location.pathname.includes('pm') 
      ? 'pm' 
      : 'user';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto redirect after successful registration
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        window.location.href = `/${role}/login`;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, role]);

  const validate = () => {
    // Name validation
    if (!formData.name.trim()) {
      return 'Name cannot be empty';
    }
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      return 'Name must contain only alphabets';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      return 'Email cannot be empty';
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return 'Must follow a valid email format';
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      return 'Phone number cannot be empty';
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      return 'Phone number must contain only numbers and be exactly 10 digits';
    }
    
    // Password validation
    if (!formData.password) {
      return 'Password cannot be empty';
    }
    if (formData.password.length < 8) {
      return 'Password must contain at least 8 characters including letters, numbers, and special characters';
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(formData.password)) {
      return 'Password must contain at least 8 characters including letters, numbers, and special characters';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      return 'Please confirm your password';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!register) {
      setError('Registration service not available');
      return;
    }

    try {
      await register({ name: formData.name, email: formData.email, phone: formData.phone, role, password: formData.password } as any);
      setSuccess(true);
      setError('');
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Handle different types of errors
      if (err.errors && Array.isArray(err.errors)) {
        setError(err.errors[0] || 'Registration failed');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md border border-gray-100 mb-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-500 mt-2">Join KM Fashion Clothing Co</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded text-sm mb-4">
          Registration successful! Redirecting to login page...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            maxLength={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.confirmPassword}
            onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
          />
        </div>

        <Button type="submit" className="w-full mt-2">
          Sign Up
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-500">
          Already have an account?{' '}
          <Link to={`/${role}/login`} className="font-medium text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
