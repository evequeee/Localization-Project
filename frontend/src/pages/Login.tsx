import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData.email, formData.password);
      navigate('/games');
    } catch (err: any) {
      setError(err.message || 'Помилка входу. Перевірте дані.');
    }
  };

  return (
    <div className="min-h-screen bg-p4black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Заголовок з P4G стилем */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black text-p4yellow uppercase tracking-tighter drop-shadow-md">
            Midnight
          </h1>
          <p className="text-p4yellow font-bold tracking-widest text-sm mt-2">
            TV ↔ TERMINAL
          </p>
          <div className="h-1 bg-p4yellow w-32 mx-auto mt-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
        </div>

        {/* Форма входу */}
        <form onSubmit={handleSubmit} className="bg-p4gray border-4 border-p4yellow p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
          
          {/* Декоративний елемент */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-p4yellow transform rotate-45"></div>

          {/* Повідомлення про помилку */}
          {error && (
            <div className="mb-6 bg-red-900 border-2 border-red-600 text-white p-3 font-bold uppercase tracking-widest text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="flex flex-col gap-6">
            
            {/* Email */}
            <div className="flex flex-col">
              <label className="text-p4yellow font-bold uppercase tracking-widest text-xs mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="bg-p4black text-white border-2 border-gray-600 p-3 font-bold outline-none transition-colors duration-200 focus:border-p4yellow focus:bg-p4yellow focus:text-black placeholder-gray-600 uppercase tracking-wider"
              />
            </div>

            {/* Пароль */}
            <div className="flex flex-col">
              <label className="text-p4yellow font-bold uppercase tracking-widest text-xs mb-2">
                Пароль
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="bg-p4black text-white border-2 border-gray-600 p-3 font-bold outline-none transition-colors duration-200 focus:border-p4yellow focus:bg-p4yellow focus:text-black placeholder-gray-600 tracking-wider"
              />
            </div>

            {/* Кнопка входу */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 bg-p4yellow text-p4black border-4 border-black font-black uppercase tracking-widest text-lg py-3 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              {loading ? 'Вхід...' : 'Увійти'}
            </button>
          </div>

          {/* Посилання на реєстрацію */}
          <div className="mt-8 pt-6 border-t-2 border-gray-600 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-3">
              Немаєте облікового запису?
            </p>
            <Link
              to="/register"
              className="inline-block bg-p4black text-p4yellow border-2 border-p4yellow font-black uppercase tracking-widest px-6 py-2 hover:bg-p4yellow hover:text-p4black transition-colors duration-200"
            >
              Реєстрація
            </Link>
          </div>

        </form>

        {/* Декоративний текст знизу */}
        <div className="mt-8 text-center text-gray-600 font-bold uppercase tracking-tighter text-xs">
          🎮 LocalizeDB v1.0
        </div>
      </div>
    </div>
  );
};
