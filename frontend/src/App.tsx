import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Game } from './types';

// Тимчасові компоненти для інших сторінок
const Home = () => (
  <div className="p-8">
    <h1 className="text-5xl font-black text-p4yellow uppercase tracking-tight drop-shadow-md">Welcome to the Midnight Channel</h1>
    <p className="mt-4 text-xl text-gray-300">База даних локалізацій готова до роботи.</p>
  </div>
);

const Teams = () => (
  <div className="p-8">
    <h1 className="text-4xl font-black text-p4yellow uppercase tracking-wider mb-8">Команди</h1>
    <p className="text-gray-300">Тут скоро буде список крутих перекладачів (як SBT Localization).</p>
  </div>
);

// список ігор
const GamesList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ВАЖЛИВО: порт 8080
    axios.get('http://localhost:8080/api/games')
      .then(res => { setGames(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div className="p-8 text-p4yellow text-2xl font-bold animate-pulse">Завантаження бази... 📺</div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-black text-p4yellow mb-8 uppercase tracking-wider drop-shadow-md">Каталог ігор</h1>
      
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {games.map(game => (
          <div key={game.id} className="bg-p4gray border-l-8 border-p4yellow p-6 shadow-xl transform transition duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
            {/* Декоративна смужка в стилі ТБ */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-p4yellow opacity-10 transform rotate-45 translate-x-8 -translate-y-8"></div>
            
            <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
              {game.title} <span className="text-sm text-gray-400 font-normal">({game.originalLanguage})</span>
            </h2>
            
            <div className="inline-block bg-p4yellow text-p4black px-3 py-1 text-xs font-bold uppercase mb-4 tracking-widest shadow-sm">
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
        ))}
      </div>
    </div>
  );
};

// головний компонент із навігацією
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-p4black text-white selection:bg-p4yellow selection:text-p4black font-sans">
        
        <nav className="bg-p4yellow text-p4black px-8 py-4 shadow-lg border-b-4 border-black flex justify-between items-center relative z-10">
          <div className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
            📺 <span className="transform -skew-x-12 inline-block">Localize</span><span className="font-light">DB</span>
          </div>
          
          <div className="flex gap-8 font-bold uppercase tracking-widest text-sm">
            <Link to="/" className="hover:text-white transition-colors duration-200">Головна</Link>
            <Link to="/games" className="hover:text-white transition-colors duration-200">Ігри</Link>
            <Link to="/teams" className="hover:text-white transition-colors duration-200">Команди</Link>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<GamesList />} />
            <Route path="/teams" element={<Teams />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;