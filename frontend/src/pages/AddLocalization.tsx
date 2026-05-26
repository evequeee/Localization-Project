import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../services/api';
import { CustomSelect } from '../components/CustomSelect';

// Language options
const languageOptions = [
  { value: 'Ukrainian', label: 'Ukrainian' },
  { value: 'English', label: 'English' },
  { value: 'Polish', label: 'Polish' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' }
];

const localizationStatusOptions = [
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Testing', label: 'Testing' },
  { value: 'Completed', label: 'Completed' },
  { value: 'On Hold', label: 'On Hold' }
];

export const AddLocalization = () => {
  const { gameId } = useParams<{ gameId: string }>(); 
  const navigate = useNavigate();
  
  const [teamOptions, setTeamOptions] = useState([{ value: '', label: 'Loading...' }]);
  
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
      setError('Please select a team');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const payload = {
        gameId: formData.gameId,
        teamId: parseInt(formData.teamId, 10),
        language: formData.language,
        status: formData.status
      };
      
      console.log("Sending localization:", payload);
      
      const response = await apiPost('/api/localizations', payload);
      console.log("Server response:", response);
      
      alert(`Translation successfully linked to game #${formData.gameId}!`);
      navigate('/games');
    } catch (error: any) {
      console.error("Save error:", error);
      setError(error.message || 'Failed to save translation.');
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
            Add New
          </h1>
          <div className="flex items-center gap-3">
            <div className="bg-p4-yellow text-p4-bg px-4 py-2 font-black 
                          transform -skew-x-6 shadow-p4">
              TRANSLATION
            </div>
            <h2 className="text-4xl font-black text-p4-gray uppercase">for Game #{gameId}</h2>
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
                  label="🌐 Translation Language"
                  name="language"
                  value={formData.language}
                  options={languageOptions}
                  onChange={handleSelectChange}
                />
              </div>

              {/* Team Selection */}
              <div className="relative z-30">
                <CustomSelect 
                  label="👥 Localization Team"
                  name="teamId"
                  value={formData.teamId}
                  options={teamOptions}
                  onChange={handleSelectChange}
                />
              </div>

              {/* Status */}
              <div className="relative z-20">
                <CustomSelect 
                  label="📊 Translation Status"
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
                {loading ? '⏳ Saving...' : '✨ Link Translation'}
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