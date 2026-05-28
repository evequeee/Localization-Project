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
    setGames(games.filter(game => game.id !== gameId));
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl font-black text-p4-yellow mb-4 animate-pulse">
            📺
          </div>
          <div className="text-2xl font-black text-p4-white uppercase tracking-wider">
            Loading Game Catalog
          </div>
          <div className="text-sm text-p4-gray mt-2">
            from the Midnight Channel...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-p4-bg p4-scanline">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-end gap-4 mb-8">
          <h1 className="text-6xl md:text-7xl font-black text-p4-white uppercase 
                        tracking-tighter p4-text-shadow">
            Game Catalog
          </h1>
          <div className="bg-p4-yellow text-p4-bg px-3 py-2 font-black 
                        transform -skew-x-6 shadow-p4">
            #{games.length}
          </div>
        </div>
        
        <p className="text-lg text-p4-gray font-light mb-8">
          {games.length === 0 
            ? '📭 No games yet. Admin must add the first game.' 
            : `📺 ${games.length} ${games.length === 1 ? 'game' : 'games'} ready for translation`}
        </p>

        {/* Games Grid */}
        {games.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-8xl font-black text-p4-gray opacity-20 mb-4">
                🎮
              </div>
              <p className="text-2xl font-black text-p4-gray uppercase tracking-wider">
                Catalog Empty
              </p>
              <p className="text-sm text-p4-gray mt-2 max-w-md">
                Come back later when the admin adds the first game!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
            {games.map((game, index) => (
              <div key={game.id} className="animate-in" style={{ 
                animationDelay: `${index * 50}ms` 
              }}>
                <GameCard game={game} onDelete={handleGameDelete} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Background decorations */}
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-p4-yellow opacity-5 
                     transform skew-x-12 -z-10 pointer-events-none"></div>
    </div>
  );
};