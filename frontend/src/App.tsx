import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Game } from './types';

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/games')
      .then(response => {
        setGames(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Деталі помилки:", err);
        setError('Не вдалося зв\'язатися з сервером. Бекенд запущено?');
        setLoading(false);
      });
  }, []);

  if (loading) return <h2 style={{ padding: '20px' }}>Завантаження бази... ⏳</h2>;
  if (error) return <h2 style={{ padding: '20px', color: 'red' }}>{error} ❌</h2>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🎮 Каталог локалізацій</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {games.map(game => (
          <div key={game.id} style={{ border: '1px solid #444', padding: '20px', borderRadius: '8px', backgroundColor: '#1e1e1e', color: 'white' }}>
            <h2 style={{ marginTop: 0 }}>
              {game.title} <span style={{ fontSize: '14px', color: '#aaa' }}>({game.originalLanguage})</span>
            </h2>
            <p><strong>Статус:</strong> {game.translationStatus}</p>
            <p>{game.description}</p>
            
            {game.localizations.length > 0 ? (
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#2a2a2a', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>🌍 Переклади:</h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {game.localizations.map((loc, index) => (
                    <li key={index}>
                      <strong>{loc.language}</strong> — {loc.teamNames.length > 0 ? loc.teamNames.join(', ') : 'Команда не призначена'}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p style={{ fontStyle: 'italic', color: '#aaa' }}>Переклади поки відсутні.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;