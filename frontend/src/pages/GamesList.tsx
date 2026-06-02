import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../services/api';
import { RoleBasedRender } from '../components/ProtectedRoute';
import type { Game } from '../types';
import { GameCard } from '../components/GameCard';

export const GamesList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingCovers, setFetchingCovers] = useState(false);
  const [coverResults, setCoverResults] = useState<any>(null);

  useEffect(() => {
    apiGet('/api/games')
      .then(res => { setGames(res); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const handleGameDelete = (gameId: number) => {
    setGames(games.filter(game => game.id !== gameId));
  };

  const handleFetchCovers = async () => {
    setFetchingCovers(true);
    setCoverResults(null);
    
    try {
      const result = await apiPost('/api/games/fetch-covers', {});
      setCoverResults(result);
      
      // Перезавантажуємо ігри щоб побачити оновлені обкладинки
      setTimeout(async () => {
        const updated = await apiGet('/api/games');
        setGames(updated);
      }, 1000);
    } catch (error: any) {
      console.error('Error fetching covers:', error);
      setCoverResults({
        message: '❌ Error: ' + (error.message || 'Failed to fetch covers')
      });
    } finally {
      setFetchingCovers(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl font-black text-p4-yellow mb-4 animate-pulse">
            📺
          </div>
          <div className="text-2xl font-black text-white uppercase tracking-wider">
            Loading Game Catalog
          </div>
          <div className="text-sm text-gray-400 mt-2">
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
        
        <p className="text-lg text-gray-400 font-light mb-8">
          {games.length === 0 
            ? '📭 No games yet. Admin must add the first game.' 
            : `📺 ${games.length} ${games.length === 1 ? 'game' : 'games'} ready for translation`}
        </p>

        {/* Auto-fetch covers button (Admin only) */}
        <RoleBasedRender requiredRoles={['Admin']} fallback={null}>
          <div className="mb-8 flex flex-col gap-4">
            <button
              onClick={handleFetchCovers}
              disabled={fetchingCovers}
              className="w-fit px-6 py-3 bg-p4-yellow text-p4-bg font-black uppercase 
                       tracking-wider border-3 border-p4-yellow
                       hover:shadow-p4-xl hover:-translate-y-1 transition-all duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {fetchingCovers ? '⏳ Fetching Covers...' : '🎨 Auto-fetch Missing Covers'}
            </button>
            
            {/* Results of cover fetching */}
            {coverResults && (
              <div className={`p-4 border-3 font-bold uppercase text-sm ${
                coverResults.successful ? 'bg-green-900 border-green-600 text-green-200' : 
                'bg-blue-900 border-blue-600 text-blue-200'
              }`}>
                <div>{coverResults.message}</div>
                {coverResults.total && (
                  <div className="text-xs mt-2">
                    Processed: {coverResults.successful}/{coverResults.total} ✅ | 
                    Failed: {coverResults.failed} ⚠️
                  </div>
                )}
              </div>
            )}
          </div>
        </RoleBasedRender>

        {/* Games Grid */}
        {games.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-8xl font-black text-neutral-700 opacity-30 mb-4">
                🎮
              </div>
              <p className="text-2xl font-black text-gray-300 uppercase tracking-wider">
                Catalog Empty
              </p>
              <p className="text-sm text-gray-400 mt-2 max-w-md">
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
    </div>
  );
};