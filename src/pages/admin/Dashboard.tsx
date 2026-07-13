import React from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../lib/utils';
import { Users, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';

export const AdminDashboard = () => {
  console.log('AdminDashboard component rendered');
  
  const { orders } = useStore();

  const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
  const totalOrders = orders.length;
  // Mock user count as we don't have a real user DB in this context
  const totalUsers = 124; 

  const stats = [
    { label: 'Total Sales', value: formatCurrency(totalSales), icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'from-blue-500 to-indigo-500' },
    { label: 'Registered Users', value: totalUsers, icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Avg Order Value', value: formatCurrency(totalOrders ? totalSales / totalOrders : 0), icon: TrendingUp, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-gradient">Admin Dashboard</h1>
          <p className="text-green-600 dark:text-green-400 font-medium">Dashboard loaded successfully!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl card-elevated hover-lift animate-scaleIn" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className={`bg-gradient-to-r ${stat.color} p-4 rounded-full text-white mr-4 inline-flex animate-pulse`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 card-elevated animate-slideInUp">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{order.id}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{order.date}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{order.userId}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'Processing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
