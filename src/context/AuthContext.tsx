import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api';

interface AuthContextType {
  user: User | null;
  login: (userData: Omit<User, 'id'>) => Promise<void>;
  register: (userData: Omit<User, 'id'>) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  currentRole: Role | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine role from URL path
  const getRoleFromPath = (path: string): Role | null => {
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/pm')) return 'pm';
    if (path.startsWith('/user')) return 'user';
    return null;
  };

  const currentRole = getRoleFromPath(location.pathname);

  const register = async (userData: Omit<User, 'id'>) => {
    try {
      console.log('Attempting to register user:', userData);
      const anyData = userData as unknown as Record<string, any>;
      const res = await api.signup(anyData as Omit<User, 'id'> & { password: string });
      console.log('Registration response:', res);
      
      // After successful registration, redirect to login page
      if (anyData.email && anyData.password) {
        redirectByRoleToLogin(userData.role);
      }
    } catch (err: any) {
      console.error('Registration error in AuthContext:', err);
      
      // Don't use fallback for validation errors - throw them to be handled by UI
      if (err.message && (
        err.message.includes('Validation failed') ||
        err.message.includes('Email already exists') ||
        err.message.includes('Registration failed')
      )) {
        throw err;
      }
      
      // Fallback: create user locally for demo purposes (only for network/server errors)
      console.warn('API registration failed, using local fallback:', err);
      // Still redirect to login page even for local fallback
      redirectByRoleToLogin(userData.role);
    }
  };

  const login = async (userData: Omit<User, 'id'>) => {
    try {
      // If userData includes email and password fields, prefer remote login
      const anyData = userData as unknown as Record<string, any>;
      if (anyData.email && anyData.password) {
        const res = await api.login(anyData.email, anyData.password);
        console.log('Login response:', res);
        
        // Check if response has token (successful login)
        if (res && (res.token || res.user)) {
          localStorage.setItem('token', res.token || '');
          localStorage.setItem('user', JSON.stringify(res.user));
          setUser(res.user);
          console.log('User set and saved:', res.user);
          console.log('User role:', res.user.role);
          redirectByRole(res.user.role);
        } else {
          // Handle case where login response doesn't have expected structure
          throw new Error((res as any)?.message || 'Login failed');
        }
        return;
      }

      // Fallback: keep existing local behavior
      const newUser = { ...userData, id: Math.random().toString(36).substr(2, 9) } as User;
      setUser(newUser);
      redirectByRole(newUser.role);
    } catch (err: any) {
      console.error('Login error in AuthContext:', err);
      
      // Don't use fallback for validation errors - throw them to be handled by UI
      if (err.message && (
        err.message.includes('Invalid email or password') ||
        err.message.includes('Login failed') ||
        err.message.includes('Email not found') ||
        err.message.includes('Incorrect password')
      )) {
        throw err;
      }
      
      // Only use fallback for network/server errors
      console.warn('API login failed, using local fallback:', err);
      const newUser = { ...userData, id: Math.random().toString(36).substr(2, 9) } as User;
      setUser(newUser);
      redirectByRole(newUser.role);
    }
  };

  const redirectByRole = (role: Role | null) => {
    console.log('redirectByRole called with:', role);
    if (role === 'admin') {
      console.log('Navigating to /admin/dashboard');
      navigate('/admin/dashboard');
    }
    else if (role === 'pm') {
      console.log('Navigating to /pm/dashboard');
      navigate('/pm/dashboard');
    }
    else {
      console.log('Navigating to /user/home');
      navigate('/user/home');
    }
  };

  const redirectByRoleToLogin = (role: Role | null) => {
    if (role === 'admin') navigate('/admin/login');
    else if (role === 'pm') navigate('/pm/login');
    else navigate('/user/login');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (currentRole) {
      navigate(`/${currentRole}/login`);
    } else {
      navigate('/');
    }
  };

  // Enforce re-login on module switch
  useEffect(() => {
    if (user && currentRole && user.role !== currentRole) {
      // If user is logged in as 'user' but tries to access 'admin' routes, logout
      // Exception: Don't logout if we are just navigating to login page
      if (!location.pathname.includes('login') && !location.pathname.includes('signup')) {
         console.log('Role mismatch detected - user.role:', user.role, 'currentRole:', currentRole);
         setUser(null); // Force logout
         navigate(`/${currentRole}/login`);
      }
    }
  }, [location.pathname, user, currentRole, navigate]);

  // On mount, if there's a token, try to fetch current user
  useEffect(() => {
    console.log('AuthContext mount - checking localStorage');
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    console.log('Found token:', !!token, 'Found user:', !!savedUser);
    
    if (token && savedUser) {
      try {
        // Restore user from localStorage for now
        const user = JSON.parse(savedUser);
        console.log('Parsed user:', user);
        setUser(user);
        console.log('User state set successfully');
      } catch (e) {
        console.warn('Failed to parse saved user:', e);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user || (!!localStorage.getItem('token') && !!localStorage.getItem('user')), 
      currentRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
