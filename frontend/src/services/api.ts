/**
 * API клієнт для управління JWT токенами
 * Додає токен до всіх запитів та обробляє 401 помилки
 */

import { isTokenExpired, getTimeUntilExpiry } from './tokenLogger';

const API_BASE_URLS = [
  import.meta.env.VITE_API_BASE_URL,
  'http://localhost:8080',
  'http://localhost:5169'
].filter((url, index, arr): url is string => !!url && arr.indexOf(url) === index);

async function fetchWithFallback(endpoint: string, init: RequestInit): Promise<Response> {
  let lastError: unknown;

  for (const baseUrl of API_BASE_URLS) {
    try {
      return await fetch(`${baseUrl}${endpoint}`, init);
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ API недоступний за ${baseUrl}, пробую інший...`);
    }
  }

  throw lastError ?? new Error('API недоступний');
}

// Функція для отримання токена з localStorage
function getToken(): string | null {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

// Функція для очищення даних при 401
function clearAuth(): void {
  try {
    console.warn('🔴 Токен невалідний! Очищення даних та перенаправлення на /login...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    globalThis.location.href = '/login';
  } catch {
    // Якщо localStorage недоступний, просто перенаправляємо
    globalThis.location.href = '/login';
  }
}

// GET запит з автоматичним додаванням токена
export async function apiGet(endpoint: string): Promise<any> {
  const token = getToken();
  
  console.group(`📤 GET ${endpoint}`);
  if (token) {
    if (isTokenExpired(token)) {
      console.warn('⏰ Токен ЕКСПАЙРИВ!');
    } else {
      const timeLeft = getTimeUntilExpiry(token);
      console.log(`🔐 Токен дійсний (${timeLeft}с до експайру)`);
    }
  } else {
    console.warn('🔓 Без токена (публічний запит)');
  }
  
  try {
    const response = await fetchWithFallback(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    if (response.status === 401) {
      console.error('❌ 401 Unauthorized - токен невалідний або експайрив');
      console.groupEnd();
      clearAuth();
      throw new Error('Токен протермінований');
    }

    if (!response.ok) {
      console.error(`❌ HTTP ${response.status}`);
      console.groupEnd();
      throw new Error(`HTTP ${response.status}`);
    }

    console.log('✅ Успішно');
    console.groupEnd();
    return await response.json();
  } catch (error) {
    console.error(`❌ Помилка:`, error);
    console.groupEnd();
    throw error;
  }
}

// POST запит з автоматичним додаванням токена
export async function apiPost(endpoint: string, data?: any): Promise<any> {
  const token = getToken();
  
  console.group(`📤 POST ${endpoint}`);
  if (token) {
    if (isTokenExpired(token)) {
      console.warn('⏰ Токен ЕКСПАЙРИВ!');
    } else {
      const timeLeft = getTimeUntilExpiry(token);
      console.log(`🔐 Токен дійсний (${timeLeft}с до експайру)`);
    }
  } else {
    console.warn('🔓 Без токена (публічний запит)');
  }
  console.log('Дані:', data);
  
  try {
    const response = await fetchWithFallback(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (response.status === 401) {
      console.error('❌ 401 Unauthorized - токен невалідний або експайрив');
      console.groupEnd();
      clearAuth();
      throw new Error('Токен протермінований');
    }

    if (!response.ok) {
      try {
        const errorData = await response.json();
        
        // Обробка валідаційних помилок з ProblemDetails
        if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, messages]: [string, any]) => {
              const msgs = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${msgs.join(', ')}`;
            })
            .join('\n');
          console.error(`❌ HTTP ${response.status}: Валідація`, errorMessages);
          console.groupEnd();
          throw new Error(errorMessages);
        }
        
        // Обробка error message з відповіді
        if (errorData.message) {
          console.error(`❌ HTTP ${response.status}:`, errorData.message);
          console.groupEnd();
          throw new Error(errorData.message);
        }
        
        // Обробка title з ProblemDetails
        if (errorData.title) {
          console.error(`❌ HTTP ${response.status}:`, errorData.title);
          console.groupEnd();
          throw new Error(errorData.title);
        }
      } catch (parseError) {
        // Якщо помилка з парсингу JSON, використовуємо статус
        if (parseError instanceof SyntaxError) {
          console.error(`❌ HTTP ${response.status}`);
          console.groupEnd();
          throw new Error(`HTTP ${response.status}`);
        }
        console.groupEnd();
        throw parseError;
      }
      
      console.error(`❌ HTTP ${response.status}`);
      console.groupEnd();
      throw new Error(`HTTP ${response.status}`);
    }

    console.log('✅ Успішно');
    console.groupEnd();
    return await response.json();
  } catch (error) {
    console.error(`❌ Помилка:`, error);
    console.groupEnd();
    throw error;
  }
}

// PUT запит з автоматичним додаванням токена
export async function apiPut(endpoint: string, data?: any): Promise<any> {
  const token = getToken();
  
  console.group(`📤 PUT ${endpoint}`);
  if (token) {
    if (isTokenExpired(token)) {
      console.warn('⏰ Токен ЕКСПАЙРИВ!');
    } else {
      const timeLeft = getTimeUntilExpiry(token);
      console.log(`🔐 Токен дійсний (${timeLeft}с до експайру)`);
    }
  } else {
    console.warn('🔓 Без токена (публічний запит)');
  }
  console.log('Дані:', data);
  
  try {
    const response = await fetchWithFallback(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (response.status === 401) {
      console.error('❌ 401 Unauthorized - токен невалідний або експайрив');
      console.groupEnd();
      clearAuth();
      throw new Error('Токен протермінований');
    }

    if (!response.ok) {
      try {
        const errorData = await response.json();
        
        // Обробка валідаційних помилок з ProblemDetails
        if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, messages]: [string, any]) => {
              const msgs = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${msgs.join(', ')}`;
            })
            .join('\n');
          console.error(`❌ HTTP ${response.status}: Валідація`, errorMessages);
          console.groupEnd();
          throw new Error(errorMessages);
        }
        
        // Обробка error message з відповіді
        if (errorData.message) {
          console.error(`❌ HTTP ${response.status}:`, errorData.message);
          console.groupEnd();
          throw new Error(errorData.message);
        }
        
        // Обробка title з ProblemDetails
        if (errorData.title) {
          console.error(`❌ HTTP ${response.status}:`, errorData.title);
          console.groupEnd();
          throw new Error(errorData.title);
        }
      } catch (parseError) {
        // Якщо помилка з парсингу JSON, використовуємо статус
        if (parseError instanceof SyntaxError) {
          console.error(`❌ HTTP ${response.status}`);
          console.groupEnd();
          throw new Error(`HTTP ${response.status}`);
        }
        console.groupEnd();
        throw parseError;
      }
      
      console.error(`❌ HTTP ${response.status}`);
      console.groupEnd();
      throw new Error(`HTTP ${response.status}`);
    }

    console.log('✅ Успішно');
    console.groupEnd();
    return await response.json();
  } catch (error) {
    console.error(`❌ Помилка:`, error);
    console.groupEnd();
    throw error;
  }
}

// PATCH запит з автоматичним додаванням токена
export async function apiPatch(endpoint: string, data?: any): Promise<any> {
  const token = getToken();
  
  try {
    const response = await fetchWithFallback(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (response.status === 401) {
      clearAuth();
      throw new Error('Токен протермінований');
    }

    if (!response.ok) {
      try {
        const errorData = await response.json();
        if (errorData.message) throw new Error(errorData.message);
        if (errorData.title) throw new Error(errorData.title);
      } catch (parseError) {
        if (!(parseError instanceof SyntaxError)) throw parseError;
      }
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`PATCH ${endpoint} помилка:`, error);
    throw error;
  }
}

// DELETE запит з автоматичним додаванням токена
export async function apiDelete(endpoint: string): Promise<any> {
  const token = getToken();
  
  try {
    const response = await fetchWithFallback(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    if (response.status === 401) {
      clearAuth();
      throw new Error('Токен протермінований');
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`DELETE ${endpoint} помилка:`, error);
    throw error;
  }
}
