import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomSelect } from '../components/CustomSelect';
import { apiPost } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const AddGame = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const languageOptions = language === 'uk'
    ? [
      { value: 'ENG', label: 'Англійська' },
      { value: 'JPN', label: 'Японська' },
      { value: 'KR', label: 'Корейська' },
      { value: 'UA', label: 'Українська' },
      { value: 'OTH', label: 'Інша' }
    ]
    : [
      { value: 'ENG', label: 'English' },
      { value: 'JPN', label: 'Japanese' },
      { value: 'KR', label: 'Korean' },
      { value: 'UA', label: 'Ukrainian' },
      { value: 'OTH', label: 'Other' }
    ];

  const statusOptions = language === 'uk'
    ? [
      { value: 'Not Started', label: 'Не розпочато' },
      { value: 'In Progress', label: 'У процесі' },
      { value: 'Testing', label: 'Тестування' },
      { value: 'Completed', label: 'Завершено' }
    ]
    : [
      { value: 'Not Started', label: 'Not Started' },
      { value: 'In Progress', label: 'In Progress' },
      { value: 'Testing', label: 'Testing' },
      { value: 'Completed', label: 'Completed' }
    ];
  const [formData, setFormData] = useState({
    title: '',
    originalLanguage: 'English',
    translationStatus: 'In Progress',
    description: '',
    imageUrl: ''
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

    // Basic validation
    if (!formData.title.trim()) {
      setError(t('add_game.title_required'));
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError(t('add_game.description_required'));
      setLoading(false);
      return;
    }

    try {
      // Convert empty imageUrl to null for backend
      const payload = {
        ...formData,
        imageUrl: formData.imageUrl.trim() ? formData.imageUrl : null
      };
      
      await apiPost('/api/games', payload);
      
      setSuccess(t('add_game.success').replace('{title}', formData.title));
      
      // Clear form
      setFormData({
        title: '',
        originalLanguage: 'English',
        translationStatus: 'In Progress',
        description: '',
        imageUrl: ''
      });
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/games');
      }, 1500);
    } catch (err: any) {
      console.error("Error adding game:", err);
      setError(err.message || t('add_game.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-p4-bg p-8 p4-scanline">
      <div className="max-w-3xl mx-auto">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-black text-p4-white uppercase 
                        tracking-tighter p4-text-shadow mb-2">
            {t('add_game.title')}
          </h1>
          <div className="flex items-center gap-3">
            <div className="bg-p4-yellow text-p4-bg px-4 py-2 font-black 
                          transform -skew-x-6 shadow-p4">
              {t('add_game.title_game')}
            </div>
            <h2 className="text-4xl font-black text-p4-gray uppercase">{t('add_game.title_game')}</h2>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="relative">
          {/* Shadow background */}
          <div className="absolute inset-0 bg-black transform -skew-x-2 translate-x-2 translate-y-2 -z-10"></div>

          {/* Main form box */}
          <div className="bg-p4-dark border-4 border-p4-white transform -skew-x-1 
                        p-8 shadow-p4-xl relative z-10">
            
            {/* Decorative corner */}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-p4-yellow 
                          border-2 border-p4-yellow"></div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-900 border-4 border-red-600 text-white p-4 
                            font-black uppercase tracking-widest text-sm transform -skew-x-1">
                ⚠️ {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-900 border-4 border-green-600 text-white p-4 
                            font-black uppercase tracking-widest text-sm transform -skew-x-1">
                {success}
              </div>
            )}

            <div className="flex flex-col gap-8">
              
              {/* Title Field */}
              <div className="flex flex-col">
                <label className="text-p4-yellow font-black uppercase tracking-widest 
                               text-sm mb-3">{t('add_game.input_title')}</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  disabled={loading}
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t('add_game.input_title')}
                  className="p4-input"
                />
              </div>

              {/* Language & Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-30">
                {/* Original Language */}
                <CustomSelect 
                  label={t('add_game.input_language')}
                  name="originalLanguage"
                  value={formData.originalLanguage}
                  options={languageOptions}
                  onChange={handleSelectChange}
                />

                {/* Translation Status */}
                <CustomSelect 
                  label={t('add_game.input_status')}
                  name="translationStatus"
                  value={formData.translationStatus}
                  options={statusOptions}
                  onChange={handleSelectChange}
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col relative z-10">
                <label className="text-p4-yellow font-black uppercase tracking-widest 
                               text-sm mb-3">{t('add_game.input_description')}</label>
                <textarea 
                  name="description"
                  required
                  disabled={loading}
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder={t('add_game.input_description')}
                  className="p4-input resize-none"
                />
              </div>

              {/* Image URL Field */}
              <div className="flex flex-col">
                <label className="text-p4-yellow font-black uppercase tracking-widest 
                               text-sm mb-3">{t('add_game.cover_url')}</label>
                <input 
                  type="text" 
                  name="imageUrl"
                  disabled={loading}
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/game-cover.jpg"
                  className="p4-input"
                />
                <div className="text-xs text-gray-400 mt-2">
                  {t('add_game.cover_hint')}
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="p4-button-yellow text-lg hover:shadow-p4-xl
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('add_game.creating') : t('add_game.button')}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Background decoration */}
      <div className="fixed top-20 left-0 w-96 h-96 bg-p4-yellow opacity-5 
                     transform -skew-x-12 -z-10 pointer-events-none"></div>
    </div>
  );
};