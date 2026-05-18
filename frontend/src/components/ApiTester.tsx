import { useState } from 'react';
import { apiGet, apiPost } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'forbidden' | 'unauthorized';
  message: string;
  statusCode?: number;
  data?: any;
}

export const ApiTester = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (name: string, status: TestResult['status'], message: string, statusCode?: number, data?: any) => {
    setResults(prev => [...prev, { name, status, message, statusCode, data }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  // Тест 1: Публічний запит - GET /api/games
  const testPublicRequest = async () => {
    setLoading(true);
    try {
      const data = await apiGet('/api/games');
      addResult('GET /api/games (публічний)', 'success', `✅ Успіх! Отримано ${data.length} ігор`, 200, data);
    } catch (error: any) {
      addResult('GET /api/games (публічний)', 'error', `❌ Помилка: ${error.message}`, undefined, error);
    } finally {
      setLoading(false);
    }
  };

  // Тест 2: Захищений запит - POST /api/teams
  const testProtectedRequest = async () => {
    setLoading(true);
    if (!isAuthenticated) {
      addResult('POST /api/teams (захищений)', 'unauthorized', '❌ Ви не авторизовані! Потрібно залогінитися.', 401);
      setLoading(false);
      return;
    }

    try {
      const testData = {
        name: `Test Team ${new Date().toLocaleTimeString()}`,
        contactEmail: 'test@example.com'
      };
      const data = await apiPost('/api/teams', testData);
      addResult('POST /api/teams (захищений)', 'success', `✅ Успіх! Команда створена:`, 200, data);
    } catch (error: any) {
      if (error.message.includes('401')) {
        addResult('POST /api/teams (захищений)', 'unauthorized', '❌ Токен протермінований (401)', 401, error);
      } else {
        addResult('POST /api/teams (захищений)', 'error', `❌ Помилка: ${error.message}`, undefined, error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Тест 3: Захищений запит для Admin - POST /api/games
  const testAdminRequest = async () => {
    setLoading(true);
    if (!isAuthenticated) {
      addResult('POST /api/games (тільки Admin)', 'unauthorized', '❌ Ви не авторизовані! Потрібно залогінитися.', 401);
      setLoading(false);
      return;
    }

    try {
      const testData = {
        title: `Test Game ${new Date().toLocaleTimeString()}`,
        description: 'This is a test game for API tester',
        originalLanguage: 'English',
        translationStatus: 'Not Started'
      };
      const data = await apiPost('/api/games', testData);
      addResult('POST /api/games (тільки Admin)', 'success', `✅ Успіх! Гра створена (Ви маєте права Admin):`, 200, data);
    } catch (error: any) {
      if (error.message.includes('401')) {
        addResult('POST /api/games (тільки Admin)', 'unauthorized', '❌ Токен протермінований (401)', 401, error);
      } else if (error.message.includes('403')) {
        addResult('POST /api/games (тільки Admin)', 'forbidden', `❌ Доступ заборонено (403)! Ваша роль: ${user?.role || 'unknown'}. Потрібна роль: Admin`, 403, error);
      } else {
        addResult('POST /api/games (тільки Admin)', 'error', `❌ Помилка: ${error.message}`, undefined, error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: TestResult['status']): string => {
    switch (status) {
      case 'success':
        return 'bg-green-900 border-green-600';
      case 'error':
        return 'bg-red-900 border-red-600';
      case 'forbidden':
        return 'bg-yellow-900 border-yellow-600';
      case 'unauthorized':
        return 'bg-orange-900 border-orange-600';
      default:
        return 'bg-gray-900 border-gray-600';
    }
  };

  return (
    <div className="mt-12 p-8 bg-p4gray border-4 border-p4yellow rounded-lg">
      <h2 className="text-3xl font-black text-p4yellow mb-6 uppercase tracking-wider">🧪 API Tester</h2>

      {/* Інформація про користувача */}
      <div className="mb-6 p-4 bg-p4black border-2 border-p4yellow text-white">
        <p className="font-bold text-sm mb-2">📊 Статус:</p>
        {isAuthenticated && user ? (
          <div className="space-y-1 text-sm">
            <p>✅ Авторизовані як: <span className="text-p4yellow font-bold">{user.email}</span></p>
            <p>Роль: <span className="text-p4yellow font-bold">{user.role}</span></p>
            <p>Токен: <span className="text-p4yellow font-bold">{token?.substring(0, 20)}...</span></p>
          </div>
        ) : (
          <p className="text-red-400 font-bold">❌ Не авторизовані. Залогіньтесь для повного тестування.</p>
        )}
      </div>

      {/* Кнопки тестування */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={testPublicRequest}
          disabled={loading}
          className="bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-black py-3 px-4 border-2 border-green-900 uppercase tracking-widest transition-colors"
        >
          🔓 Тест: GET /api/games
        </button>

        <button
          onClick={testProtectedRequest}
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-black py-3 px-4 border-2 border-blue-900 uppercase tracking-widest transition-colors"
        >
          🔒 Тест: POST /api/teams
        </button>

        <button
          onClick={testAdminRequest}
          disabled={loading}
          className="bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-black py-3 px-4 border-2 border-purple-900 uppercase tracking-widest transition-colors"
        >
          👑 Тест: POST /api/games (Admin)
        </button>

        <button
          onClick={clearResults}
          disabled={loading || results.length === 0}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-black py-3 px-4 border-2 border-gray-900 uppercase tracking-widest transition-colors"
        >
          🗑️ Очистити результати
        </button>
      </div>

      {loading && <p className="text-p4yellow font-bold text-center mb-4 animate-pulse">Завантаження...</p>}

      {/* Результати */}
      <div className="space-y-4">
        {results.map((result, idx) => (
          <div key={idx} className={`p-4 border-2 rounded ${getStatusColor(result.status)}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-bold text-lg">{result.name}</h3>
              {result.statusCode && (
                <span className="bg-p4black text-p4yellow px-3 py-1 font-bold rounded text-sm">
                  {result.statusCode}
                </span>
              )}
            </div>

            <p className="text-white mb-2">{result.message}</p>

            {result.data && result.status === 'success' && (
              <details className="text-white text-xs">
                <summary className="cursor-pointer font-bold text-p4yellow hover:underline">Показати дані</summary>
                <pre className="mt-2 p-2 bg-p4black rounded overflow-auto max-h-48 text-gray-300">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <p className="text-center text-gray-400 italic">Результати будуть з'являтися тут...</p>
      )}
    </div>
  );
};
