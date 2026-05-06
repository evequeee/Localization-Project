import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Game } from '../types';
import { GameCard } from '../components/GameCard';

export const GamesList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/games')
      .then(res => { setGames(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div className="p-8 text-p4yellow text-2xl font-bold animate-pulse">Завантаження бази... 📺</div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black text-p4yellow mb-8 uppercase tracking-wider drop-shadow-md">Каталог ігор</h1>
      
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
        {games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};