import type { Game } from '../types';
import { Link } from 'react-router-dom';
import { RoleBasedRender } from './ProtectedRoute';
import { useState } from 'react';
import { apiDelete } from '../services/api';

interface GameCardProps {
  game: Game;
  onDelete?: (gameId: number) => void;
}

export const GameCard = ({ game, onDelete }: GameCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm(`Ви впевнені, що хочете видалити гру "${game.title}"?`)) {
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      await apiDelete(`/api/games/${game.id}`);
      onDelete?.(game.id);
    } catch (error: any) {
      console.error('Помилка при видаленні гри:', error);
      setDeleteError(error.message || 'Помилка при видаленні гри');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-p4gray border-l-8 border-p4yellow p-6 shadow-xl transform transition duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 right-0 w-16 h-16 bg-p4yellow opacity-10 transform rotate-45 translate-x-8 -translate-y-8"></div>
      
      <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
        {game.title} <span className="text-sm text-gray-400 font-normal">({game.originalLanguage})</span>
      </h2>
      
      <div className="self-start bg-p4yellow text-p4black px-3 py-1 text-xs font-bold uppercase mb-4 tracking-widest shadow-sm">
        {game.translationStatus}
      </div>
      
      <p className="text-gray-300 text-sm mb-6 line-clamp-3 flex-grow">{game.description}</p>

      {/* Блок із перекладами */}
      <div className="border-t border-gray-600 pt-4 mt-auto mb-4">
        {game.localizations.length > 0 ? (
          <>
            <span className="text-xs text-p4yellow uppercase font-black tracking-widest">🌍 Переклади:</span>
            {game.localizations.map((loc, i) => (
              <div key={i} className="text-sm mt-2">
                <span className="font-bold text-white bg-p4black px-2 py-1 border border-p4yellow">
                  {loc.language}
                </span> 
                <span className="text-gray-400 ml-2">
                  — {loc.teamNames.join(', ') || 'Без команди'} 
                  <span className="text-p4yellow/80 italic ml-1">
                    ({loc.status || 'In Progress'})
                  </span>
                </span>
              </div>
            ))}

          </>
        ) : (
          <div className="text-sm text-gray-500 italic">Переклади відсутні</div>
        )}
      </div>

      {/* Повідомлення про помилку при видаленні */}
      {deleteError && (
        <div className="mb-3 bg-red-900 border-2 border-red-600 text-white p-2 text-xs font-bold">
          ⚠️ {deleteError}
        </div>
      )}

      {/* КНОПКА ПРИВ'ЯЗКИ */}
      <RoleBasedRender 
        requiredRoles={['User', 'TeamAdmin', 'Admin']}
        fallback={
          <div className="text-center bg-gray-800 border-2 border-gray-600 text-gray-400 font-black uppercase tracking-widest py-2 mt-2 text-sm">
            Увійдіть для додавання перекладів
          </div>
        }
      >
        <Link 
          to={`/add-localization/${game.id}`}
          className="block text-center bg-transparent border-2 border-p4yellow text-p4yellow font-black uppercase tracking-widest py-2 mt-2 hover:bg-p4yellow hover:text-black transition-colors duration-200"
        >
          + Додати переклад
        </Link>
      </RoleBasedRender>

      {/* Кнопки редагування/видалення - тільки для Admin */}
      <RoleBasedRender
        requiredRoles={['Admin']}
        fallback={null}
      >
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-600">
          <Link 
            to={`/edit-game/${game.id}`}
            className="flex-1 text-center bg-blue-900 border-2 border-blue-600 text-blue-200 font-bold uppercase tracking-widest text-xs py-2 hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50"
          >
            ✏️ Редагувати
          </Link>
          
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-900 border-2 border-red-600 text-red-200 font-bold uppercase tracking-widest text-xs py-2 hover:bg-red-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? '⏳ Видалення...' : '🗑️ Видалити'}
          </button>
        </div>
      </RoleBasedRender>
    </div>
  );
};