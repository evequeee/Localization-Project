import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiPost } from '../services/api';
import type { Team } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningTeamId, setJoiningTeamId] = useState<number | null>(null);
  const [followedTeams, setFollowedTeams] = useState<Record<number, boolean>>({});
  const { t, language } = useLanguage();

  const handleJoinTeam = async (event: React.MouseEvent, teamId: number) => {
    event.preventDefault();
    event.stopPropagation();
    setJoiningTeamId(teamId);

    try {
      await apiPost(`/api/teams/${teamId}/join`, {});
      alert(language === 'uk' ? 'Заявку успішно надіслано!' : 'Request sent successfully!');
    } catch (error: any) {
      console.error('Error joining team:', error);
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          (language === 'uk' ? 'Помилка при відправці заявки' : 'Error sending request');
      alert(errorMessage);
    } finally {
      setJoiningTeamId(null);
    }
  };

  const handleToggleFollow = (event: React.MouseEvent, teamId: number) => {
    event.preventDefault();
    event.stopPropagation();
    setFollowedTeams(prev => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  };

  useEffect(() => {
    apiGet('/api/teams')
      .then(res => {
        setTeams(Array.isArray(res) ? res : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading teams:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-p4-yellow text-2xl font-bold animate-pulse">{t('teams.loading')}</div>;

  return (
    <div className="min-h-screen bg-p4-bg p-8 p4-scanline">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <h1 className="text-6xl md:text-7xl font-black text-p4-white uppercase tracking-tighter p4-text-shadow">
            {t('teams.title')}
          </h1>
          <Link 
            to="/add-team"
            className="p4-button-yellow text-sm hover:shadow-p4-xl"
          >
            {t('teams.create')}
          </Link>
        </div>

        {teams.length === 0 ? (
          <div className="text-center bg-p4-dark border-4 border-dashed border-p4-gray p-16 transform -skew-x-1">
            <div className="text-8xl font-black text-p4-gray opacity-30 mb-4">👥</div>
            <p className="text-2xl font-black text-white uppercase tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
              {t('teams.empty')}
            </p>
            <p className="text-sm text-gray-300 mt-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              {t('teams.first_team')}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {teams.map(team => (
              <Link
                key={team.id}
                to={`/team/${team.id}`}
                className="group relative"
              >
                {/* Shadow layer */}
                <div className="absolute inset-0 bg-black transform -skew-x-2 
                              group-hover:translate-x-1 group-hover:translate-y-1 
                              transition-all duration-200 z-0"></div>
                
                {/* Main card */}
                <div className="relative z-10 bg-p4-dark border-4 border-p4-white 
                              transform -skew-x-1 p-6 shadow-p4
                              group-hover:shadow-p4-lg group-hover:-translate-y-1 
                              transition-all duration-200 flex flex-col h-full">
                  
                  {/* Corner accent */}
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-p4-yellow 
                                border-2 border-p4-yellow"></div>

                  {/* Team name */}
                  <h2 className="text-3xl font-black text-p4-white uppercase 
                               tracking-tighter p4-text-shadow mb-3">
                    {team.name}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-gray-200 text-sm mb-6 flex-grow leading-relaxed line-clamp-3 not-italic drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                    "{team.description || t('teams.no_description')}"
                  </p>

                  {/* Divider */}
                  <div className="h-1 bg-gradient-to-r from-p4-yellow to-transparent mb-4"></div>

                  {/* Email & Status */}
                  <div className="space-y-3">
                    {team.contactEmail && (
                      <div className="text-xs text-white font-bold uppercase tracking-widest opacity-95 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                        📧 {team.contactEmail}
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={(event) => handleToggleFollow(event, team.id)}
                        className={`w-fit px-3 py-2 text-xs font-black uppercase tracking-wider border-2 transition-all duration-150 ${
                          followedTeams[team.id]
                            ? 'bg-p4-yellow text-p4-bg border-p4-yellow'
                            : 'bg-p4-bg text-p4-yellow border-p4-yellow hover:bg-p4-secondary'
                        }`}
                      >
                        {followedTeams[team.id] ? t('teams.following') : t('teams.follow')}
                      </button>

                      <button
                        type="button"
                        onClick={(event) => handleJoinTeam(event, team.id)}
                        disabled={joiningTeamId === team.id}
                        className="w-fit px-3 py-2 text-xs font-black uppercase tracking-wider border-2 border-p4-green bg-p4-bg text-p4-green hover:bg-p4-green hover:text-p4-bg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {joiningTeamId === team.id ? (language === 'uk' ? 'НАДСИЛАННЯ...' : 'SENDING...') : (language === 'uk' ? 'ПРИЄДНАТИСЬ' : 'JOIN')}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-p4-yellow font-black text-xs uppercase">
                        ✅ {t('teams.verified')}
                      </span>
                      <span className="text-p4-white text-xs font-black uppercase
                                     group-hover:text-p4-yellow transition-colors">
                        {t('teams.view_details')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};