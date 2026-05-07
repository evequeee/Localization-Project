import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CustomSelect } from '../components/CustomSelect';

// Тимчасові мови (потім можна теж тягнути з бази)
const languageOptions = [
  { value: 'Ukrainian', label: 'Ukrainian' },
  { value: 'English', label: 'English' },
  { value: 'Polish', label: 'Polish' }
];

const localizationStatusOptions = [
  { value: 'In Progress', label: 'В процесі' },
  { value: 'Testing', label: 'Тестування' },
  { value: 'Completed', label: 'Завершено' },
  { value: 'On Hold', label: 'Призупинено' }
];

export const AddLocalization = () => {
  const { gameId } = useParams<{ gameId: string }>(); 
  const navigate = useNavigate();
  
  const [teamOptions, setTeamOptions] = useState([{ value: '', label: 'Завантаження...' }]);
  
  const [formData, setFormData] = useState({
    gameId: gameId ? parseInt(gameId, 10) : 0,
    teamId: '',
    language: 'Ukrainian',
    status: 'In Progress'
  });


  useEffect(() => {
    axios.get('http://localhost:8080/api/teams')
      .then(res => {
        const options = res.data.map((team: any) => ({
          value: team.id.toString(),
          label: team.name
        }));
        setTeamOptions(options);
        
        // Якщо команди є, вибираємо першу за замовчуванням
        if (options.length > 0) {
          setFormData(prev => ({ ...prev, teamId: options[0].value }));
        }
      })
      .catch(err => {
        console.error("Бекенд мовчить, даю mock-команди", err);
        setTeamOptions([
          { value: '1', label: 'SBT Localization' },
          { value: '2', label: 'Sandigo' }
        ]);
        setFormData(prev => ({ ...prev, teamId: '1' }));
      });
  }, [gameId]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        gameId: formData.gameId,
        teamId: parseInt(formData.teamId, 10),
        language: formData.language,
        status: formData.status
      };
      
      console.log("Відправляємо прив'язку:", payload);
      
      const response = await axios.post('http://localhost:8080/api/localizations', payload);
      console.log("Відповідь сервера:", response.data);
      
      alert(`Переклад успішно прив'язано до гри #${formData.gameId}!`);
      navigate('/games');
    } catch (error: any) {
      console.error("Помилка при збереженні:", error);
      alert("Помилка при збереженні.");
    }
  };

  

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-wider">
        Новий <span className="text-p4yellow">Переклад</span>
      </h1>
      <p className="text-gray-400 mb-8 font-bold tracking-widest">ГРА ID: {gameId}</p>

      <form onSubmit={handleSubmit} className="bg-p4gray border-l-8 border-p4yellow p-8 shadow-2xl relative">
        <div className="flex flex-col gap-6">
          
          <div className="relative z-30">
            <CustomSelect 
              label="Мова перекладу"
              name="language"
              value={formData.language}
              options={languageOptions}
              onChange={handleSelectChange}
            />
          </div>

          <div className="relative z-20">
            <CustomSelect 
              label="Команда локалізаторів"
              name="teamId"
              value={formData.teamId}
              options={teamOptions}
              onChange={handleSelectChange}
            />
          </div>

          <div className="relative z-20">
            <CustomSelect 
              label="Статус цього перекладу"
              name="status"
              value={formData.status}
              options={localizationStatusOptions}
              onChange={handleSelectChange}
            />
          </div>

          <button 
            type="submit"
            className="mt-6 bg-p4yellow text-black border-4 border-black font-black uppercase tracking-widest text-lg py-3 hover:bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 relative z-10"
          >
            Зв'язати дані
          </button>
        </div>
      </form>
    </div>
  );
};