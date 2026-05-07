import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomSelect } from '../components/CustomSelect'; // Імпортуємо наш новий компонент

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

  // Стандартна функція для input та textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Нова функція для кастомних селектів (збирає ім'я та значення напряму)
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Тут потім буде axios.post
    console.log("Дані готові:", formData);
    alert(`Гру "${formData.title}" успішно зібрано!`);
    navigate('/games');
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-5xl font-black text-p4yellow mb-8 uppercase tracking-wider drop-shadow-md">
        Додати нову гру
      </h1>

      <form onSubmit={handleSubmit} className="bg-p4gray border-l-8 border-r-8 border-p4yellow p-8 shadow-2xl relative">
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-p4yellow transform rotate-45"></div>

        <div className="flex flex-col gap-6">
          
          {/* Назва гри (звичайний інпут, не міняємо) */}
          <div className="flex flex-col">
            <label className="text-p4yellow font-bold uppercase tracking-widest text-sm mb-2">Назва гри</label>
            <input 
              type="text" 
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Наприклад: Persona 3 Reload"
              className="bg-p4black text-white border-2 border-gray-600 p-3 font-bold outline-none transition-colors duration-200 focus:border-p4yellow focus:bg-p4yellow focus:text-black placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-30">
            {/* Оновлені кастомні селекти */}
            <CustomSelect 
              label="Оригінальна мова"
              name="originalLanguage"
              value={formData.originalLanguage}
              options={languageOptions}
              onChange={handleSelectChange} // Викликає нову функцію
            />

            <CustomSelect 
              label="Статус перекладу"
              name="translationStatus"
              value={formData.translationStatus}
              options={statusOptions}
              onChange={handleSelectChange} // Викликає нову функцію
            />
          </div>

          {/* Опис (звичайний textarea, не міняємо) */}
          <div className="flex flex-col relative z-10">
            <label className="text-p4yellow font-bold uppercase tracking-widest text-sm mb-2">Короткий опис</label>
            <textarea 
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Додайте опис гри..."
              className="bg-p4black text-white border-2 border-gray-600 p-3 font-bold outline-none transition-colors duration-200 focus:border-p4yellow focus:bg-p4yellow focus:text-black placeholder-gray-500 resize-none"
            />
          </div>

          <button 
            type="submit"
            className="mt-4 bg-p4yellow text-black border-4 border-black font-black uppercase tracking-widest text-xl py-4 hover:bg-white hover:scale-[1.02] transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 relative z-10"
          >
            Створити запис
          </button>
        </div>
      </form>
    </div>
  );
};