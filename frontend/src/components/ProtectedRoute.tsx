import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';
import type React from 'react';
import type { UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  fallback?: ReactNode;
}

/**
 * Компонент для захисту маршрутів на основі ролі користувача
 * @param children - компонент для рендерингу, якщо доступ дозволено
 * @param requiredRoles - масив ролей, яким дозволено доступ (якщо пусто, дозволено всім аутентифікованим)
 * @param fallback - компонент, який показати, якщо доступу немає (за замовчуванням редирект на /login)
 */
export const ProtectedRoute = ({
  children,
  requiredRoles = [],
  fallback
}: ProtectedRouteProps) => {
  const auth = useAuth();

  // Не аутентифіковано - редирект на /login
  if (!auth.isAuthenticated) {
    return fallback || <Navigate to="/login" replace />;
  }

  // Якщо ролі не вказані, то дозволяємо всім аутентифікованим користувачам
  if (requiredRoles.length === 0) {
    return <>{children}</>;
  }

  // Перевіряємо, чи має користувач потрібну роль
  if (!auth.hasPermission(requiredRoles)) {
    return fallback || <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

/**
 * HOC для обгортання сторінок з захистом за ролями
 */
export function withProtection<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: UserRole[]
) {
  return (props: P) => (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <Component {...props} />
    </ProtectedRoute>
  );
}

/**
 * Компонент для умовного рендерингу елементів на основі ролі
 * @param children - елемент, який показати
 * @param requiredRoles - масив ролей
 */
interface RoleBasedProps {
  children: ReactNode;
  requiredRoles: UserRole[];
  fallback?: ReactNode;
}

export const RoleBasedRender = ({
  children,
  requiredRoles,
  fallback = null
}: RoleBasedProps) => {
  try {
    const { hasPermission } = useAuth();
    return hasPermission(requiredRoles) ? <>{children}</> : fallback;
  } catch (err) {
    console.error('Помилка при перевірці прав:', err);
    return fallback;
  }
};
