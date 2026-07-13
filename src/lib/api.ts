import { User, Product, Offer, Order } from '../types';

const BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:5000';

const getAuthToken = () => localStorage.getItem('token');

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { headers, ...options });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }
  // try to parse json, else return null
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return null;
}

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ user: User; token?: string }> => {
    return request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  signup: async (payload: Omit<User, 'id'> & { password: string }) => {
    return request('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) });
  },
  getMe: async (): Promise<User> => request('/api/auth/me'),

  // Products / Offers
  getProducts: async (): Promise<Product[]> => request('/api/products'),
  getProduct: async (id: string): Promise<Product> => request(`/api/products/${id}`),
  getOffers: async (): Promise<Offer[]> => request('/api/offers'),

  // Admin: Products CRUD
  createProduct: async (payload: Partial<Product>) => {
    return request('/api/products', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateProductApi: async (id: string, payload: Partial<Product>) => {
    return request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },
  deleteProductApi: async (id: string) => {
    return request(`/api/products/${id}`, { method: 'DELETE' });
  },

  // Admin: Offers CRUD
  createOffer: async (payload: Partial<Offer>) => {
    return request('/api/offers', { method: 'POST', body: JSON.stringify(payload) });
  },
  updateOfferApi: async (id: string, payload: Partial<Offer>) => {
    return request(`/api/offers/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  },
  deleteOfferApi: async (id: string) => {
    return request(`/api/offers/${id}`, { method: 'DELETE' });
  },

  // Orders
  getOrders: async (userId?: string): Promise<Order[]> => {
    // For guest users, use bypass endpoint to avoid authentication
    if (!userId || userId === 'guest') {
      try {
        console.log('Getting orders via bypass endpoint...');
        const response = await request('/api/orders/bypass', { method: 'GET' });
        console.log('Orders received:', response);
        return response;
      } catch (error) {
        console.error('Failed to get orders via bypass:', error);
        return [];
      }
    }
    
    // For authenticated users, use regular endpoint
    const q = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return request(`/api/orders${q}`);
  },
  placeOrder: async (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    console.log('=== PLACE ORDER FUNCTION CALLED ===');
    console.log('=== FRONTEND ORDER PLACEMENT ===');
    console.log('Order data being sent:', JSON.stringify(orderData, null, 2));
    console.log('Current token:', getAuthToken());
    console.log('BASE URL:', BASE);
    
    try {
      console.log('Making request to:', `${BASE}/api/orders/bypass`);
      console.log('Request headers:', {
        'Content-Type': 'application/json'
      });
      
      const response = await request('/api/orders/bypass', { method: 'POST', body: JSON.stringify(orderData) });
      console.log('API Response received:', response);
      console.log('=== FRONTEND ORDER PLACEMENT END ===');
      return response;
    } catch (error: any) {
      console.log('=== FRONTEND ORDER ERROR ===');
      console.log('Frontend error details:', error);
      console.log('Error type:', typeof error);
      console.log('Error message:', error?.message);
      console.log('Error stack:', error?.stack);
      console.log('=== FRONTEND ERROR END ===');
      throw error;
    }
  },
};

export default api;
