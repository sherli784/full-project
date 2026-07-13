import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Offer, Order, CartItem, ProductSize, ProductRating, User } from '../types';
import { MOCK_PRODUCTS, MOCK_OFFERS, MOCK_ORDERS } from '../lib/mockData';
import { formatCurrency, generateId } from '../lib/utils';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

interface StoreContextType {
  products: Product[];
  offers: Offer[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  user: User | null;
  
  // Actions
  addProduct: (product: Product) => Promise<any>;
  updateProduct: (product: Product) => Promise<any>;
  deleteProduct: (id: string) => Promise<any>;
  
  addOffer: (offer: Offer) => Promise<any>;
  updateOffer: (offer: Offer) => Promise<any>;
  deleteOffer: (id: string) => Promise<any>;
  
  addToCart: (productId: string, size: ProductSize, quantity: number) => void;
  removeFromCart: (productId: string, size: ProductSize) => void;
  updateCartQuantity: (productId: string, size: ProductSize, quantity: number) => void;
  clearCart: () => void;
  
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  
  placeOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<any>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  cancelOrder: (orderId: string) => Promise<any>;
  getOrders: () => Promise<Order[]>;
  setOrders: (orders: Order[]) => void;
  
  // Rating actions
  addRating: (productId: string, rating: number, comment?: string) => Promise<void>;
  calculateAverageRating: (productId: string) => { average: number; total: number };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS); // Initialize with mock orders immediately
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const { user } = useAuth();

  // Debug: Log orders immediately
  console.log('StoreContext - Initial orders:', orders.length);
  console.log('MOCK_ORDERS length:', MOCK_ORDERS.length);

  // Load data from backend on mount (with mock fallback)
  useEffect(() => {
    console.log('StoreContext: Loading products and offers...');
    console.log('Setting orders immediately:', MOCK_ORDERS.length);
    setOrders(MOCK_ORDERS); // Ensure orders are set
    
    (async () => {
      try {
        console.log('Making API calls to get products and offers...');
        const [prodRes, offersRes] = await Promise.all([api.getProducts(), api.getOffers()]);
        console.log('API Response - Products:', prodRes);
        console.log('API Response - Offers:', offersRes);
        
        // Always use API data if available, only fallback to mock if API returns null/undefined
        if (prodRes && prodRes.length > 0) {
          setProducts(prodRes);
        } else {
          console.log('API returned empty products, using mock data');
          setProducts(MOCK_PRODUCTS);
        }
        
        if (offersRes && offersRes.length > 0) {
          setOffers(offersRes);
        } else {
          console.log('API returned empty offers, using mock data');
          setOffers(MOCK_OFFERS);
        }
      } catch (e) {
        console.error('Failed to load products/offers from API:', e);
        console.log('Using mock data as fallback');
        setProducts(MOCK_PRODUCTS);
        setOffers(MOCK_OFFERS);
      }

      // Load real orders from backend
      try {
        console.log('Loading orders from backend...');
        const ordersRes = await api.getOrders();
        console.log('Orders loaded from backend:', ordersRes);
        setOrders(ordersRes || []);
      } catch (e) {
        console.error('Failed to load orders from backend:', e);
        setOrders([]);
      }
    })();
  }, []); // Remove user dependency to load immediately

  // helper: recalc availability based on current size stocks
  const computeAvailability = (sizes: Product['sizes']): Product['availability'] => {
    const stocks = Object.values(sizes).map(s => s.stock);
    if (stocks.every(s => s <= 0)) return 'out-of-stock';
    if (stocks.some(s => s > 0 && s < 5)) return 'limited-stock';
    return 'in-stock';
  };

  // adjust a product's stock for a given size; positive delta reduces stock, negative adds back
  const adjustProductStock = (productId: string, size: ProductSize, delta: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id !== productId) return p;
        const current = p.sizes[size];
        if (!current) return p;
        const newStock = current.stock - delta;
        const newSizes = {
          ...p.sizes,
          [size]: { ...current, stock: newStock < 0 ? 0 : newStock },
        };
        return {
          ...p,
          sizes: newSizes,
          availability: computeAvailability(newSizes),
        };
      })
    );
  };

  // Product Actions
  const addProduct = async (product: Product) => {
    // optimistic UI: add locally first
    setProducts(prev => [...prev, product]);
    try {
      const saved = await api.createProduct(product);
      if (saved && saved._id) {
        // replace the local temporary product if needed (match by id)
        setProducts(prev => prev.map(p => p.id === product.id ? saved : p));
        return saved;
      }
      return product;
    } catch (err) {
      console.error('Failed to save product to backend:', err);
      return product;
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    try {
      const saved = await api.updateProductApi(updatedProduct.id, updatedProduct);
      return saved;
    } catch (err) {
      console.error('Failed to update product on backend:', err);
      return updatedProduct;
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await api.deleteProductApi(id);
      return true;
    } catch (err) {
      console.error('Failed to delete product on backend:', err);
      return false;
    }
  };

  // Offer Actions
  const addOffer = async (offer: Offer) => {
    setOffers(prev => [...prev, offer]);
    try {
      const saved = await api.createOffer(offer);
      if (saved && saved._id) setOffers(prev => prev.map(o => o.id === offer.id ? saved : o));
      return saved;
    } catch (err) {
      console.error('Failed to create offer on backend:', err);
      return offer;
    }
  };

  const updateOffer = async (updatedOffer: Offer) => {
    setOffers(prev => prev.map(o => o.id === updatedOffer.id ? updatedOffer : o));
    try {
      const saved = await api.updateOfferApi(updatedOffer.id, updatedOffer);
      return saved;
    } catch (err) {
      console.error('Failed to update offer on backend:', err);
      return updatedOffer;
    }
  };

  const deleteOffer = async (id: string) => {
    setOffers(prev => prev.filter(o => o.id !== id));
    try {
      await api.deleteOfferApi(id);
      return true;
    } catch (err) {
      console.error('Failed to delete offer on backend:', err);
      return false;
    }
  };

  // Cart Actions
  const addToCart = (productId: string, size: ProductSize, quantity: number) => {
    // adjust stock first (reduce)
    adjustProductStock(productId, size, quantity);

    setCart(prev => {
      const existing = prev.find(item => item.productId === productId && item.size === size);
      const product = products.find(p => p.id === productId)!;
      
      if (existing) {
        return prev.map(item => 
          item.productId === productId && item.size === size 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, size, quantity, product }];
    });
  };

  const removeFromCart = (productId: string, size: ProductSize) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId && item.size === size);
      if (existing) {
        adjustProductStock(productId, size, -existing.quantity); // restore stock
      }
      return prev.filter(item => !(item.productId === productId && item.size === size));
    });
  };

  const updateCartQuantity = (productId: string, size: ProductSize, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId && item.size === size);
      if (!existing) return prev;
      if (quantity <= 0) {
        // use removeFromCart logic which already adjusts stock
        adjustProductStock(productId, size, -existing.quantity);
        return prev.filter(item => !(item.productId === productId && item.size === size));
      }
      const diff = quantity - existing.quantity;
      if (diff !== 0) {
        adjustProductStock(productId, size, diff);
      }
      return prev.map(item => 
        item.productId === productId && item.size === size 
          ? { ...item, quantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setCart(prev => {
      prev.forEach(item => {
        adjustProductStock(item.productId, item.size, -item.quantity);
      });
      return [];
    });
  };

  // whenever products list changes (initial load or updates) ensure availability flag matches sizes
  useEffect(() => {
    setProducts(prev =>
      prev.map(p => ({
        ...p,
        availability: computeAvailability(p.sizes),
      }))
    );
  }, [products.length]);

  // Wishlist Actions
  const addToWishlist = (productId: string) => {
    if (!wishlist.includes(productId)) setWishlist([...wishlist, productId]);
  };
  const removeFromWishlist = (productId: string) => {
    setWishlist(wishlist.filter(id => id !== productId));
  };

  // Order Actions - SIMPLIFIED FRONTEND-ONLY VERSION
  const placeOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    try {
      console.log('=== PLACING ORDER - FRONTEND ONLY ===');
      console.log('Order data:', JSON.stringify(orderData, null, 2));
      console.log('Current user:', user);
      console.log('Current user ID:', user?.id);
      
      // Create order entirely in frontend - NO BACKEND DEPENDENCY
      const newOrder = {
        id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...orderData,
        userId: user?.id || 'guest', // Always use actual user ID or 'guest'
        date: new Date().toISOString(),
        status: 'Pending' as Order['status']
      };
      
      console.log('New order created:', JSON.stringify(newOrder, null, 2));
      
      // Save to localStorage for persistence
      const existingOrders = JSON.parse(localStorage.getItem('frontendOrders') || '[]');
      existingOrders.push(newOrder);
      localStorage.setItem('frontendOrders', JSON.stringify(existingOrders));
      
      // Update local state IMMEDIATELY
      setOrders(prev => {
        const updatedOrders = [...prev, newOrder];
        console.log('Orders state updated:', updatedOrders.length, 'orders');
        return updatedOrders;
      });
      
      // Clear cart after successful order
      clearCart();
      
      console.log('✅ Order placed successfully in frontend!');
      console.log('Order ID:', newOrder.id);
      console.log('Total orders now:', orders.length + 1);
      
      return newOrder;
      
    } catch (e: any) {
      console.error('=== PLACE ORDER ERROR ===');
      console.error('Failed to place order:', e);
      console.error('Error message:', e?.message);
      console.error('Error details:', e);
      
      // Re-throw the error for the UI to handle
      throw e;
    }
  };

  // Enhanced getOrders to load from localStorage
  const getOrders = async () => {
    try {
      console.log('=== GETTING ORDERS FROM FRONTEND ===');
      
      // Load orders from localStorage
      const frontendOrders = JSON.parse(localStorage.getItem('frontendOrders') || '[]');
      console.log('Frontend orders loaded:', frontendOrders.length);
      
      // Also try to get from backend if available, but don't fail if it doesn't work
      try {
        const backendOrders = await api.getOrders();
        console.log('Backend orders loaded:', backendOrders?.length || 0);
        
        // Merge frontend and backend orders
        const allOrders = Array.isArray(backendOrders) ? [...frontendOrders, ...backendOrders] : frontendOrders;
        setOrders(allOrders);
        console.log('Total merged orders:', allOrders.length);
        return allOrders;
      } catch (backendError) {
        console.warn('Backend orders failed, using frontend only:', backendError);
        setOrders(frontendOrders);
        return frontendOrders;
      }
      
    } catch (error) {
      console.error('Failed to get orders:', error);
      // Fallback to empty array
      const fallbackOrders = JSON.parse(localStorage.getItem('frontendOrders') || '[]');
      setOrders(fallbackOrders);
      return fallbackOrders;
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const cancelOrder = async (orderId: string) => {
    try {
      console.log('=== CANCELLING ORDER ===');
      console.log('Order ID:', orderId);
      
      // Send cancellation to backend
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cancel failed:', response.status, errorData);
        throw new Error(`Failed to cancel order: ${errorData.message || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Order cancelled successfully:', result);
      
      // Refresh orders from backend to get updated state
      console.log('Refreshing orders after cancellation...');
      try {
        const ordersRes = await api.getOrders();
        console.log('Orders refreshed after cancellation:', ordersRes);
        setOrders(ordersRes || []);
      } catch (refreshError) {
        console.error('Failed to refresh orders after cancellation:', refreshError);
        // Update local state as fallback
        updateOrderStatus(orderId, 'Cancelled');
      }
      
      return result;
    } catch (error: any) {
      console.error('=== CANCEL ORDER ERROR ===');
      console.error('Cancel order error:', error);
      console.error('Error message:', error?.message);
      
      // Update local state as fallback
      updateOrderStatus(orderId, 'Cancelled');
      
      throw error;
    }
  };

  const calculateAverageRating = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.ratings || product.ratings.length === 0) {
      return { average: 0, total: 0 };
    }
    
    const ratings = product.ratings;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / ratings.length;
    
    return {
      average: Math.round(average * 10) / 10, // Round to 1 decimal place
      total: ratings.length
    };
  };

  // Rating functions
  const addRating = async (productId: string, rating: ProductRating) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');

      const updatedProducts = products.map(p => {
        if (p.id === productId) {
          const updatedRatings = p.ratings ? [...p.ratings, rating] : [rating];
          const updatedProduct = { ...p, ratings: updatedRatings };
          
          // Calculate new average rating
          const totalRating = updatedRatings.reduce((sum, r) => sum + r.rating, 0);
          updatedProduct.averageRating = totalRating / updatedRatings.length;
          updatedProduct.totalRatings = updatedRatings.length;
          
          return updatedProduct;
        }
        return p;
      });

      setProducts(updatedProducts);
    } catch (error) {
      console.error('Failed to add rating:', error);
      throw error;
    }
  };

  return (
    <StoreContext.Provider value={{
      products, offers, orders, cart, wishlist, user,
      addProduct, updateProduct, deleteProduct,
      addOffer, updateOffer, deleteOffer,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      addToWishlist, removeFromWishlist,
      placeOrder, updateOrderStatus, cancelOrder, getOrders, setOrders,
      addRating, calculateAverageRating
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
