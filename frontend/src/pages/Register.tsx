import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email потрібен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Невірний формат email';
    }

    if (!formData.password) {
      errors.password = 'Пароль потрібен';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль має бути щонайменше 6 символів';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Паролі не збігаються';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData.email, formData.password);
      navigate('/games');
    } catch (err: any) {
      setError(err.message || 'Помилка реєстрації. Спробуйте пізніше.');
    }
  };

  return (
    <div className="min-h-screen bg-p4black flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Заголовок */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black text-p4yellow uppercase tracking-tighter drop-shadow-md">
            Реєстрація
          </h1>
          <p className="text-p4yellow font-bold tracking-widest text-sm mt-2">
            ПРИЄДНАЙТЕСЬ ДО MIDNIGHT CHANNEL
          </p>
          <div className="h-1 bg-p4yellow w-32 mx-auto mt-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
        </div>

        {/* Форма реєстрації */}
        <form onSubmit={handleSubmit} className="bg-p4gray border-4 border-p4yellow p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">

          <div className="absolute -top-2 -right-2 w-8 h-8 bg-p4yellow transform rotate-45"></div>

          {/* Повідомлення про помилку */}
          {error && (
            <div className="mb-6 bg-red-900 border-2 border-red-600 text-white p-3 font-bold uppercase tracking-widest text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-p4yellow font-bold uppercase tracking-widest text-xs mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={`bg-p4black text-white border-2 p-2 font-bold outline-none transition-colors duration-200 uppercase tracking-wider placeholder-gray-600 ${
                  validationErrors.email ? 'border-red-600 focus:border-red-600' : 'border-gray-600 focus:border-p4yellow focus:bg-p4yellow focus:text-black'
                }`}
              />
              {validationErrors.email && (
                <span className="text-red-400 text-xs font-bold mt-1">{validationErrors.email}</span>
              )}
            </div>

            {/* Пароль */}
            <div className="flex flex-col">
              <label className="text-p4yellow font-bold uppercase tracking-widest text-xs mb-1">
                Пароль
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`bg-p4black text-white border-2 p-2 font-bold outline-none transition-colors duration-200 tracking-wider placeholder-gray-600 ${
                  validationErrors.password ? 'border-red-600 focus:border-red-600' : 'border-gray-600 focus:border-p4yellow focus:bg-p4yellow focus:text-black'
                }`}
              />
              {validationErrors.password && (
                <span className="text-red-400 text-xs font-bold mt-1">{validationErrors.password}</span>
              )}
            </div>

            {/* Підтвердження пароля */}
            <div className="flex flex-col">
              <label className="text-p4yellow font-bold uppercase tracking-widest text-xs mb-1">
                Підтвердити пароль
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`bg-p4black text-white border-2 p-2 font-bold outline-none transition-colors duration-200 tracking-wider placeholder-gray-600 ${
                  validationErrors.confirmPassword ? 'border-red-600 focus:border-red-600' : 'border-gray-600 focus:border-p4yellow focus:bg-p4yellow focus:text-black'
                }`}
              />
              {validationErrors.confirmPassword && (
                <span className="text-red-400 text-xs font-bold mt-1">{validationErrors.confirmPassword}</span>
              )}
            </div>

            {/* Кнопка реєстрації */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-p4yellow text-p4black border-4 border-black font-black uppercase tracking-widest text-lg py-3 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              {loading ? 'Реєстрація...' : 'Зареєструватися'}
            </button>
          </div>

          {/* Посилання на вхід */}
          <div className="mt-6 pt-4 border-t-2 border-gray-600 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-3">
              Вже маєте облік?
            </p>
            <Link
              to="/login"
              className="inline-block bg-p4black text-p4yellow border-2 border-p4yellow font-black uppercase tracking-widest px-6 py-2 hover:bg-p4yellow hover:text-p4black transition-colors duration-200"
            >
              Вхід
            </Link>
          </div>

        </form>

        <div className="mt-8 text-center text-gray-600 font-bold uppercase tracking-tighter text-xs">
          🎮 LocalizeDB v1.0
        </div>
      </div>
    </div>
  );
};
