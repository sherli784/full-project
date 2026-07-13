import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../lib/utils';
import { Order } from '../../types';

interface GroupedItem {
  productName: string;
  sizes: Record<string, number>;
}

export const MonitorOrders = () => {
  const { orders, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState('All');

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Processing': 'bg-blue-100 text-blue-800',
    'Shipped': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Monitoring</h1>
        <select 
          className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">#{order.id}</div>
                    <div className="text-sm text-gray-500">{order.date}</div>
                    <div className="text-xs text-gray-400 mt-1">{order.paymentMethod}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {(() => {
                        // Group items by product
                        const groupedItems: Record<string, GroupedItem> = order.items.reduce((acc, item) => {
                          if (!acc[item.productId]) {
                            acc[item.productId] = {
                              productName: item.productName,
                              sizes: {}
                            };
                          }
                          acc[item.productId].sizes[item.size] = 
                            (acc[item.productId].sizes[item.size] || 0) + item.quantity;
                          return acc;
                        }, {} as Record<string, GroupedItem>);

                        return Object.entries(groupedItems).map(([productId, productData]) => {
                          const sizeDisplay = Object.entries(productData.sizes)
                            .map(([size, qty]) => `${size}: ${qty}`)
                            .join(', ');
                          
                          return (
                            <div key={productId} className="text-sm text-gray-700">
                              <div className="font-medium">{productData.productName}</div>
                              <div className="text-xs text-gray-400 ml-2">{sizeDisplay}</div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className={`text-xs font-bold px-2 py-1 rounded border-none outline-none cursor-pointer ${statusColors[order.status]}`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500">No orders found matching this filter.</div>
          )}
        </div>
      </div>
    </div>
  );
};
