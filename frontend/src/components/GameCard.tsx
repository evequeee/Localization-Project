import type { Game } from '../types';

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  return (
    <div className="bg-p4gray border-l-8 border-p4yellow p-6 shadow-xl transform transition duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden flex flex-col h-full">
      {/* Декоративна смужка в стилі ТБ */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-p4yellow opacity-10 transform rotate-45 translate-x-8 -translate-y-8"></div>
      
      <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
        {game.title} <span className="text-sm text-gray-400 font-normal">({game.originalLanguage})</span>
      </h2>
      
      <div className="self-start bg-p4yellow text-p4black px-3 py-1 text-xs font-bold uppercase mb-4 tracking-widest shadow-sm">
        {game.translationStatus}
      </div>
      
      <p className="text-gray-300 text-sm mb-6 line-clamp-3">{game.description}</p>
      
      {game.localizations.length > 0 ? (
        <div className="border-t border-gray-600 pt-4 mt-auto">
          <span className="text-xs text-p4yellow uppercase font-black tracking-widest">🌍 Переклади:</span>
          {game.localizations.map((loc, i) => (
            <div key={i} className="text-sm mt-2">
              <span className="font-bold text-white bg-p4black px-2 py-1 rounded">{loc.language}</span> 
              <span className="text-gray-400 ml-2">— {loc.teamNames.join(', ') || 'Без команди'}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-t border-gray-600 pt-4 mt-auto text-sm text-gray-500 italic">
          Переклади відсутні
        </div>
      )}
    </div>
  );
};