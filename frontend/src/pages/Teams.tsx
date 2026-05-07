import { useState, useEffect } from 'react';
import axios from 'axios';

// Тимчасовий інтерфейс (потім винести в types.ts)
interface Team {
  id: number;
  name: string;
  description: string;
  website?: string;
}

export const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/teams')
      .then(res => {
        setTeams(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Помилка при завантаженні команд:", err);
        // Mock-дані щоб протестити дизайн
        setTeams([
          { id: 1, name: "SBT Localization", description: "Найбільша спілка перекладачів ігор українською." },
          { id: 2, name: "Sandigo", description: "Команда, що спеціалізується на японських RPG." }
        ]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-p4yellow text-2xl font-bold animate-pulse">Шукаємо сигнал... 📺</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-black text-p4yellow uppercase tracking-tighter drop-shadow-md">
          Localization Teams
        </h1>
        <button className="bg-white text-black font-black py-2 px-6 border-b-4 border-r-4 border-p4yellow hover:bg-p4yellow transition-all active:translate-y-1 active:border-0">
          + ЗАРЕЄСТРУВАТИ КОМАНДУ
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {teams.map(team => (
          <div key={team.id} className="bg-p4gray p-6 border-2 border-transparent hover:border-p4yellow transition-all duration-300 relative group overflow-hidden">
            <div className="bg-p4black inline-block px-4 py-2 mb-4 transform -skew-x-12 group-hover:bg-p4yellow group-hover:text-black transition-colors duration-300">
              <h2 className="text-2xl font-black uppercase tracking-widest leading-none">
                {team.name}
              </h2>
            </div>
            
            <p className="text-gray-300 mb-6 font-medium italic">
              "{team.description}"
            </p>

            <div className="flex justify-between items-end">
              <span className="text-p4yellow text-xs font-bold uppercase tracking-tighter">Verified Team ✅</span>
              <button className="text-black bg-white px-3 py-1 text-xs font-black uppercase hover:bg-p4yellow transition-colors">
                Профіль
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};