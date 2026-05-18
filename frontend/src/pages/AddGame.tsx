import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomSelect } from '../components/CustomSelect';
import { apiPost } from '../services/api';

// Опції для мов
const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Ukrainian', label: 'Ukrainian (SBT)' },
  { value: 'Other', label: 'Інша' }
];

// Опції для статусів
const statusOptions = [
  { value: 'Not Started', label: 'Не розпочато' },
  { value: 'In Progress', label: 'В процесі' },
  { value: 'Testing', label: 'Тестування' },
  { value: 'Completed', label: 'Завершено' }
];

export const AddGame = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    originalLanguage: 'English',
    translationStatus: 'In Progress',
    description: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiPost('/api/games', formData);
      
      setSuccess(`✅ Гру "${formData.title}" успішно додано до Midnight Channel! 📺`);
      
      // Очистка форми
      setFormData({
        title: '',
        originalLanguage: 'English',
        translationStatus: 'In Progress',
        description: ''
      });
      
      // Редірект через 1.5 секунди, щоб користувач бачив success повідомлення
      setTimeout(() => {
        navigate('/games');
      }, 1500);
    } catch (err: any) {
      console.error("Помилка при додаванні гри:", err);
      setError(err.message || 'Помилка при додаванні гри. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-5xl font-black text-p4yellow mb-8 uppercase tracking-wider drop-shadow-md">
        Додати нову гру
      </h1>

      <form onSubmit={handleSubmit} className="bg-p4gray border-l-8 border-r-8 border-p4yellow p-8 shadow-2xl relative">
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
          
          {/* Назва гри */}
          <div className="flex flex-col">
            <label className="text-p4yellow font-bold uppercase tracking-widest text-sm mb-2">Назва гри</label>
            <input 
              type="text" 
              name="title"
              required
              disabled={loading}
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Наприклад: Persona 3 Reload"
              className="bg-p4black text-white border-2 border-gray-600 p-3 font-bold outline-none transition-colors duration-200 focus:border-p4yellow focus:bg-p4yellow focus:text-black placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-30">
            {/* Оригінальна мова */}
            <CustomSelect 
              label="Оригінальна мова"
              name="originalLanguage"
              value={formData.originalLanguage}
              options={languageOptions}
              onChange={handleSelectChange}
            />

            {/* Статус перекладу */}
            <CustomSelect 
              label="Статус перекладу"
              name="translationStatus"
              value={formData.translationStatus}
              options={statusOptions}
              onChange={handleSelectChange}
            />
          </div>

          {/* Опис */}
          <div className="flex flex-col relative z-10">
            <label className="text-p4yellow font-bold uppercase tracking-widest text-sm mb-2">Короткий опис</label>
            <textarea 
              name="description"
              required
              disabled={loading}
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Додайте опис гри..."
              className="bg-p4black text-white border-2 border-gray-600 p-3 font-bold outline-none transition-colors duration-200 focus:border-p4yellow focus:bg-p4yellow focus:text-black placeholder-gray-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Кнопка */}
          <button 
            type="submit"
            disabled={loading}
            className="mt-4 bg-p4yellow text-black border-4 border-black font-black uppercase tracking-widest text-xl py-4 hover:bg-white hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 relative z-10"
          >
            {loading ? 'Створення гри...' : 'Створити запис'}
          </button>
        </div>
      </form>
    </div>
  );
};