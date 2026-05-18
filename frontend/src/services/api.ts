/**
 * API клієнт для управління JWT токенами
 * Додає токен до всіх запитів та обробляє 401 помилки
 */

const API_BASE_URL = 'http://localhost:5169';

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  } catch {
    // Якщо localStorage недоступний, просто перенаправляємо
    window.location.href = '/login';
  }
}

// GET запит з автоматичним додаванням токена
export async function apiGet(endpoint: string): Promise<any> {
  const token = getToken();
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
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
    console.error(`GET ${endpoint} помилка:`, error);
    throw error;
  }
}

// POST запит з автоматичним додаванням токена
export async function apiPost(endpoint: string, data?: any): Promise<any> {
  const token = getToken();
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
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
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`POST ${endpoint} помилка:`, error);
    throw error;
  }
}

// PUT запит з автоматичним додаванням токена
export async function apiPut(endpoint: string, data?: any): Promise<any> {
  const token = getToken();
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
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
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`PUT ${endpoint} помилка:`, error);
    throw error;
  }
}

// DELETE запит з автоматичним додаванням токена
export async function apiDelete(endpoint: string): Promise<any> {
  const token = getToken();
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
