import { useState, useEffect } from 'react';
import { apiGet } from '../services/api';
import type { Game } from '../types';
import { GameCard } from '../components/GameCard';

export const GamesList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/games')
      .then(res => { setGames(res); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const handleGameDelete = (gameId: number) => {
    // Видаляємо гру з локального стану
    setGames(games.filter(game => game.id !== gameId));
  };

  if (loading) return <div className="p-8 text-p4yellow text-2xl font-bold animate-pulse">Завантаження бази... 📺</div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black text-p4yellow mb-8 uppercase tracking-wider drop-shadow-md">Каталог ігор</h1>
      
      {games.length === 0 ? (
        <div className="text-center text-gray-400 text-lg">
          Ігр немає. Першу гру повинен додати адміністратор.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
          {games.map(game => (
            <GameCard key={game.id} game={game} onDelete={handleGameDelete} />
          ))}
        </div>
      )}
    </div>
  );
};