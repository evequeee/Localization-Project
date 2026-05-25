import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../services/api';
import type { Team } from '../types';

export const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/teams')
      .then(res => {
        setTeams(Array.isArray(res) ? res : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Помилка при завантаженні команд:", err);
        // Mock-дані щоб протестити дизайн
        setTeams([
          { id: 1, name: "SBT Localization", description: "Найбільша спілка перекладачів ігор українською.", contactEmail: "info@sbt.ua" },
          { id: 2, name: "Sandigo", description: "Команда, що спеціалізується на японських RPG.", contactEmail: "contact@sandigo.jp" }
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
        <Link 
          to="/add-team"
          className="bg-white text-black font-black py-2 px-6 border-b-4 border-r-4 border-p4yellow hover:bg-p4yellow transition-all active:translate-y-1 active:border-0 inline-block"
        >
          + ЗАРЕЄСТРУВАТИ КОМАНДУ
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="text-center text-gray-400 text-lg bg-p4gray border-2 border-gray-700 p-12">
          Команд немає. Будьте першими!
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {teams.map(team => (
            <Link
              key={team.id}
              to={`/team/${team.id}`}
              className="bg-p4gray p-6 border-2 border-transparent hover:border-p4yellow transition-all duration-300 relative group overflow-hidden hover:shadow-xl hover:-translate-y-1"
            >
              <div className="bg-p4black inline-block px-4 py-2 mb-4 transform -skew-x-12 group-hover:bg-p4yellow group-hover:text-black transition-colors duration-300">
                <h2 className="text-2xl font-black uppercase tracking-widest leading-none">
                  {team.name}
                </h2>
              </div>
              
              <p className="text-gray-300 mb-6 font-medium italic line-clamp-2">
                "{team.description || 'Немає опису'}"
              </p>

              {team.contactEmail && (
                <div className="text-xs text-gray-400 mb-4 font-bold">
                  📧 {team.contactEmail}
                </div>
              )}

              <div className="flex justify-between items-end">
                <span className="text-p4yellow text-xs font-bold uppercase tracking-tighter">Verified Team ✅</span>
                <span className="text-white text-xs font-black uppercase tracking-widest group-hover:text-p4yellow transition-colors">
                  Див. деталі →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};