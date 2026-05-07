import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export const AddTeam = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // POST запит до /api/teams з Authorization заголовком
      const response = await axios.post(
        'http://localhost:8080/api/teams',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert(`Команда "${formData.name}" успішно зареєстрована! 🎬`);
        navigate('/teams');
      }
    } catch (err: any) {
      console.error('Помилка при додаванні команди:', err);
      setError(err.response?.data?.message || 'Помилка при реєстрації команди.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-5xl font-black text-p4yellow mb-2 uppercase tracking-wider drop-shadow-md">
        Зареєструвати команду
      </h1>
      <p className="text-gray-400 mb-8 font-bold tracking-widest text-sm">
        ПРИЄДНАЙТЕСЬ ДО LOCALIZE COMMUNITY
      </p>

      <form onSubmit={handleSubmit} className="bg-p4gray border-l-8 border-p4yellow p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
        
        {/* Декоративний елемент */}
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-p4yellow transform rotate-45"></div>

        {/* Повідомлення про помилку */}
        {error && (
          <div className="mb-6 bg-red-900 border-2 border-red-600 text-white p-4 font-bold uppercase tracking-widest text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="flex flex-col gap-6">

          {/* Назва команди */}
          <div className="flex flex-col">
            <label className="text-p4yellow font-bold uppercase tracking-widest text-sm mb-2">
              Назва команди
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Наприклад: Dragon Slayers Localization"
              className="bg-p4black text-white border-2 border-gray-600 p-3 font-bold outline-none transition-colors duration-200 focus:border-p4yellow focus:bg-p4yellow focus:text-black placeholder-gray-500"
            />
          </div>

          {/* Опис */}
          <div className="flex flex-col">
            <label className="text-p4yellow font-bold uppercase tracking-widest text-sm mb-2">
              Опис команди
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              placeholder="Розповідайте про вашу команду: спеціалізація, досвід, мови локалізації..."
              className="bg-p4black text-white border-2 border-gray-600 p-3 font-bold outline-none transition-colors duration-200 focus:border-p4yellow focus:bg-p4yellow focus:text-black placeholder-gray-500 resize-none"
            />
          </div>

          {/* Вебсайт */}
          <div className="flex flex-col">
            <label className="text-p4yellow font-bold uppercase tracking-widest text-sm mb-2">
              Вебсайт (опціонально)
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://yourteam.com"
              className="bg-p4black text-white border-2 border-gray-600 p-3 font-bold outline-none transition-colors duration-200 focus:border-p4yellow focus:bg-p4yellow focus:text-black placeholder-gray-500"
            />
          </div>

          {/* Кнопка */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-p4yellow text-p4black border-4 border-black font-black uppercase tracking-widest text-xl py-4 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            {loading ? 'Реєстрація...' : 'Створити команду'}
          </button>
        </div>

      </form>

      {/* Інформація */}
      <div className="mt-10 bg-p4gray border-l-4 border-p4yellow p-6">
        <p className="text-sm text-gray-300 font-bold leading-relaxed">
          <span className="text-p4yellow">ℹ️ Примітка:</span> Після реєстрації команди ви можете запрошувати інших перекладачів та розпочати роботу над локалізацією ігор. Адміністратор додасть вас до списку верифікованих команд.
        </p>
      </div>
    </div>
  );
};
