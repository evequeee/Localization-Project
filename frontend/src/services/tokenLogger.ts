import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  email?: string;
  sub?: string;
  role?: string[] | string;
  exp?: number;
  iat?: number;
  iss?: string;
  aud?: string;
  [key: string]: any;
}

/**
 * Декодує JWT токен та логує деталі
 */
export function logTokenDetails(token: string): void {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = (decoded.exp || 0) - now;
    
    const isExpired = expiresIn <= 0;
    const expiresStatus = isExpired ? '⏰ ЕКСПАЙРИВ' : `✅ (за ${expiresIn}с)`;

    console.group('🔐 JWT Token Деталі');
    console.log(`📧 Email: ${decoded.email || 'N/A'}`);
    console.log(`👤 User ID: ${decoded.sub || 'N/A'}`);
    console.log(`🎭 Ролі: ${
      Array.isArray(decoded.role) 
        ? decoded.role.join(', ') 
        : (decoded.role || 'N/A')
    }`);
    console.log(`📋 Видано: ${new Date((decoded.iat || 0) * 1000).toISOString()}`);
    console.log(`⏰ Експайр: ${new Date((decoded.exp || 0) * 1000).toISOString()} ${expiresStatus}`);
    console.log(`🌐 Issuer: ${decoded.iss || 'N/A'}`);
    console.log(`🎯 Audience: ${decoded.aud || 'N/A'}`);
    
    // Все claim'и у токені
    console.group('📦 Всі Claims:');
    Object.entries(decoded).forEach(([key, value]) => {
      if (!['email', 'sub', 'role', 'exp', 'iat', 'iss', 'aud'].includes(key)) {
        console.log(`  ${key}: ${JSON.stringify(value)}`);
      }
    });
    console.groupEnd();
    
    console.groupEnd();
  } catch (error) {
    console.error('❌ Помилка при декодуванні токена:', error);
  }
}

/**
 * Перевіряє, чи токен експайрив
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Math.floor(Date.now() / 1000);
    return (decoded.exp || 0) <= now;
  } catch {
    return true;
  }
}

/**
 * Отримує час до експайру у секундах
 */
export function getTimeUntilExpiry(token: string): number {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, (decoded.exp || 0) - now);
  } catch {
    return 0;
  }
}

/**
 * Логує глобальну інформацію про час та токен
 */
export function logSystemTime(): void {
  const now = new Date();
  const token = localStorage.getItem('token');
  
  console.group('⏱️  Системна Інформація');
  console.log(`🕐 Поточний час браузера: ${now.toISOString()}`);
  console.log(`   └─ Unix timestamp: ${Math.floor(now.getTime() / 1000)}`);
  
  if (token) {
    const timeUntilExpiry = getTimeUntilExpiry(token);
    const isExpired = isTokenExpired(token);
    console.log(`🔐 Статус токена: ${isExpired ? '❌ ЕКСПАЙРИВ' : `✅ Дійсний (${timeUntilExpiry}с)`}`);
  } else {
    console.log('🔐 Токен: Не знайдено');
  }
  
  console.groupEnd();
}
