import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../services/api';
import { CustomSelect } from '../components/CustomSelect';
import { useLanguage } from '../context/LanguageContext';

export const AddLocalization = () => {
  const { gameId } = useParams<{ gameId: string }>(); 
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const languageOptions = [
    { value: 'Ukrainian', label: language === 'uk' ? 'Українська' : 'Ukrainian' },
    { value: 'English', label: language === 'uk' ? 'Англійська' : 'English' },
    { value: 'Polish', label: language === 'uk' ? 'Польська' : 'Polish' },
    { value: 'Japanese', label: language === 'uk' ? 'Японська' : 'Japanese' },
    { value: 'Korean', label: language === 'uk' ? 'Корейська' : 'Korean' }
  ];

  const localizationStatusOptions = [
    { value: 'In Progress', label: language === 'uk' ? 'У процесі' : 'In Progress' },
    { value: 'Testing', label: language === 'uk' ? 'Тестування' : 'Testing' },
    { value: 'Completed', label: language === 'uk' ? 'Завершено' : 'Completed' },
    { value: 'On Hold', label: language === 'uk' ? 'Призупинено' : 'On Hold' }
  ];
  
  const [teamOptions, setTeamOptions] = useState([{ value: '', label: t('common.loading') }]);
  
  const [formData, setFormData] = useState({
    gameId: gameId ? parseInt(gameId, 10) : 0,
    teamId: '',
    language: 'English',
    status: 'In Progress'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/api/teams')
      .then(res => {
        const options = res.map((team: any) => ({
          value: team.id.toString(),
          label: team.name
        }));
        setTeamOptions(options);
        
        // Set first team as default
        if (options.length > 0) {
          setFormData(prev => ({ ...prev, teamId: options[0].value }));
        }
      })
      .catch(err => {
        console.error("Error loading teams, using mock data:", err);
        setTeamOptions([
          { value: '1', label: 'SBT Localization' },
          { value: '2', label: 'Sandigo' }
        ]);
        setFormData(prev => ({ ...prev, teamId: '1' }));
      });
  }, [gameId]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.teamId) {
      setError(t('add_localization.select_team'));
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const payload = {
        gameId: formData.gameId,
        teamId: formData.teamId ? parseInt(formData.teamId, 10) : undefined,
        language: formData.language,
        status: formData.status
      };
      
      console.log("Sending localization:", payload);
      
      const response = await apiPost('/api/localizations', payload);
      console.log("Server response:", response);
      
      alert(t('add_localization.success').replace('{gameId}', String(formData.gameId)));
      navigate('/games');
    } catch (error: any) {
      console.error("Save error:", error);
      setError(error.message || t('add_localization.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-p4-bg p-8 p4-scanline">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-black text-p4-white uppercase 
                        tracking-tighter p4-text-shadow mb-2">
            {t('add_localization.title')}
          </h1>
          <div className="flex items-center gap-3">
            <div className="bg-p4-yellow text-p4-bg px-4 py-2 font-black 
                          transform -skew-x-6 shadow-p4">
              {t('add_localization.button')}
            </div>
            <h2 className="text-4xl font-black text-p4-gray uppercase">{gameId ? `#${gameId}` : ''}</h2>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative">
          {/* Shadow layer */}
          <div className="absolute inset-0 bg-black transform -skew-x-2 translate-x-2 translate-y-2 -z-10"></div>

          {/* Main form box */}
          <div className="bg-p4-dark border-4 border-p4-white transform -skew-x-1 
                        p-8 shadow-p4-xl relative z-10">
            
            {/* Corner accent */}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-p4-yellow 
                          border-2 border-p4-yellow"></div>

            {/* Error */}
            {error && (
              <div className="mb-6 bg-red-900 border-4 border-red-600 text-white p-4 
                            font-black uppercase tracking-widest text-sm transform -skew-x-1">
                ⚠️ {error}
              </div>
            )}

            <div className="flex flex-col gap-8 relative z-30">
              
              {/* Translation Language */}
              <div className="relative z-40">
                <CustomSelect 
                  label={t('add_localization.language')}
                  name="language"
                  value={formData.language}
                  options={languageOptions}
                  onChange={handleSelectChange}
                />
              </div>

              {/* Team Selection */}
              <div className="relative z-30">
                <CustomSelect 
                  label={t('add_localization.team')}
                  name="teamId"
                  value={formData.teamId}
                  options={teamOptions}
                  onChange={handleSelectChange}
                />
              </div>

              {/* Status */}
              <div className="relative z-20">
                <CustomSelect 
                  label={t('add_localization.status')}
                  name="status"
                  value={formData.status}
                  options={localizationStatusOptions}
                  onChange={handleSelectChange}
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="p4-button-yellow text-lg hover:shadow-p4-xl mt-4
                          disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
              >
                {loading ? t('add_localization.saving') : t('add_localization.button')}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Background decoration */}
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-p4-yellow opacity-5 
                     transform skew-x-12 -z-10 pointer-events-none"></div>
    </div>
  );
};