import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface PendingTeam {
  id: number;
  name: string;
  contactEmail: string;
  ownerEmail: string;
  ownerName: string;
}

export const AdminPanel = () => {
  const [pendingTeams, setPendingTeams] = useState<PendingTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const { language } = useLanguage();

  const fetchData = async () => {
    try {
      const response = await apiGet('/api/admin/pending-teams');
      setPendingTeams(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching pending teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (teamId: number) => {
    setProcessingId(teamId);
    try {
      await apiPost(`/api/admin/teams/${teamId}/approve`, {});
      alert(language === 'uk' ? 'Команду схвалено!' : 'Team approved!');
      fetchData();
    } catch (error) {
      console.error('Error approving team:', error);
      alert(language === 'uk' ? 'Помилка при схваленні' : 'Error approving team');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (teamId: number) => {
    setProcessingId(teamId);
    try {
      await apiPost(`/api/admin/teams/${teamId}/reject`, {});
      alert(language === 'uk' ? 'Команду відхилено!' : 'Team rejected!');
      fetchData();
    } catch (error) {
      console.error('Error rejecting team:', error);
      alert(language === 'uk' ? 'Помилка при відхиленні' : 'Error rejecting team');
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl font-black text-p4-yellow mb-4 animate-pulse">
            🛡️
          </div>
          <div className="text-2xl font-black text-white uppercase tracking-wider">
            {language === 'uk' ? 'ЗАВАНТАЖЕННЯ...' : 'LOADING...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-p4-bg p-8 p4-scanline">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-black text-p4-white uppercase tracking-tighter p4-text-shadow mb-4">
            {language === 'uk' ? 'АДМІН ПАНЕЛЬ' : 'ADMIN PANEL'}
          </h1>
          <div className="bg-p4-yellow text-p4-bg px-4 py-2 font-black transform -skew-x-6 shadow-p4 inline-block">
            {language === 'uk' ? 'МОДЕРАЦІЯ КОМАНД' : 'TEAM MODERATION'}
          </div>
        </div>

        {/* Pending Teams */}
        <div>
          <h2 className="text-3xl font-black text-p4-white uppercase tracking-tighter mb-6 border-b-4 border-p4-yellow pb-2">
            {language === 'uk' ? 'ОЧІКУВАНІ КОМАНДИ' : 'PENDING TEAMS'}
          </h2>
          {!Array.isArray(pendingTeams) || pendingTeams.length === 0 ? (
            <div className="bg-p4-dark border-4 border-dashed border-p4-gray p-8 transform -skew-x-1">
              <p className="text-gray-400 font-black uppercase">
                {language === 'uk' ? 'Немає очікуваних команд' : 'No pending teams'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTeams.map((team) => (
                <div key={team.id} className="bg-p4-dark border-4 border-p4-white p-6 shadow-p4 transform -skew-x-1">
                  <div className="transform skew-x-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-grow">
                      <div className="text-2xl font-black text-p4-white uppercase mb-2">
                        {team.name}
                      </div>
                      <div className="text-sm text-gray-400 font-black uppercase mb-1">
                        📧 {team.contactEmail || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-400 font-black uppercase mb-1">
                        👤 {team.ownerName || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-400 font-black uppercase">
                        📩 {team.ownerEmail || 'Unknown'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(team.id)}
                        disabled={processingId === team.id}
                        className="px-4 py-2 bg-p4-yellow text-p4-bg font-black uppercase border-2 border-p4-yellow hover:bg-p4-secondary transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {language === 'uk' ? 'УХВАЛИТИ' : 'APPROVE'}
                      </button>
                      <button
                        onClick={() => handleReject(team.id)}
                        disabled={processingId === team.id}
                        className="px-4 py-2 bg-p4-bg text-p4-red font-black uppercase border-2 border-p4-red hover:bg-p4-red hover:text-p4-bg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {language === 'uk' ? 'ВІДХИЛИТИ' : 'REJECT'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
