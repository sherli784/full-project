import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Trash2, Plus, Tag } from 'lucide-react';
import { generateId } from '../../lib/utils';
import { Offer } from '../../types';

export const ManageOffers = () => {
  const { offers, addOffer, deleteOffer } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    title: '',
    description: '',
    discountCode: '',
    discountPercent: 0,
    image: '',
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0,10)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOffer.title && newOffer.discountCode) {
      addOffer({
        id: `off_${generateId()}`,
        title: newOffer.title!,
        description: newOffer.description || '',
        discountCode: newOffer.discountCode!,
        discountPercent: newOffer.discountPercent || 0,
        image: newOffer.image || 'https://placehold.co/800x400?text=New+Offer',
        validUntil: newOffer.validUntil ? new Date(newOffer.validUntil).toISOString() : new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
      } as Offer);
      setIsModalOpen(false);
      setNewOffer({ title: '', description: '', discountCode: '', discountPercent: 0, image: '', validUntil: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-gradient">Manage Offers</h1>
            <p className="text-gray-500 dark:text-gray-400">Control promotional banners visible on User Home</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-xl transition-all duration-200 hover-scale">
            <Plus className="w-4 h-4 mr-2" /> Add New Offer
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map(offer => (
            <div key={offer.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden group card-elevated hover-lift animate-scaleIn">
              <div className="relative h-56 overflow-hidden">
                <img src={offer.image} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <Button variant="danger" size="sm" onClick={() => deleteOffer(offer.id)} className="w-full bg-red-500 hover:bg-red-600 text-white">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Offer
                    </Button>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    {offer.discountPercent}% OFF
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{offer.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{offer.description}</p>
                </div>
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                  <Tag className="w-5 h-5 mr-3 text-indigo-500" />
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Discount Code</div>
                    <div className="font-bold text-gray-900 dark:text-white font-mono">{offer.discountCode}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Offer">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
              <input 
                required
                className="w-full border rounded-md px-3 py-2"
                value={newOffer.title}
                onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                placeholder="e.g. Winter Clearance"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input 
                className="w-full border rounded-md px-3 py-2"
                value={newOffer.description}
                onChange={e => setNewOffer({...newOffer, description: e.target.value})}
                placeholder="e.g. Flat 50% off on Jackets"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
              <input 
                required
                className="w-full border rounded-md px-3 py-2"
                value={newOffer.discountCode}
                onChange={e => setNewOffer({...newOffer, discountCode: e.target.value})}
                placeholder="e.g. WINTER50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
              <input 
                type="number"
                min="0"
                max="100"
                required
                className="w-full border rounded-md px-3 py-2"
                value={newOffer.discountPercent}
                onChange={e => setNewOffer({...newOffer, discountPercent: Number(e.target.value)})}
                placeholder="e.g. 25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input 
                className="w-full border rounded-md px-3 py-2"
                value={newOffer.image}
                onChange={e => setNewOffer({...newOffer, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until (Optional)</label>
              <input 
                type="date"
                className="w-full border rounded-md px-3 py-2"
                value={newOffer.validUntil}
                onChange={e => setNewOffer({...newOffer, validUntil: e.target.value})}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Create Offer
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};
