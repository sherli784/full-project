import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ModuleSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, currentRole } = useAuth();
  
  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetModule = e.target.value;
    if (targetModule === 'user') navigate('/user/login');
    if (targetModule === 'admin') navigate('/admin/login');
    if (targetModule === 'pm') navigate('/pm/login');
  };

  const isAuthPage = location.pathname.includes('login') || location.pathname.includes('signup');

  // Don't show on root landing if it exists, but show on module pages
  if (location.pathname === '/') return null;

  return (
    <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-sm sticky top-0 z-50 shadow-md">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center hover:text-indigo-400 transition-colors"
          title="Go Back"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 hidden sm:inline">Current Module:</span>
          <select 
            className="bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
            onChange={handleModuleChange}
            value={currentRole || 'user'}
          >
            <option value="user">User Module (Shopping)</option>
            <option value="admin">Admin Module (Business)</option>
            <option value="pm">Product Mgmt (Inventory)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user && !isAuthPage && (
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline text-gray-300">
              Hi, {user.name} ({user.role.toUpperCase()})
            </span>
            <button 
              onClick={logout}
              className="flex items-center text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
        )}
        {!user && !isAuthPage && (
           <span className="text-gray-400 italic text-xs">Not logged in</span>
        )}
      </div>
    </div>
  );
};
