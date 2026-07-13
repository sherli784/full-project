import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatCurrency } from '../../lib/utils';
import { Package, Clock, CheckCircle, Truck, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { translations } from '../../lib/translations';

// Direct access to Tamil translations for debugging
const tamilTranslations = translations.ta.orders;

interface GroupedItem {
  productName: string;
  priceAtPurchase: number;
  sizes: Record<string, number>;
}

interface OrderItem {
  productId: string;
  productName: string;
  priceAtPurchase: number;
  size: string;
  quantity: number;
}

interface Order {
  id?: string;
  _id?: string;
  userId: string;
  date: string;
  totalAmount: number;
  address: string;
  status: string;
  paymentMethod: string;
  items: OrderItem[];
}

export const MyOrders = () => {
  const { orders, cancelOrder, getOrders, setOrders }: { orders: Order[]; cancelOrder: (orderId: string) => Promise<any>; getOrders: () => Promise<Order[]>; setOrders: (orders: Order[]) => void } = useStore();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  
  // Debug: Log current language and translations
  console.log('Orders page - Current language:', language);
  console.log('Orders page - t object structure:', t);
  console.log('Orders page - t.orders:', t.orders);
  console.log('Orders page - t.orders keys:', t.orders ? Object.keys(t.orders) : 't.orders is undefined');
  console.log('Orders page - t.orders.title:', t.orders?.title);
  console.log('Orders page - t.orders.noOrders:', t.orders?.noOrders);
  console.log('Orders page - Full t object keys:', Object.keys(t));

  // Refresh orders when component mounts AND when user changes
  useEffect(() => {
    console.log('Orders page mounted, refreshing orders...');
    console.log('Current user:', user);
    console.log('Current user ID:', user?.id);
    
    const refreshOrders = async () => {
      try {
        console.log('REFRESHING ORDERS...');
        
        // Load orders from localStorage first (frontend orders)
        const frontendOrders = JSON.parse(localStorage.getItem('frontendOrders') || '[]');
        console.log('Frontend orders loaded:', frontendOrders.length);
        
        // Also try to get from backend if available
        try {
          const backendOrders = await getOrders();
          console.log('Backend orders loaded:', backendOrders?.length || 0);
        } catch (backendError) {
          console.warn('Backend orders failed, using frontend only:', backendError);
        }
        
        console.log('Orders refreshed successfully');
        
      } catch (error) {
        console.error('Failed to refresh orders on page load:', error);
      }
    };
    
    refreshOrders();
    
    // Also refresh when user changes
    if (user?.id) {
      console.log('User detected, refreshing orders for user:', user.id);
      refreshOrders();
    }
  }, [getOrders, user?.id]); // Added user dependency to refresh when user changes

  // Filter orders for current logged-in user or guest - PERMANENT FIX
  const myOrders = orders.filter(o => {
    console.log('=== ORDER FILTERING DEBUG ===');
    console.log('Order:', o);
    console.log('Order ID:', o.id || o._id);
    console.log('Order userId:', o.userId);
    console.log('Current user:', user);
    console.log('Current user ID:', user?.id);
    
    // Multiple matching strategies for robustness
    const userMatches = user?.id && (
      o.userId === user.id || 
      o.userId === `user_${user.id}` ||
      o.userId === user.id.toString() ||
      user.id.includes(o.userId) ||
      o.userId.includes(user.id)
    );
    
    const guestMatches = !user?.id && (
      o.userId === 'guest' || 
      !o.userId || 
      o.userId === 'test-user-id' ||
      o.userId === undefined
    );
    
    const shouldShow = userMatches || guestMatches;
    
    console.log('User matches:', userMatches);
    console.log('Guest matches:', guestMatches);
    console.log('Should show order:', shouldShow);
    console.log('=== END FILTERING DEBUG ===');
    
    return shouldShow;
  });

  // TEMPORARY: Show all orders for debugging
  const allOrdersForDebug = orders;
  
  console.log('=== FINAL ORDERS DEBUG ===');
  console.log('All orders count:', orders.length);
  console.log('Filtered orders count:', myOrders.length);
  console.log('All orders:', allOrdersForDebug);
  console.log('Filtered orders:', myOrders);
  console.log('=== END FINAL DEBUG ===');

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm(t.orders.cancelConfirm)) {
      return;
    }

    try {
      await cancelOrder(orderId);
      alert(t.orders.orderCancelled);
    } catch (error: any) {
      alert('Failed to cancel order: ' + error.message);
    }
  };

  if (myOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            {/* Debug: Show current language */}
            <div className="mb-4 text-xs text-gray-500">
              Current language: {language} | t.orders exists: {!!t.orders}
            </div>
            
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t.orders?.noOrders || (language === 'ta' ? 'நீங்கள் ஆர்டர்கள் இல்லை' : 'No orders yet')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t.orders?.startShopping || (language === 'ta' ? 'ஷாப்பிங் செய்யத் தொடங்கள்' : 'Start shopping to see your orders here')}
            </p>
            <Link to="/user/shop">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-xl transition-all duration-200 hover-scale">
                {t.orders?.shop || (language === 'ta' ? 'ஷாப்பிங் செய்யவது' : 'Continue Shopping')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Shipped': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'Cancelled': return <X className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 text-gradient">{t.orders?.title || (language === 'ta' ? 'எனது ஆர்டர்கள்' : 'My Orders')}</h1>
            <p className="text-gray-600 dark:text-gray-400">Track and manage your orders</p>
            
            {/* Debug Info */}
            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400">
              <div className="font-bold mb-2">DEBUG INFORMATION:</div>
              <div>Current User ID: {user?.id || 'Not logged in'}</div>
              <div>User Role: {user?.role || 'No role'}</div>
              <div>Total Orders: {orders.length}</div>
              <div>Filtered Orders: {myOrders.length}</div>
              <div className="mt-2 space-x-2">
                <Button 
                  onClick={() => getOrders()} 
                  className="text-xs bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                >
                  Refresh Orders
                </Button>
                <Button 
                  onClick={async () => {
                    console.log('FORCE REFRESHING ORDERS...');
                    try {
                      const frontendOrders = JSON.parse(localStorage.getItem('frontendOrders') || '[]');
                      setOrders(frontendOrders);
                      console.log('Force refresh completed');
                    } catch (error) {
                      console.error('Force refresh failed:', error);
                    }
                  }} 
                  className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Force Refresh
                </Button>
              </div>
              <div className="mt-2">
                <details>
                  <summary className="cursor-pointer font-bold">Show All Orders (Debug)</summary>
                  <pre className="mt-1 text-xs overflow-auto max-h-40">
                    {JSON.stringify(orders, null, 2)}
                  </pre>
                </details>
              </div>
              <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
                <div className="font-bold text-yellow-800 dark:text-yellow-200">TEMPORARY DEBUG MODE:</div>
                <div>Showing {myOrders.length} filtered orders out of {orders.length} total orders</div>
                <div>If you see orders here but not above, check the console for filtering details</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* TEMPORARY: Show all orders for debugging */}
            <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <div className="font-bold text-yellow-800 dark:text-yellow-200">DEBUG: ALL ORDERS ({orders.length})</div>
              <div className="mt-2 space-y-2">
                {orders.map((order, index) => (
                  <div key={order.id || order._id} className="p-2 bg-white dark:bg-gray-800 rounded text-xs">
                    <div>Order {index + 1}: {order.id || order._id}</div>
                    <div>User ID: {order.userId}</div>
                    <div>Status: {order.status}</div>
                    <div>Items: {order.items?.length || 0}</div>
                    <div>Total: {formatCurrency(order.totalAmount)}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Filtered orders */}
            {myOrders.map((order, index) => {
              const orderId = order._id || order.id;
              return (
                <div key={orderId} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden card-elevated hover-lift animate-scaleIn" style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold mb-1">{t.orders?.orderPlaced || (language === 'ta' ? 'ஆர்டர் வைக்கப்பட்டது' : 'Order Placed')}</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold mb-1">{t.orders?.totalAmount || (language === 'ta' ? 'மொத்த தொகை' : 'Total Amount')}</p>
                        <p className="text-sm font-semibold text-gradient">{formatCurrency(order.totalAmount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold mb-1">{t.orders?.shippingTo || (language === 'ta' ? 'இங்கே ஷிப் செய்' : 'Shipping To')}</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={order.address}>{order.address}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold mb-1">{t.orders?.paymentMethod || (language === 'ta' ? 'கட்டண முறை' : 'Payment Method')}</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      {getStatusIcon(order.status)}
                      <span className="ml-2 font-bold text-gray-800 dark:text-gray-200">
                        {order.status === 'Pending' ? (t.orders?.pending || (language === 'ta' ? 'நிலுவையில் உள்ளது' : 'Pending')) : 
                         order.status === 'Cancelled' ? (t.orders?.cancelled || (language === 'ta' ? 'ரத்து செய்யப்பட்டது' : 'Cancelled')) : 
                         order.status === 'Delivered' ? (t.orders?.delivered || (language === 'ta' ? 'டெலிவரி செய்யப்பட்டது' : 'Delivered')) : order.status}
                      </span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{t.orders?.paymentMethod || (language === 'ta' ? 'கட்டண முறை' : 'Payment Method')}: {order.paymentMethod}</span>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      {(() => {
                        // Group items by product
                        const groupedItems: Record<string, GroupedItem> = order.items.reduce((acc: any, item) => {
                          if (!acc[item.productId]) {
                            acc[item.productId] = {
                              productName: item.productName,
                              priceAtPurchase: item.priceAtPurchase,
                              sizes: {}
                            };
                          }
                          
                          const sizeKey = item.size;
                          if (!acc[item.productId].sizes[sizeKey]) {
                            acc[item.productId].sizes[sizeKey] = 0;
                          }
                          
                          acc[item.productId].sizes[sizeKey] += item.quantity;
                          
                          return acc;
                        }, {});
                        
                        return Object.entries(groupedItems).map(([productId, item]) => {
                          const totalItems = Object.values(item.sizes).reduce((total: number, qty: number) => total + qty, 0);
                          
                          return (
                            <div key={productId} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div className="flex-grow">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.productName}</h4>
                                
                                {/* Size Breakdown */}
                                <div className="mb-2">
                                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Sizes: {Object.entries(item.sizes).map(([size, qty], index) => (
                                      <span key={size} className="inline-block">
                                        {size}:{qty}{qty > 0 && index < Object.entries(item.sizes).length - 1 && ', '}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Total: {totalItems} {totalItems === 1 ? 'dress' : 'dresses'}
                                  </div>
                                </div>

                                {/* Individual Size Details */}
                                <div className="space-y-1">
                                  {Object.entries(item.sizes).map(([size, qty]) => {
                                    const itemPrice = item.priceAtPurchase * qty;
                                    return (
                                      <div key={size} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Size {size}</span>
                                        <span className="text-gray-600 dark:text-gray-400">{qty} dresses</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(itemPrice)}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                                
                                {/* Total for this product */}
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Product Total</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                      {formatCurrency(Object.entries(item.sizes).reduce((total: number, [size, qty]) => {
                                        return total + (item.priceAtPurchase * qty);
                                      }, 0))}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* Cancel Button */}
                    {order.status === 'Pending' && (
                      <div className="px-6 pb-4">
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleCancelOrder(orderId!)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          {t.orders?.cancelOrder || (language === 'ta' ? 'ஆர்டரை ரத்து செய்' : 'Cancel Order')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
