import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Layout } from './components/layout/Layout';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';

// User Pages
import { UserHome } from './pages/user/Home';
import { Shop } from './pages/user/Shop';
import { Cart } from './pages/user/Cart';
import { Checkout } from './pages/user/Checkout';
import { MyOrders } from './pages/user/Orders';
import { Wishlist } from './pages/user/Wishlist';
import { About } from './pages/user/About';
import { Help } from './pages/user/Help';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { ManageOffers } from './pages/admin/Offers';
import { MonitorOrders } from './pages/admin/Orders';
import { RegisteredUsers } from './pages/admin/RegisteredUsers';

// PM Pages
import { PMDashboard } from './pages/pm/Dashboard';
import { Inventory } from './pages/pm/Inventory';
import { ProductMaintenance } from './pages/pm/Products';
import { Reports } from './pages/pm/Reports';
import { AdvancedSalesReport } from './pages/pm/AdvancedSalesReport';
import { LowStock } from './pages/pm/LowStock';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) => {
  const { user, isAuthenticated } = useAuth();

  console.log('ProtectedRoute check:', {
    user,
    isAuthenticated,
    allowedRole,
    userRole: user?.role,
    roleMatch: user?.role === allowedRole,
    hasToken: !!localStorage.getItem('token')
  });

  // Check authentication using both state and localStorage
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  const isActuallyAuthenticated = isAuthenticated || (token && savedUser);
  const currentUserRole = user?.role || (savedUser ? JSON.parse(savedUser).role : null);

  if (!isActuallyAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to={`/${allowedRole}/login`} />;
  }
  if (currentUserRole !== allowedRole) {
    console.log('Role mismatch, redirecting to login. Current role:', currentUserRole, 'Expected:', allowedRole);
    return <Navigate to={`/${allowedRole}/login`} />;
  }

  console.log('Access granted, showing protected content');
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/user/home" />} />

      <Route element={<Layout />}>
        {/* Auth Routes */}
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/signup" element={<Signup />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<Signup />} />
        <Route path="/pm/login" element={<Login />} />
        <Route path="/pm/signup" element={<Signup />} />

        {/* User Routes */}
        <Route path="/user" element={<Navigate to="/user/home" />} />
        <Route path="/user/home" element={<UserHome />} />
        <Route path="/user/shop" element={<Shop />} />
        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/checkout" element={<ProtectedRoute allowedRole="user"><Checkout /></ProtectedRoute>} />
        <Route path="/user/orders" element={<ProtectedRoute allowedRole="user"><MyOrders /></ProtectedRoute>} />
        <Route path="/user/wishlist" element={<Wishlist />} />
        <Route path="/user/about" element={<About />} />
        <Route path="/user/help" element={<Help />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/offers" element={<ProtectedRoute allowedRole="admin"><ManageOffers /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute allowedRole="admin"><MonitorOrders /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><RegisteredUsers /></ProtectedRoute>} />

        {/* PM Routes */}
        <Route path="/pm" element={<Navigate to="/pm/dashboard" />} />
        <Route path="/pm/dashboard" element={<ProtectedRoute allowedRole="pm"><PMDashboard /></ProtectedRoute>} />
        <Route path="/pm/products" element={<ProtectedRoute allowedRole="pm"><ProductMaintenance /></ProtectedRoute>} />
        <Route path="/pm/inventory" element={<ProtectedRoute allowedRole="pm"><Inventory /></ProtectedRoute>} />
        <Route path="/pm/reports" element={<ProtectedRoute allowedRole="pm"><Reports /></ProtectedRoute>} />
        <Route path="/pm/advanced-sales-report" element={<ProtectedRoute allowedRole="pm"><AdvancedSalesReport /></ProtectedRoute>} />
        <Route path="/pm/low-stock" element={<ProtectedRoute allowedRole="pm"><LowStock /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <StoreProvider>
            <LanguageProvider>
              <AppRoutes />
            </LanguageProvider>
          </StoreProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
