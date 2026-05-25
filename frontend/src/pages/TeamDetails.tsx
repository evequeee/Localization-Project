import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiGet } from '../services/api';
import { JoinTeamButton } from '../components/JoinTeamButton';
import { TeamRequestsPanel } from '../components/TeamRequestsPanel';
import { useAuth } from '../hooks/useAuth';
import type { Team } from '../types';

export const TeamDetails = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!teamId) return;

    const loadTeam = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiGet(`/api/teams/${teamId}`);
        setTeam(data);
      } catch (err: any) {
        console.error('Помилка при завантаженні команди:', err);
        setError(err.message || 'Помилка при завантаженні команди');
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, [teamId]);

  if (loading) {
    return <div className="p-8 text-p4yellow text-2xl font-bold animate-pulse">Шукаємо сигнал... 📺</div>;
  }

  if (!team || error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-4xl font-black text-p4yellow mb-4">❌ Команду не знайдено</h1>
          <p className="text-gray-300 mb-8">{error || 'Можливо, команда була видалена.'}</p>
          <button
            onClick={() => navigate('/teams')}
            className="bg-p4yellow text-black border-2 border-black font-black px-6 py-3 hover:bg-white transition-colors"
          >
            ← Назад до команд
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Заголовок */}
      <div className="mb-12">
        <button
          onClick={() => navigate('/teams')}
          className="text-p4yellow font-black uppercase tracking-widest text-sm mb-6 hover:text-white transition-colors"
        >
          ← Назад до команд
        </button>

        <h1 className="text-5xl font-black text-p4yellow mb-4 uppercase tracking-wider drop-shadow-md">
          {team.name}
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          <span className="bg-p4yellow text-p4black px-4 py-2 font-black uppercase tracking-widest text-sm">
            ✅ Верифікована команда
          </span>
          {team.contactEmail && (
            <a
              href={`mailto:${team.contactEmail}`}
              className="bg-p4gray border-2 border-p4yellow text-p4yellow px-4 py-2 font-bold uppercase tracking-widest text-sm hover:bg-p4yellow hover:text-black transition-colors"
            >
              📧 {team.contactEmail}
            </a>
          )}
        </div>
      </div>

      {/* Основна інформація */}
      <div className="bg-p4gray border-l-8 border-p4yellow p-8 mb-12 shadow-xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Опис */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-black text-p4yellow mb-4 uppercase tracking-wider">Про команду</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {team.description || 'Опис команди відсутній. Зв\'яжіться з адміністратором для отримання більшої інформації.'}
            </p>
          </div>

          {/* Статистика */}
          <div className="bg-p4black p-6 border-2 border-p4yellow">
            <h3 className="text-sm font-black text-p4yellow uppercase tracking-widest mb-4">Статус</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold">Членів:</span>
                <span className="text-p4yellow font-black text-lg">∞</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold">Проектів:</span>
                <span className="text-p4yellow font-black text-lg">N/A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Кнопка для вступу (якщо не є членом) */}
      {user && user.role !== 'Admin' && (
        <div className="mb-12">
          <h2 className="text-2xl font-black text-p4yellow mb-4 uppercase tracking-wider drop-shadow-md">
            🚀 Хочеш вступити?
          </h2>
          <JoinTeamButton
            teamId={parseInt(teamId || '0')}
            teamName={team.name}
            onSuccess={() => {
              // Opcionalno: можна додати повідомлення про успіх тут
            }}
          />
        </div>
      )}

      {/* Панель керування заявками (для TeamAdmin) */}
      {teamId && <TeamRequestsPanel teamId={parseInt(teamId)} />}
    </div>
  );
};
