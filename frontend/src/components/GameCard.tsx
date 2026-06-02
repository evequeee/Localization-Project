import type { Game } from '../types';
import { Link } from 'react-router-dom';
import { RoleBasedRender } from './ProtectedRoute';
import { useState, useMemo } from 'react';
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

  // Calculate stable progress for demo (same value per game)
  // Using useMemo with game.id ensures consistent value during hover/render
  const progress = useMemo(() => {
    // Deterministic random based on game.id
    const seed = game.id * 9301 + 49297;
    return Math.floor(((seed % 233280) / 233280) * 100);
  }, [game.id]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group h-full"
    >
      {/* Shadow layer - creates the offset effect */}
      <div className={`absolute inset-0 bg-black transform -skew-x-2 
                      transition-all duration-200 z-0
                      ${isHovered ? 'translate-x-2 translate-y-2' : 'translate-x-1 translate-y-1'}`}>
      </div>

      {/* Main Card Container */}
      <div className={`relative z-10 bg-p4-dark border-3 border-p4-white 
                      flex flex-col h-full
                      transition-all duration-200 ease-out
                      ${isHovered 
                        ? '-translate-y-2 shadow-p4-xl' 
                        : 'shadow-p4'}`}>
        
        {/* TOP SECTION: Game Cover Image */}
        <div className="relative h-48 bg-p4-gray overflow-hidden 
                        border-b-2 border-p4-yellow flex items-center justify-center group/image">
          
          {/* Real Image or Placeholder */}
          {game.imageUrl ? (
            <img 
              src={game.imageUrl} 
              alt={game.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          
          {/* Fallback placeholder - shows if no image or image fails */}
          {!game.imageUrl && (
            <div className="text-8xl opacity-30 group-hover/image:opacity-50 transition-opacity">
              🎮
            </div>
          )}
          
          {/* Status Badge - Top Left */}
          <div className="absolute top-3 left-3 z-20">
            <div className={`px-3 py-2 font-black text-xs uppercase tracking-widest 
                            border-2 border-p4-white
                            ${getStatusColor(game.translationStatus)}`}>
              {game.translationStatus}
            </div>
          </div>

          {/* Accent corner - Top Right */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-p4-yellow 
                          border-2 border-p4-yellow transform rotate-45"></div>
        </div>

        {/* MIDDLE SECTION: Game Info & Localizations */}
        <div className="flex-1 flex flex-col p-4">
          
          {/* Game Title */}
          <div className="mb-4">
            <h2 className="text-xl font-black text-white uppercase 
                          tracking-tight leading-snug break-words">
              {game.title}
            </h2>
            <div className="text-xs text-gray-300 uppercase tracking-wider font-bold mt-1">
              🌐 {game.originalLanguage}
            </div>
          </div>

          {/* Description - Optional */}
          <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">
            {game.description}
          </p>

          {/* Localizations Info Block */}
          <div className="mb-4 p-3 bg-p4-gray border-2 border-p4-light-gray">
            {game.localizations.length > 0 ? (
              <div className="space-y-3">
                {game.localizations.slice(0, 2).map((loc, i) => (
                  <div key={i} className="space-y-1">
                    {/* Team Name */}
                    <div className="text-xs font-black text-p4-yellow uppercase tracking-wider">
                      {loc.teamNames.join(', ') || 'No team'}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-neutral-700 border-2 border-p4-light-gray">
                        <div 
                          className="h-full bg-p4-yellow transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-black text-white whitespace-nowrap">
                        {progress}%
                      </span>
                    </div>

                    {/* Status */}
                    <div className="text-xs text-gray-300 font-bold">
                      {loc.status}
                    </div>
                  </div>
                ))}
                
                {game.localizations.length > 2 && (
                  <div className="text-xs text-gray-400 italic">
                    +{game.localizations.length - 2} more {game.localizations.length - 2 === 1 ? 'localization' : 'localizations'}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-400 italic font-light">
                No localizations yet
              </div>
            )}
          </div>

          {/* Error Message */}
          {deleteError && (
            <div className="mb-3 bg-red-900 border-2 border-red-600 text-red-200 p-2 
                          text-xs font-bold">
              ⚠️ {deleteError}
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: Action Buttons */}
        <div className="border-t-2 border-p4-light-gray p-3 space-y-2">
          <RoleBasedRender 
            requiredRoles={['User', 'TeamAdmin', 'Admin']}
            fallback={
              <div className="text-center bg-p4-bg border-2 border-dashed border-p4-light-gray 
                            text-gray-400 font-bold uppercase tracking-wider py-2 text-xs">
                🔒 Sign in
              </div>
            }
          >
            <Link 
              to={`/add-localization/${game.id}`}
              className="block text-center bg-p4-yellow text-p4-bg font-black uppercase 
                        tracking-wider text-xs py-2 border-2 border-p4-yellow
                        transition-all duration-150 hover:shadow-lg hover:-translate-y-1
                        active:translate-y-0 active:shadow-none"
            >
              ➕ ADD
            </Link>
          </RoleBasedRender>

          {/* Admin Actions */}
          <RoleBasedRender
            requiredRoles={['Admin']}
            fallback={null}
          >
            <div className="grid grid-cols-2 gap-2">
              <Link 
                to={`/edit-game/${game.id}`}
                className="text-center bg-blue-900 border-2 border-blue-600 text-blue-200 
                          font-bold uppercase tracking-wider text-xs py-2
                          transition-all duration-150 hover:shadow-lg hover:-translate-y-1
                          active:translate-y-0 active:shadow-none"
              >
                ✏️ EDIT
              </Link>
              
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-900 border-2 border-red-600 text-red-200 font-bold 
                          uppercase tracking-wider text-xs py-2
                          transition-all duration-150 hover:shadow-lg hover:-translate-y-1
                          active:translate-y-0 active:shadow-none disabled:opacity-50 
                          disabled:cursor-not-allowed"
              >
                {isDeleting ? '⏳...' : '🗑️ DEL'}
              </button>
            </div>
          </RoleBasedRender>
        </div>
      </div>
    </div>
  );
};