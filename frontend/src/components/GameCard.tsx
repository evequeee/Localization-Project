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
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${game.title}"?`)) {
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      await apiDelete(`/api/games/${game.id}`);
      onDelete?.(game.id);
    } catch (error: any) {
      console.error('Error deleting game:', error);
      setDeleteError(error.message || 'Failed to delete game');
    } finally {
      setIsDeleting(false);
    }
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('completed')) 
      return 'bg-green-600 border-green-400';
    if (statusLower.includes('progress')) 
      return 'bg-p4-yellow text-p4-bg border-p4-yellow';
    return 'bg-p4-gray border-p4-gray';
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Shadow layer - creates the offset effect */}
      <div className={`absolute inset-0 bg-black transform -skew-x-2 -skew-y-1 
                      transition-all duration-200 z-0
                      ${isHovered ? 'translate-x-2 translate-y-2' : 'translate-x-1 translate-y-1'}`}>
      </div>

      {/* Main card - TV Channel Style */}
      <div className={`relative z-10 bg-p4-dark border-4 border-p4-white 
                      transform -skew-x-1 flex flex-col h-full
                      transition-all duration-200 ease-out
                      ${isHovered 
                        ? '-translate-y-2 shadow-p4-xl' 
                        : 'shadow-p4'}`}>
        
        {/* Decorative corner accent */}
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-p4-yellow border-2 border-p4-yellow 
                        transform rotate-45 z-20 shadow-lg"></div>

        {/* Status Badge - Asymmetric positioning */}
        <div className="absolute top-4 left-4 z-20">
          <div className={`px-3 py-2 font-black text-xs uppercase tracking-widest 
                          border-2 border-p4-white transform -skew-x-3
                          ${getStatusColor(game.translationStatus)}`}>
            {game.translationStatus}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-8 flex flex-col h-full">
          {/* Title with inverted accent */}
          <div className="mb-4">
            <h2 className="text-3xl font-black text-p4-white uppercase 
                          tracking-tighter leading-tight p4-text-shadow mb-1">
              {game.title}
            </h2>
            <div className="text-xs text-p4-gray uppercase tracking-wider font-bold">
              🌐 {game.originalLanguage}
            </div>
          </div>

          {/* Description */}
          <p className="text-p4-gray text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
            {game.description}
          </p>

          {/* Divider */}
          <div className="h-1 bg-gradient-to-r from-p4-yellow to-transparent mb-4"></div>

          {/* Localizations Block */}
          <div className="mb-6">
            <div className="text-xs font-black text-p4-yellow uppercase tracking-widest mb-3">
              🗣️ Localizations
            </div>
            {game.localizations.length > 0 ? (
              <div className="space-y-2">
                {game.localizations.map((loc, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 p-2 bg-p4-bg border-2 border-p4-gray 
                              transform -skew-x-1 text-xs"
                  >
                    <span className="font-black text-p4-white">
                      {loc.language}
                    </span>
                    <span className="text-p4-gray">•</span>
                    <span className="text-p4-gray flex-1">
                      {loc.teamNames.join(', ') || 'No team'}
                    </span>
                    <span className={`font-bold text-xs px-2 py-1 
                                  ${loc.status?.toLowerCase().includes('progress') 
                                    ? 'bg-p4-yellow text-p4-bg' 
                                    : 'bg-green-600 text-white'}`}>
                      {loc.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-p4-gray italic font-light p-2 
                            bg-p4-bg border-2 border-dashed border-p4-gray">
                No localizations yet
              </div>
            )}
          </div>

          {/* Error Message */}
          {deleteError && (
            <div className="mb-3 bg-red-900 border-3 border-red-600 text-white p-3 
                          text-xs font-bold transform -skew-x-2">
              ⚠️ ERROR: {deleteError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 mt-auto">
            <RoleBasedRender 
              requiredRoles={['User', 'TeamAdmin', 'Admin']}
              fallback={
                <div className="text-center bg-p4-bg border-3 border-dashed border-p4-gray 
                              text-p4-gray font-black uppercase tracking-widest py-3 text-xs">
                  🔒 Sign in to add translations
                </div>
              }
            >
              <Link 
                to={`/add-localization/${game.id}`}
                className="block text-center p4-button text-xs hover:bg-p4-yellow 
                          hover:border-p4-yellow hover:text-p4-bg w-full"
              >
                ➕ Add Translation
              </Link>
            </RoleBasedRender>

            {/* Admin Actions */}
            <RoleBasedRender
              requiredRoles={['Admin']}
              fallback={null}
            >
              <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-p4-gray">
                <Link 
                  to={`/edit-game/${game.id}`}
                  className="text-center bg-blue-900 border-3 border-blue-600 text-blue-200 
                            font-black uppercase tracking-widest text-xs py-2
                            transition-all duration-150 hover:shadow-p4 hover:-translate-y-1
                            active:translate-y-1 active:shadow-none"
                >
                  ✏️ Edit
                </Link>
                
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-900 border-3 border-red-600 text-red-200 font-black 
                            uppercase tracking-widest text-xs py-2
                            transition-all duration-150 hover:shadow-p4 hover:-translate-y-1
                            active:translate-y-1 active:shadow-none disabled:opacity-50 
                            disabled:cursor-not-allowed"
                >
                  {isDeleting ? '⏳...' : '🗑️ Delete'}
                </button>
              </div>
            </RoleBasedRender>
          </div>
        </div>
      </div>
    </div>
  );
};