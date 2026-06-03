import { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface DashboardData {
  Team: {
    id: number;
    name: string;
    contactEmail: string;
    description: string;
    isApproved: boolean;
  };
  Projects: Array<{
    id: number;
    language: string;
    status: string;
    gameTitle: string;
  }>;
  Members: Array<{
    id: number;
    userName: string;
    email: string;
  }>;
  Requests: Array<{
    id: number;
    userId: number;
    userName: string;
    userEmail: string;
    createdAt: string;
  }>;
  isOwner: boolean;
}

export const TeamDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingReqId, setProcessingReqId] = useState<number | null>(null);
  const { language } = useLanguage();

  const handleApprove = async (reqId: number) => {
    setProcessingReqId(reqId);
    try {
      await apiPost(`/api/teams/requests/${reqId}/approve`, {});
      alert(language === 'uk' ? 'Заявку схвалено!' : 'Request approved!');
      fetchData();
    } catch (error) {
      console.error('Error approving request:', error);
      alert(language === 'uk' ? 'Помилка при схваленні' : 'Error approving request');
    } finally {
      setProcessingReqId(null);
    }
  };

  const handleReject = async (reqId: number) => {
    setProcessingReqId(reqId);
    try {
      await apiPost(`/api/teams/requests/${reqId}/reject`, {});
      alert(language === 'uk' ? 'Заявку відхилено!' : 'Request rejected!');
      fetchData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert(language === 'uk' ? 'Помилка при відхиленні' : 'Error rejecting request');
    } finally {
      setProcessingReqId(null);
    }
  };

  const fetchData = async () => {
    try {
      const response = await apiGet('/api/teams/my-dashboard');
      setData(response);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-12 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl font-black text-p4-yellow mb-4 animate-pulse">
            📊
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
            {language === 'uk' ? 'КАБІНЕТ КОМАНДИ' : 'TEAM DASHBOARD'}
          </h1>
          <div className="bg-p4-yellow text-p4-bg px-4 py-2 font-black transform -skew-x-6 shadow-p4 inline-block">
            {data.Team?.name || language === 'uk' ? 'Невідома команда' : 'Unknown Team'}
          </div>
          <p className="text-gray-200 mt-4 text-lg">
            {data.Team?.description || 'Опис відсутній'}
          </p>
        </div>

        {/* Pending Team Warning */}
        {data.Team?.isApproved === false && (
          <div className="bg-p4-dark border-4 border-p4-yellow p-12 transform -skew-x-1 mb-12">
            <div className="transform skew-x-1 text-center">
              <div className="text-6xl font-black text-p4-yellow mb-6">⏳</div>
              <h2 className="text-4xl font-black text-p4-white uppercase tracking-tighter mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                {language === 'uk' ? 'ВАША КОМАНДА НА МОДЕРАЦІЇ' : 'YOUR TEAM IS UNDER MODERATION'}
              </h2>
              <p className="text-xl text-gray-200 font-black uppercase mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                {language === 'uk' ? 'Очікуйте підтвердження адміністратором.' : 'Awaiting administrator approval.'}
              </p>
              <p className="text-sm text-gray-300 font-black uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                {language === 'uk' ? 'Після схвалення ви отримаєте доступ до управління складом та проєктами.' : 'After approval, you will gain access to team management and projects.'}
              </p>
            </div>
          </div>
        )}

        {/* АКТИВНІ ПРОЄКТИ */}
        {data.Team?.isApproved === true && (
          <div className="mb-12">
            <h2 className="text-3xl font-black text-p4-white uppercase tracking-tighter mb-6 border-b-4 border-p4-yellow pb-2">
              {language === 'uk' ? 'АКТИВНІ ПРОЄКТИ' : 'ACTIVE PROJECTS'}
            </h2>
            {!Array.isArray(data.Projects) || data.Projects.length === 0 ? (
              <div className="bg-p4-dark border-4 border-dashed border-p4-gray p-8 transform -skew-x-1">
                <p className="text-white font-black uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  {language === 'uk' ? 'Немає активних проєктів' : 'No active projects'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {data.Projects.map((project) => (
                  <div key={project.id} className="bg-p4-dark border-4 border-p4-white p-6 shadow-p4 transform -skew-x-1">
                    <div className="transform skew-x-1">
                      <h3 className="text-xl font-black text-p4-white uppercase mb-2">
                        {project.gameTitle || language === 'uk' ? 'Невідома гра' : 'Unknown Game'}
                      </h3>
                      <div className="flex gap-4 text-sm">
                        <span className="text-p4-yellow font-black uppercase">
                          {project.language || 'N/A'}
                        </span>
                        <span className="text-gray-200 font-black uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                          {project.status || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* СКЛАД КОМАНДИ */}
        {data.Team?.isApproved === true && (
          <div className="mb-12">
            <h2 className="text-3xl font-black text-p4-white uppercase tracking-tighter mb-6 border-b-4 border-p4-yellow pb-2">
              {language === 'uk' ? 'СКЛАД КОМАНДИ' : 'TEAM MEMBERS'}
            </h2>
            {!Array.isArray(data.Members) || data.Members.length === 0 ? (
              <div className="bg-p4-dark border-4 border-dashed border-p4-gray p-8 transform -skew-x-1">
                <p className="text-white font-black uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  {language === 'uk' ? 'Немає членів команди' : 'No team members'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {data.Members.map((member) => (
                  <div key={member.id} className="bg-p4-dark border-4 border-p4-white p-4 shadow-p4 transform -skew-x-1">
                    <div className="transform skew-x-1">
                      <div className="text-lg font-black text-p4-white uppercase mb-1">
                        {member.userName || language === 'uk' ? 'Невідомий користувач' : 'Unknown User'}
                      </div>
                      <div className="text-xs text-gray-300 font-black uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                        {member.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ЗАЯВКИ */}
        {data.Team?.isApproved === true && data.isOwner === true && (
          <div>
            <h2 className="text-3xl font-black text-p4-white uppercase tracking-tighter mb-6 border-b-4 border-p4-yellow pb-2">
              {language === 'uk' ? 'ЗАЯВКИ' : 'JOIN REQUESTS'}
            </h2>
            {!Array.isArray(data.Requests) || data.Requests.length === 0 ? (
              <div className="bg-p4-dark border-4 border-dashed border-p4-gray p-8 transform -skew-x-1">
                <p className="text-white font-black uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  {language === 'uk' ? 'Немає нових заявок' : 'No new requests'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.Requests.map((request) => (
                  <div key={request.id} className="bg-p4-dark border-4 border-p4-white p-6 shadow-p4 transform -skew-x-1">
                    <div className="transform skew-x-1 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="text-lg font-black text-p4-white uppercase mb-1">
                          {request.userName || language === 'uk' ? 'Невідомий користувач' : 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-300 font-black uppercase mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                          {request.userEmail || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                          {request.createdAt ? new Date(request.createdAt).toLocaleString() : 'N/A'}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={processingReqId === request.id}
                          className="px-4 py-2 bg-p4-yellow text-p4-bg font-black uppercase border-2 border-p4-yellow hover:bg-p4-secondary transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {language === 'uk' ? 'УХВАЛИТИ' : 'APPROVE'}
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={processingReqId === request.id}
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
        )}
      </div>
    </div>
  );
};
