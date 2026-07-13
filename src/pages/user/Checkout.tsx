import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CheckCircle, AlertCircle, Truck } from 'lucide-react';

export const Checkout = () => {
  const { cart, placeOrder } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = cart.reduce((acc, item) => {
    return acc + (item.product.sizes[item.size].price * item.quantity);
  }, 0);

  const handlePlaceOrder = async () => {
    console.log('=== CHECKOUT PLACE ORDER START ===');
    console.log('Address:', address);
    console.log('Payment method:', paymentMethod);
    console.log('Cart items:', cart);
    console.log('User:', user);
    console.log('User ID:', user?.id);
    console.log('Is user authenticated:', !!user);
    console.log('Token in localStorage:', !!localStorage.getItem('token'));
    console.log('Subtotal:', subtotal);
    
    if (!address.trim()) {
      setOrderStatus('error');
      setErrorMessage('Please enter a valid delivery address');
      return;
    }
    
    if (cart.length === 0) {
      setOrderStatus('error');
      setErrorMessage('Your cart is empty. Add items to continue.');
      return;
    }
    
    setIsProcessing(true);
    setOrderStatus('processing');
    setErrorMessage('');
    
    try {
      const orderData = {
        userId: user?.id || 'guest',
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          size: item.size,
          quantity: item.quantity,
          priceAtPurchase: item.product.sizes[item.size].price
        })),
        totalAmount: subtotal,
        paymentMethod,
        address: address.trim(),
        date: new Date().toISOString(),
        status: 'Pending'
      };
      
      console.log('Order data prepared:', JSON.stringify(orderData, null, 2));
      console.log('Calling placeOrder function...');
      
      const result = await placeOrder(orderData);
      
      console.log('Order placed successfully!');
      console.log('Result:', result);
      
      setIsProcessing(false);
      setOrderStatus('success');
      
      // Clear cart after successful order
      setTimeout(() => {
        navigate('/user/orders');
      }, 2000);
      
    } catch (error: any) {
      console.error('=== CHECKOUT ERROR ===');
      console.error('Order placement failed:', error);
      console.error('Error message:', error.message);
      console.error('Error toString:', error.toString());
      
      setIsProcessing(false);
      setOrderStatus('error');
      
      // Provide user-friendly error message
      if (error.message) {
        setErrorMessage(`Order failed: ${error.message}`);
      } else if (error.toString().includes('404')) {
        setErrorMessage('Server error: Please try again later.');
      } else if (error.toString().includes('500')) {
        setErrorMessage('Server error: Please try again later.');
      } else {
        setErrorMessage('Order failed: Unknown error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 text-gradient">Checkout</h1>
            <p className="text-gray-600 dark:text-gray-400">Complete your order details</p>
          </div>
          
          {/* Status Messages */}
          {orderStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-fadeIn">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-400">Order Placed Successfully!</h3>
                  <p className="text-green-600 dark:text-green-300 text-sm">Redirecting to your orders...</p>
                </div>
              </div>
            </div>
          )}
          
          {orderStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-fadeIn">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-400">Order Failed</h3>
                  <p className="text-red-600 dark:text-red-300 text-sm">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Address Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 card-elevated">
                <div className="flex items-center mb-4">
                  <Truck className="w-5 h-5 text-indigo-500 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delivery Address</h3>
                </div>
                <textarea
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors dark:bg-gray-700 dark:text-white"
                  rows={4}
                  placeholder="Enter your full delivery address including landmark..."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 card-elevated">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 dark:text-white">Cash on Delivery (COD)</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive your order</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 dark:text-white">UPI Payment</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pay instantly via UPI</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 card-elevated h-fit sticky top-24">
              <div className="flex items-center mb-6">
                <ShoppingCart className="w-5 h-5 text-indigo-500 mr-2" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h3>
              </div>
              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                {cart.map(item => (
                  <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-300 truncate w-2/3">
                      {item.quantity}x {item.product.name} ({item.size})
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(item.product.sizes[item.size].price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between font-bold text-xl">
                  <span className="text-gray-900 dark:text-white">Total Amount</span>
                  <span className="text-gradient">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-xl transition-all duration-200 hover-scale" 
                size="lg" 
                onClick={handlePlaceOrder}
                isLoading={isProcessing}
                disabled={orderStatus === 'success'}
              >
                {isProcessing ? 'Processing...' : orderStatus === 'success' ? 'Order Placed!' : 'Confirm Order'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
