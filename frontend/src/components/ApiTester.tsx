import { useState } from 'react';
import { apiGet, apiPost } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'forbidden' | 'unauthorized';
  message: string;
  statusCode?: number;
  data?: any;
}

export const ApiTester = () => {
  const { user, token, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (name: string, status: TestResult['status'], message: string, statusCode?: number, data?: any) => {
    setResults(prev => [...prev, { name, status, message, statusCode, data }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  // Test 1: Public request - GET /api/games
  const testPublicRequest = async () => {
    setLoading(true);
    try {
      const data = await apiGet('/api/games');
      addResult('GET /api/games (Public)', 'success', t('api_tester.public_success').replace('{count}', String(data.length)), 200, data);
    } catch (error: any) {
      addResult('GET /api/games (Public)', 'error', `${t('common.error')}: ${error.message}`, undefined, error);
    } finally {
      setLoading(false);
    }
  };

  // Test 2: Protected request - POST /api/teams
  const testProtectedRequest = async () => {
    setLoading(true);
    if (!isAuthenticated) {
      addResult('POST /api/teams (Protected)', 'unauthorized', t('api_tester.not_authenticated'), 401);
      setLoading(false);
      return;
    }

    try {
      const testData = {
        name: `Test Team ${new Date().toLocaleTimeString()}`,
        description: 'Automated test team',
        contactEmail: 'test@example.com'
      };
      const data = await apiPost('/api/teams', testData);
      addResult('POST /api/teams (Protected)', 'success', t('api_tester.team_created'), 200, data);
    } catch (error: any) {
      if (error.message.includes('401')) {
        addResult('POST /api/teams (Protected)', 'unauthorized', t('api_tester.token_expired'), 401, error);
      } else {
        addResult('POST /api/teams (Protected)', 'error', `${t('common.error')}: ${error.message}`, undefined, error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Test 3: Admin-only request - POST /api/games
  const testAdminRequest = async () => {
    setLoading(true);
    if (!isAuthenticated) {
      addResult('POST /api/games (Admin Only)', 'unauthorized', t('api_tester.not_authenticated'), 401);
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
      addResult('POST /api/games (Admin Only)', 'success', t('api_tester.game_created'), 200, data);
    } catch (error: any) {
      if (error.message.includes('401')) {
        addResult('POST /api/games (Admin Only)', 'unauthorized', t('api_tester.token_expired'), 401, error);
      } else if (error.message.includes('403')) {
        addResult('POST /api/games (Admin Only)', 'forbidden', t('api_tester.access_denied').replace('{role}', user?.role || 'unknown'), 403, error);
      } else {
        addResult('POST /api/games (Admin Only)', 'error', `${t('common.error')}: ${error.message}`, undefined, error);
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
    <div className="mt-12 p-8 bg-p4-dark border-4 border-p4-yellow rounded-lg">
      <h2 className="text-3xl font-black text-p4-yellow mb-6 uppercase tracking-wider">🧪 {t('nav.api_tester')}</h2>

      {/* User status */}
      <div className="mb-6 p-4 bg-p4-bg border-4 border-p4-yellow text-white">
        <p className="font-black text-sm mb-3 uppercase tracking-widest">📊 {t('api_tester.status')}</p>
        {isAuthenticated && user ? (
          <div className="space-y-2 text-sm font-bold">
            <p>✅ {t('api_tester.authenticated_as')}: <span className="text-p4-yellow">{user.email}</span></p>
            <p>{t('api_tester.role')}: <span className="text-p4-yellow">{user.role}</span></p>
            <p>{t('api_tester.token')}: <span className="text-p4-yellow">{token?.substring(0, 20)}...</span></p>
          </div>
        ) : (
          <p className="text-red-400 font-bold">❌ {t('api_tester.not_authenticated_short')}</p>
        )}
      </div>

      {/* Test buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={testPublicRequest}
          disabled={loading}
          className="bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-black py-3 px-4 border-2 border-green-900 uppercase tracking-widest transition-colors"
        >
          🔓 {t('api_tester.test_public')}
        </button>

        <button
          onClick={testProtectedRequest}
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-black py-3 px-4 border-2 border-blue-900 uppercase tracking-widest transition-colors"
        >
          🔒 {t('api_tester.test_protected')}
        </button>

        <button
          onClick={testAdminRequest}
          disabled={loading}
          className="bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-black py-3 px-4 border-2 border-purple-900 uppercase tracking-widest transition-colors"
        >
          👑 {t('api_tester.test_admin')}
        </button>

        <button
          onClick={clearResults}
          disabled={loading || results.length === 0}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-black py-3 px-4 border-2 border-gray-900 uppercase tracking-widest transition-colors"
        >
          🗑️ {t('api_tester.clear_results')}
        </button>
      </div>

      {loading && <p className="text-p4-yellow font-black text-center mb-4 animate-pulse uppercase tracking-widest">{t('common.loading')}</p>}

      {/* Results */}
      <div className="space-y-4">
        {results.map((result, idx) => (
          <div key={idx} className={`p-4 border-2 rounded ${getStatusColor(result.status)}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-black text-lg">{result.name}</h3>
              {result.statusCode && (
                <span className="bg-p4-bg text-p4-yellow px-3 py-1 font-black rounded text-sm">
                  {result.statusCode}
                </span>
              )}
            </div>

            <p className="text-white mb-2">{result.message}</p>

            {result.data && result.status === 'success' && (
              <details className="text-white text-xs">
                <summary className="cursor-pointer font-black text-p4-yellow hover:underline uppercase tracking-widest">{t('api_tester.show_data')}</summary>
                <pre className="mt-2 p-2 bg-p4-bg rounded overflow-auto max-h-48 text-gray-300">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <p className="text-center text-p4-gray italic font-bold">{t('api_tester.results_placeholder')}</p>
      )}
    </div>
  );
};
