import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { ModuleSwitcher } from './ModuleSwitcher';
import { ShoppingCart, Heart, Menu, X, Package, LayoutDashboard, Tag, FileText, Settings, TrendingUp, Filter, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageToggle } from '../ui/LanguageToggle';
import { ThemeSelector } from '../ui/ThemeSelector';
import { cn } from '../../lib/utils';

export const Layout = () => {
  const { currentRole } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 flex flex-col">
      <ModuleSwitcher />

      {/* Module Specific Header */}
      {currentRole === 'user' && <UserHeader />}
      {currentRole === 'admin' && <AdminHeader />}
      {currentRole === 'pm' && <PMHeader />}

      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1 rounded-lg">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-gradient">KM Fashion Clothing Co</span>
              </div>
              <p className="text-sm text-gray-400">© 2024 KM Fashion. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 hover-scale">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 hover-scale">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 hover-scale">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const UserHeader = () => {
  const { cart, wishlist } = useStore();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { currentRole } = useAuth();

  const links = [
    { name: t.navigation?.home || 'Home', path: '/user/home' },
    { name: t.navigation?.shop || 'Shop', path: '/user/shop' },
    { name: t.navigation?.orders || 'Orders', path: '/user/orders' },
    { name: t.navigation?.wishlist || 'Wishlist', path: '/user/wishlist' },
    { name: t.navigation?.about || 'About', path: '/user/about' },
    { name: t.navigation?.help || 'Help', path: '/user/help' },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-xl shadow-lg hover-scale">
            <Package className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gradient">KM Fashion Clothing Co</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-medium",
                  location.pathname === link.path && "text-indigo-600 dark:text-indigo-400"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <Link 
            to={`/${currentRole}/wishlist`}
            className="relative p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover-scale group"
            title="Wishlist"
          >
            <Heart className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-red-500 transition-colors duration-200" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link 
            to={`/${currentRole}/cart`}
            className="relative p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover-scale group"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition-colors duration-200" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cart.length}
              </span>
            )}
          </Link>

          <ThemeSelector />
          <LanguageToggle />

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover-scale"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 animate-slideInDown">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-3 text-sm font-medium transition-all duration-200 px-4 py-3 rounded-xl hover-scale",
                  location.pathname === link.path
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <span>{link.name}</span>
              </Link>
            ))}
            <ThemeSelector />
          </nav>
        </div>
      )}
    </header>
  );
};

const AdminHeader = () => {
  const location = useLocation();
  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Offers', path: '/admin/offers', icon: Tag },
    { name: 'Orders', path: '/admin/orders', icon: FileText },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-red-600 p-1.5 rounded">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">Admin Dashboard</span>
        </div>

        <nav className="flex items-center space-x-6">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center space-x-2 text-sm font-medium transition-colors px-3 py-2 rounded-md",
                location.pathname === link.path
                  ? "bg-red-50 text-red-700"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <link.icon className="w-4 h-4" />
              <span>{link.name}</span>
            </Link>
          ))}
          <ThemeSelector />
        </nav>
      </div>
    </header>
  );
};

const PMHeader = () => {
  const location = useLocation();
  const links = [
    { name: 'Dashboard', path: '/pm/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/pm/products', icon: Package },
    { name: 'Inventory', path: '/pm/inventory', icon: Settings },
    { name: 'Reports', path: '/pm/reports', icon: FileText },
    { name: 'Advanced Sales', path: '/pm/advanced-sales-report', icon: Filter },
    { name: 'Low Stock', path: '/pm/low-stock', icon: TrendingUp },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-600 p-1.5 rounded">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">Product Manager</span>
        </div>

        <nav className="flex items-center space-x-6">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center space-x-2 text-sm font-medium transition-colors px-3 py-2 rounded-md",
                location.pathname === link.path
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <link.icon className="w-4 h-4" />
              <span>{link.name}</span>
            </Link>
          ))}
          <ThemeSelector />
        </nav>
      </div>
    </header>
  );
};
