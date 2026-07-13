import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductSize } from '../../types';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const Inventory = () => {
  const { products, updateProduct } = useStore();

  const handleStockUpdate = (productId: string, size: ProductSize, newStock: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const updated = { ...product };
      updated.sizes[size].stock = newStock;
      updateProduct(updated);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory Management</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4 text-center">Size S</th>
              <th className="px-6 py-4 text-center">Size M</th>
              <th className="px-6 py-4 text-center">Size L</th>
              <th className="px-6 py-4 text-center">Size XL</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => {
              const totalStock = Object.values(product.sizes).reduce((a, b) => a + b.stock, 0);
              const isLowStock = totalStock < 10;

              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.category}</div>
                  </td>
                  {(['S', 'M', 'L', 'XL'] as ProductSize[]).map(size => (
                    <td key={size} className="px-6 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        className="w-16 text-center border rounded py-1 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                        value={product.sizes[size].stock}
                        onChange={(e) => handleStockUpdate(product.id, size, parseInt(e.target.value) || 0)}
                      />
                    </td>
                  ))}
                  <td className="px-6 py-4 text-center">
                    {isLowStock ? (
                      <span className="inline-flex items-center text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">
                        <CheckCircle className="w-3 h-3 mr-1" /> In Stock
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
