import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductSize } from '../../types';

export const Cart = () => {
  const { cart, products, updateCartQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();
  const [stockErrors, setStockErrors] = useState<Record<string, string>>({});

  // Group cart items by product to show size breakdown
  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.productId]) {
      acc[item.productId] = {
        sizes: {
          S: 0,
          M: 0,
          L: 0,
          XL: 0
        }
      };
    }
    const currentSize = item.size as ProductSize;
    acc[item.productId].sizes[currentSize] = (acc[item.productId].sizes[currentSize] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, { sizes: Record<ProductSize, number> }>);

  const subtotal = cart.reduce((acc, item) => {
    const prod = products.find(p => p.id === item.productId);
    const price = prod ? prod.sizes[item.size].price : 0;
    return acc + (price * item.quantity);
  }, 0);

  // Calculate total items per product
  const getTotalItemsPerProduct = (sizes: Record<ProductSize, number>) => {
    return Object.values(sizes).reduce((total, qty) => total + qty, 0);
  };

  const handleQuantityUpdate = (productId: string, size: ProductSize, newQuantity: number) => {
    const itemKey = `${productId}-${size}`;
    const prod = products.find(p => p.id === productId);
    const availableStock = prod ? prod.sizes[size].stock : 0;
    
    if (newQuantity > availableStock) {
      setStockErrors((prev: Record<string, string>) => ({
        ...prev,
        [itemKey]: `Only ${availableStock} ${availableStock === 1 ? 'dress' : 'dresses'} available`
      }));
      return;
    }
    
    // Clear error if quantity is valid
    setStockErrors((prev: Record<string, string>) => {
      const newErrors = { ...prev };
      delete newErrors[itemKey];
      return newErrors;
    });
    
    updateCartQuantity(productId, size, newQuantity);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/user/shop">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-gradient">Shopping Cart ({cart.length} items)</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedCart).map(([productId, { sizes }]) => {
              const totalItems = getTotalItemsPerProduct(sizes);
              const product = products.find(p => p.id === productId)!;
              const itemTotal = Object.entries(sizes).reduce((total, [size, qty]) => {
                return total + (product.sizes[size].price * qty);
              }, 0);
              
              return (
                <div key={productId} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 card-elevated">
                  <div className="flex gap-6">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-32 h-40 object-cover rounded-xl bg-gray-100 dark:bg-gray-700"
                    />
                    
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
                        <span className="text-xl font-bold text-gradient">{formatCurrency(itemTotal)}</span>
                      </div>
                      
                      {/* Size Breakdown */}
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Sizes: {Object.entries(sizes).map(([size, qty], index) => (
                            <span key={size} className="inline-block">
                              {size}:{qty}{qty > 0 && index < Object.entries(sizes).length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          Total: {totalItems} {totalItems === 1 ? 'dress' : 'dresses'}
                        </div>
                      </div>
                      
                      {/* Individual Size Controls */}
                      <div className="space-y-3">
                        {Object.entries(sizes).map(([size, qty]) => {
                          const price = product.sizes[size].price;
                          const availableStock = product.sizes[size].stock;
                          const itemKey = `${productId}-${size}`;
                          const stockError = stockErrors[itemKey];
                          
                          return (
                            <div key={size} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div>
                                <span className="font-medium text-gray-900 dark:text-white">Size {size}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                  @ {formatCurrency(price)} each
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
                                  ({availableStock} available)
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <button 
                                  onClick={() => handleQuantityUpdate(productId, size as ProductSize, qty - 1)}
                                  className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded shadow-sm transition-colors"
                                  disabled={qty <= 1}
                                >
                                  <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </button>
                                <span className="text-sm font-medium w-8 text-center text-gray-900 dark:text-white">{qty}</span>
                                <button 
                                  onClick={() => handleQuantityUpdate(productId, size as ProductSize, qty + 1)}
                                  className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded shadow-sm transition-colors"
                                  disabled={qty >= availableStock}
                                >
                                  <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </button>
                                
                                <button 
                                  onClick={() => removeFromCart(productId, size as ProductSize)}
                                  className="text-red-500 hover:text-red-600 text-sm flex items-center ml-4"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" /> Remove
                                </button>
                              </div>
                              
                              {/* Stock Error Message */}
                              {stockError && (
                                <div className="col-span-full text-xs text-red-600 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded mt-2">
                                  {stockError}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 card-elevated h-fit sticky top-24">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between font-bold text-lg">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gradient">{formatCurrency(subtotal)}</span>
              </div>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-xl transition-all duration-200 hover-scale" 
              onClick={() => navigate('/user/checkout')}
            >
              Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
