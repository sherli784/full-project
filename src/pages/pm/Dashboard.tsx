import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PMDashboard = () => {
  const { products } = useStore();
  const navigate = useNavigate();

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => 
    Object.values(p.sizes).some(s => s.stock < 10)
  ).length;
  
  const totalInventoryCount = products.reduce((acc, p) => 
    acc + Object.values(p.sizes).reduce((sAcc, s) => sAcc + s.stock, 0)
  , 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Product Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 mr-4">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600 mr-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Inventory Units</p>
            <p className="text-2xl font-bold text-gray-900">{totalInventoryCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="bg-red-100 p-4 rounded-full text-red-600 mr-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-gray-900">{lowStockProducts}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={() => navigate('/pm/low-stock')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          >
            <h3 className="font-bold text-red-600 mb-1">View Low Stock</h3>
            <p className="text-sm text-gray-500">Monitor products running low on inventory.</p>
          </div>
          <div 
            onClick={() => navigate('/pm/inventory')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <h3 className="font-bold text-indigo-600 mb-1">Update Inventory</h3>
            <p className="text-sm text-gray-500">Quickly adjust stock levels for fast-moving items.</p>
          </div>
          <div 
            onClick={() => navigate('/pm/reports')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <h3 className="font-bold text-indigo-600 mb-1">Generate Sales Report</h3>
            <p className="text-sm text-gray-500">Download weekly performance reports.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
