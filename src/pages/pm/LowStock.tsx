import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export const LowStock = () => {
  const { products, updateProduct } = useStore();
  const [stockThreshold, setStockThreshold] = useState<number>(10);
  const [selectedSize, setSelectedSize] = useState<string>('All');

  // Get all products with low stock
  const lowStockProducts = products.filter(product => {
    const hasLowStock = Object.entries(product.sizes).some(
      ([_, sizeData]) => sizeData.stock < stockThreshold
    );
    return hasLowStock;
  });

  // Calculate low stock items
  const lowStockItems = lowStockProducts.flatMap(product =>
    Object.entries(product.sizes).map(([size, sizeData]) => ({
      productId: product.id,
      productName: product.name,
      category: product.category,
      size,
      stock: sizeData.stock,
      price: sizeData.price,
      image: product.image,
      isLow: sizeData.stock < stockThreshold
    }))
  ).filter(item => item.isLow);

  // Filter by size if selected
  const filteredItems = selectedSize === 'All'
    ? lowStockItems
    : lowStockItems.filter(item => item.size === selectedSize);

  const totalLowStockUnits = filteredItems.reduce((acc, item) => acc + item.stock, 0);
  const criticalItems = filteredItems.filter(item => item.stock === 0).length;

  const handleRestockProduct = (productId: string, size: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const updatedProduct = { ...product };
      // Add 50 units as default restock amount
      updatedProduct.sizes[size as keyof typeof product.sizes].stock += 50;
      updateProduct(updatedProduct);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-3 rounded-full text-red-600">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Low Stock Products</h1>
            <p className="text-gray-500">Monitor and manage inventory levels</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Low Stock Items</p>
          <p className="text-3xl font-bold text-red-600">{filteredItems.length}</p>
          <p className="text-xs text-gray-400 mt-1">Below {stockThreshold} units</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Units in Stock</p>
          <p className="text-3xl font-bold text-orange-600">{totalLowStockUnits}</p>
          <p className="text-xs text-gray-400 mt-1">Across all sizes</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Out of Stock Items</p>
          <p className="text-3xl font-bold text-red-700">{criticalItems}</p>
          <p className="text-xs text-gray-400 mt-1">Urgent restock needed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock Threshold</label>
            <input
              type="number"
              min="1"
              max="50"
              value={stockThreshold}
              onChange={(e) => setStockThreshold(Math.max(1, parseInt(e.target.value) || 10))}
              className="border border-gray-300 rounded-md px-3 py-2 w-32 focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-32 focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option>All</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {filteredItems.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full text-green-600">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">All Stock Levels Healthy!</h3>
          <p className="text-gray-500">No products below the {stockThreshold} unit threshold</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item, idx) => (
                <tr key={`${item.productId}-${item.size}-${idx}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.productName} 
                      className="w-10 h-10 rounded object-cover bg-gray-200"
                    />
                    <span className="font-medium text-gray-900">{item.productName}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.category}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                      {item.size}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold text-lg ${
                      item.stock === 0 ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {item.stock}
                    </span>
                    {item.stock === 0 && (
                      <span className="ml-2 text-red-600 text-xs font-bold">OUT OF STOCK</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(item.price)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRestockProduct(item.productId, item.size)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Restock +50
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
