import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Plus, Trash2, Edit } from 'lucide-react';
import { formatCurrency, generateId } from '../../lib/utils';
import { Product, ProductSize } from '../../types';

export const ProductMaintenance = () => {
  const { products, addProduct, deleteProduct, updateProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Shirts', 'T-Shirts', 'Jeans', 'Party Wear', 'Ethnic Wear'];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const initialProductState: Product = {
    id: '',
    name: '',
    category: 'Shirts',
    description: '',
    image: '',
    basePrice: 0,
    sizes: {
      S: { price: 0, stock: 0 },
      M: { price: 0, stock: 0 },
      L: { price: 0, stock: 0 },
      XL: { price: 0, stock: 0 },
    },
    isNew: true,
    isTrending: false
  };

  const [formData, setFormData] = useState<Product>(initialProductState);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...initialProductState, id: `prod_${generateId()}` });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(formData);
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  // Helper to update nested size data
  const updateSizeData = (size: ProductSize, field: 'price' | 'stock', value: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: {
          ...prev.sizes[size],
          [field]: value
        }
      }
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Maintenance</h1>
          <p className="text-gray-500">
            {selectedCategory === 'All' 
              ? `Manage ${products.length} products` 
              : `Showing ${filteredProducts.length} of ${products.length} products in ${selectedCategory}`
            }
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" /> Add New Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Base Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center space-x-3">
                  <img src={product.image} alt="" className="w-10 h-10 rounded object-cover bg-gray-200" />
                  <span className="font-medium text-gray-900">{product.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                <td className="px-6 py-4 font-medium">{formatCurrency(product.basePrice)}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEditModal(product)} className="text-indigo-600 hover:text-indigo-800">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Edit Product" : "Add New Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input 
                required
                className="w-full border rounded-md px-3 py-2"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                className="w-full border rounded-md px-3 py-2"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option>Shirts</option>
                <option>T-Shirts</option>
                <option>Jeans</option>
                <option>Party Wear</option>
                <option>Ethnic Wear</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (₹)</label>
              <input 
                type="number"
                required
                className="w-full border rounded-md px-3 py-2"
                value={formData.basePrice}
                onChange={e => setFormData({...formData, basePrice: parseInt(e.target.value)})}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input 
                required
                className="w-full border rounded-md px-3 py-2"
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
                placeholder="https://..."
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                className="w-full border rounded-md px-3 py-2"
                rows={2}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-gray-800 mb-3">Size Configuration</h3>
            <div className="grid grid-cols-4 gap-4">
              {(['S', 'M', 'L', 'XL'] as ProductSize[]).map(size => (
                <div key={size} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="text-center font-bold mb-2 text-gray-700">{size}</div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500">Price</label>
                      <input 
                        type="number"
                        className="w-full text-sm border rounded px-2 py-1"
                        value={formData.sizes[size].price}
                        onChange={e => updateSizeData(size, 'price', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Stock</label>
                      <input 
                        type="number"
                        className="w-full text-sm border rounded px-2 py-1"
                        value={formData.sizes[size].stock}
                        onChange={e => updateSizeData(size, 'stock', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingId ? 'Update Product' : 'Add Product'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
