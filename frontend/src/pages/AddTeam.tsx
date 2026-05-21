import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../services/api';

export const AddTeam = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    contactEmail: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Базова валідація
    if (!formData.name.trim()) {
      setError('Назва команди є обов\'язковою!');
      setLoading(false);
      return;
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      setError('Будь ласка, введіть валідну email-адресу!');
      setLoading(false);
      return;
    }

    try {
      await apiPost('/api/teams', formData);

      setSuccess(`✅ Команду "${formData.name}" успішно зареєстровано! 🚀`);

      setFormData({
        name: '',
        contactEmail: ''
      });

      // Редірект через 1.5 секунди
      setTimeout(() => {
        navigate('/teams');
      }, 1500);
    } catch (err: any) {
      console.error('Помилка при додаванні команди:', err);
      setError(err.message || 'Помилка при реєстрації команди.');
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

        {/* Повідомлення про успіх */}
        {success && (
          <div className="mb-6 bg-green-900 border-2 border-green-600 text-white p-4 font-bold uppercase tracking-widest text-sm">
            {success}
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
              disabled={loading}
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Наприклад: Dragon Slayers Localization"
              className="bg-p4black text-white border-2 border-gray-600 p-3 font-bold outline-none transition-colors duration-200 focus:border-p4yellow focus:bg-p4yellow focus:text-black placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Email контакту */}
          <div className="flex flex-col">
            <label className="text-p4yellow font-bold uppercase tracking-widest text-sm mb-2">
              Email для зв'язку
            </label>
            <input
              type="email"
              name="contactEmail"
              disabled={loading}
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="contact@yourteam.com"
              className="bg-p4black text-white border-2 border-gray-600 p-3 font-bold outline-none transition-colors duration-200 focus:border-p4yellow focus:bg-p4yellow focus:text-black placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Кнопка */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-p4yellow text-p4black border-4 border-black font-black uppercase tracking-widest text-xl py-4 hover:bg-white hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            {loading ? 'Реєстрація...' : 'Створити команду'}
          </button>
        </div>

      </form>

      {/* Інформація */}
      <div className="mt-10 bg-p4gray border-l-4 border-p4yellow p-6">
        <p className="text-sm text-gray-300 font-bold leading-relaxed">
          <span className="text-p4yellow">ℹ️ Примітка:</span> Після реєстрації команди вона буде в статусі очікування верифікації від адміністратора. Ви зможете розпочати роботу та запрошувати інших перекладачів після схвалення.
        </p>
      </div>
    </div>
  );
};
