import { useState, useEffect } from 'react';
import { apiGet as apiget, apiPost } from '../services/api';
import { RoleBasedRender } from '../components/ProtectedRoute';
import type { Game } from '../types';
import { GameCard } from '../components/GameCard';
import { CustomSelect } from '../components/CustomSelect';
import { useLanguage } from '../context/LanguageContext';

export const GamesList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchingCovers, setFetchingCovers] = useState(false);
  const [coverResults, setCoverResults] = useState<any>(null);
  const { t, language } = useLanguage();

  const statusOptions = [
    { value: '', label: language === 'uk' ? 'УСІ СТАТУСИ' : 'ALL STATUSES' },
    { value: 'In Progress', label: language === 'uk' ? 'У ПРОЦЕСІ' : 'IN PROGRESS' },
    { value: 'Completed', label: language === 'uk' ? 'ЗАВЕРШЕНО' : 'COMPLETED' },
    { value: 'Planned', label: language === 'uk' ? 'ЗАПЛАНОВАНО' : 'PLANNED' }
  ];

  const fetchGames = async (selectedStatus: string, search: string = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus) params.append('status', selectedStatus);
      if (search) params.append('search', search);

      const endpoint = `/api/games${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('Fetching games with endpoint:', endpoint);

      const response = await apiget(endpoint);

      let responseData: Game[] = [];
      if (Array.isArray(response?.data)) {
        responseData = response.data;
      } else if (Array.isArray(response)) {
        responseData = response;
      }

      console.log('Games fetched:', responseData.length);
      setGames(Array.isArray(responseData) ? responseData : []);
    } catch (err) {
      console.error('Error fetching games:', err);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  // Завантаження ігор при монтуванні
  useEffect(() => {
    void fetchGames('', searchQuery);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchGames(selectedStatus, searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedStatus]);

  const handleStatusChange = (_name: string, value: string) => {
    setSelectedStatus(value);
    void fetchGames(value, searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Search input changed:', value);
    setSearchQuery(value);
  };

  // Безпечне видалення гри
  const handleGameDelete = (gameId: number) => {
    setGames(prev =>
      Array.isArray(prev)
        ? prev.filter(game => game.id !== gameId)
        : []
    );
  };

  const handleFetchCovers = async () => {
    setFetchingCovers(true);
    setCoverResults(null);

    try {
      const result = await apiPost('/api/games/fetch-covers', {});
      setCoverResults(result);

      // Перезавантажуємо ігри
      setTimeout(() => {
        void fetchGames(selectedStatus);
      }, 1000);
    } catch (error: any) {
      console.error('Error fetching covers:', error);
      setCoverResults({
        message: '❌ Error: ' + (error?.message || 'Failed to fetch covers')
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
            {t('games.loading_title')}
          </div>
          <div className="text-sm text-gray-400 mt-2">
            {t('games.loading_subtitle')}
          </div>
        </div>
      </div>
    );
  }

  // Безпечна перевірка масиву перед рендером
  const safeGames = Array.isArray(games) ? games : [];
  const gameWord = language === 'uk'
    ? (safeGames.length === 1 ? 'гра' : safeGames.length < 5 ? 'гри' : 'ігор')
    : (safeGames.length === 1 ? 'game' : 'games');

  return (
    <div className="min-h-screen bg-p4-bg p4-scanline">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-end gap-4 mb-8">
          <h1 className="text-6xl md:text-7xl font-black text-p4-white uppercase 
                        tracking-tighter p4-text-shadow">
            {t('games.title')}
          </h1>
          <div className="bg-p4-yellow text-p4-bg px-3 py-2 font-black 
                        transform -skew-x-6 shadow-p4">
            #{safeGames.length}
          </div>
        </div>

        <p className="text-lg text-gray-400 font-light mb-8">
          {safeGames.length === 0
            ? t('games.no_games_admin')
            : t('games.count_ready').replace('{count}', String(safeGames.length)).replace('{word}', gameWord)}
        </p>

        {/* Search Input */}
        <div className="mb-6 w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={language === 'uk' ? 'Пошук ігор...' : 'Search games...'}
            className="w-full px-4 py-3 bg-p4-dark border-4 border-p4-white text-white
                     font-black uppercase tracking-wider placeholder-gray-500
                     focus:outline-none focus:border-p4-yellow focus:ring-4 focus:ring-p4-yellow
                     transition-all duration-150"
          />
        </div>

        {/* Status Filter */}
        <div className="mb-8 w-full max-w-xs">
          <CustomSelect
            label={t('games.filter_label')}
            name="status"
            value={selectedStatus}
            options={statusOptions}
            onChange={handleStatusChange}
          />
        </div>

        {/* Auto-fetch covers button (Admin only) */}
        <RoleBasedRender requiredRoles={['Admin']} fallback={null}>
          <div className="mb-8 flex flex-col gap-4">
            <button
              onClick={handleFetchCovers}
              disabled={fetchingCovers}
              className="w-fit px-6 py-3 bg-p4-secondary border-2 border-p4-yellow text-p4-yellow 
                       font-black uppercase tracking-wider
                       hover:bg-p4-card hover:shadow-p4-xl hover:-translate-y-1 transition-all duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {fetchingCovers ? t('games.fetching_covers_loading') : t('games.fetching_covers')}
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
                    {t('games.cover_results_processed')
                      .replace('{successful}', String(coverResults.successful))
                      .replace('{total}', String(coverResults.total))
                      .replace('{failed}', String(coverResults.failed))}
                  </div>
                )}
              </div>
            )}
          </div>
        </RoleBasedRender>

        {/* Games Grid */}
        {safeGames.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-8xl font-black text-neutral-700 opacity-30 mb-4">
                🎮
              </div>
              <p className="text-2xl font-black text-white uppercase tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                {selectedStatus ? t('games.no_games_status') : t('games.catalog_empty')}
              </p>
              <p className="text-sm text-gray-300 mt-2 max-w-md drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                {selectedStatus ? t('games.try_filter') : t('games.come_later')}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
            {safeGames.map((game, index) => (
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