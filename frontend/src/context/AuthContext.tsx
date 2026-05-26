import { createContext, useState, useCallback, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { logTokenDetails, logSystemTime, isTokenExpired } from '../services/tokenLogger';

export type UserRole = 'Admin' | 'TeamAdmin' | 'User';

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

interface JwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, teamId?: number) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

// Функція для декодування JWT токена та витягування ролі
function extractRoleFromToken(token: string): UserRole | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    
    // Спробуємо витягти роль з різних полів JWT
    const role = decoded.role || 
                 decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
                 decoded['role'];
    
    if (role && ['Admin', 'TeamAdmin', 'User'].includes(role)) {
      return role as UserRole;
    }
    
    return null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      console.error('Error loading user from localStorage');
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        console.group('🔄 Token завантажено з localStorage');
        if (isTokenExpired(storedToken)) {
          console.warn('⏰ ВНИМАНИЕ: Токен ЕКСПАЙРИВ! Необхідно перезаваж...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          console.groupEnd();
          return null;
        }
        logTokenDetails(storedToken);
        logSystemTime();
        console.groupEnd();
      }
      return storedToken;
    } catch {
      console.error('❌ Error loading token from localStorage');
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token && !!user;

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      console.group('🔐 LOGIN');
      console.log(`📧 Email: ${email}`);
      
      // POST запит до /api/auth/login
      const response = await fetch('http://localhost:5169/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        console.error('❌ Login failed:', response.status);
        console.groupEnd();
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      const newToken = data.token;
      
      console.log('✅ Token отриманий від сервера');
      logTokenDetails(newToken);
      
      // Декодуємо токен, щоб витягти роль
      const role = extractRoleFromToken(newToken);
      
      if (!role) {
        console.error('❌ Cannot extract role from token');
        console.groupEnd();
        throw new Error('Неможливо витягти роль з токена');
      }

      // Декодуємо user ID з токена (або використовуємо з response)
      let userId: number;
      try {
        const decoded = jwtDecode<JwtPayload>(newToken);
        userId = parseInt(decoded.sub || '0', 10) || Math.random() * 10000;
      } catch {
        userId = Math.random() * 10000;
      }

      const newUser: User = {
        id: userId,
        email: email,
        role: role
      };

      setToken(newToken);
      setUser(newUser);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      console.log('✅ User logged in:', newUser);
      logSystemTime();
      console.groupEnd();
    } catch (error) {
      console.error('❌ Login error:', error);
      console.groupEnd();
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, teamId?: number) => {
    setLoading(true);
    try {
      console.group('📝 REGISTER');
      console.log(`📧 Email: ${email}`);
      
      // POST запит до /api/auth/register
      const response = await fetch('http://localhost:5169/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, teamId })
      });

      if (!response.ok) {
        console.error('❌ Register failed:', response.status);
        console.groupEnd();
        throw new Error('Registration failed');
      }

      const data = await response.json();

      const newToken = data.token;
      
      console.log('✅ Token отриманий від сервера');
      logTokenDetails(newToken);
      
      // Декодуємо токен, щоб витягти роль
      const role = extractRoleFromToken(newToken);
      
      if (!role) {
        console.error('❌ Cannot extract role from token');
        console.groupEnd();
        throw new Error('Неможливо витягти роль з токена');
      }

      // Декодуємо user ID з токена
      let userId: number;
      try {
        const decoded = jwtDecode<JwtPayload>(newToken);
        userId = parseInt(decoded.sub || '0', 10) || Math.random() * 10000;
      } catch {
        userId = Math.random() * 10000;
      }

      const newUser: User = {
        id: userId,
        email: email,
        role: role
      };

      setToken(newToken);
      setUser(newUser);

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      console.log('✅ User registered:', newUser);
      logSystemTime();
      console.groupEnd();
    } catch (error) {
      console.error('❌ Register error:', error);
      console.groupEnd();
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }, [user]);

  const hasPermission = useCallback((requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  }, [user]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    hasRole,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
