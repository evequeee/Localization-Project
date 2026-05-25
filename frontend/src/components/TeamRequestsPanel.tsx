import { useState, useEffect } from 'react';
import { apiGet, apiPatch } from '../services/api';
import { RoleBasedRender } from './ProtectedRoute';
import type { TeamJoinRequest } from '../types';

interface TeamRequestsPanelProps {
  teamId: number;
}

export const TeamRequestsPanel = ({ teamId }: TeamRequestsPanelProps) => {
  const [requests, setRequests] = useState<TeamJoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadRequests();
  }, [teamId]);

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiGet(`/api/teams/${teamId}/requests`);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Помилка при завантаженні заявок:', err);
      setError(err.message || 'Помилка при завантаженні заявок');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    setProcessingId(requestId);
    try {
      await apiPatch(`/api/teams/requests/${requestId}`, { status: 'Approved' });
      setRequests(requests.map(r => 
        r.id === requestId ? { ...r, status: 'Approved' } : r
      ));
    } catch (err: any) {
      console.error('Помилка при прийнятті заявки:', err);
      setError(err.message || 'Помилка при прийнятті заявки');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: number) => {
    setProcessingId(requestId);
    try {
      await apiPatch(`/api/teams/requests/${requestId}`, { status: 'Rejected' });
      setRequests(requests.map(r => 
        r.id === requestId ? { ...r, status: 'Rejected' } : r
      ));
    } catch (err: any) {
      console.error('Помилка при відхиленні заявки:', err);
      setError(err.message || 'Помилка при відхиленні заявки');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pending: { bg: 'bg-yellow-900', border: 'border-yellow-600', text: 'text-yellow-200' },
      Approved: { bg: 'bg-green-900', border: 'border-green-600', text: 'text-green-200' },
      Rejected: { bg: 'bg-red-900', border: 'border-red-600', text: 'text-red-200' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
    
    return (
      <span className={`${config.bg} ${config.border} ${config.text} px-3 py-1 border-2 font-black uppercase text-xs tracking-widest`}>
        {status === 'Pending' && '⏳ На розгляді'}
        {status === 'Approved' && '✅ Схвалено'}
        {status === 'Rejected' && '❌ Відхилено'}
      </span>
    );
  };

  return (
    <RoleBasedRender
      requiredRoles={['Admin', 'TeamAdmin']}
      fallback={null}
    >
      <div className="mt-12 pt-8 border-t-4 border-p4yellow">
        <h2 className="text-3xl font-black text-p4yellow mb-6 uppercase tracking-wider drop-shadow-md">
          📋 Заявки на вступ
        </h2>

        {error && (
          <div className="mb-6 bg-red-900 border-2 border-red-600 text-white p-4 font-bold uppercase tracking-widest text-sm">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-p4yellow text-lg font-bold animate-pulse">
            Завантаження заявок... 📺
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center bg-p4gray border-2 border-gray-700 p-8 text-gray-400 font-bold">
            Заявок немає
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map(request => (
              <div
                key={request.id}
                className="bg-p4gray border-l-4 border-p4yellow p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Основна інформація */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-lg font-black text-white">👤 {request.userEmail}</span>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="text-xs text-gray-400 font-bold">
                      Подано: {new Date(request.createdAt).toLocaleDateString('uk-UA')}
                    </div>
                  </div>

                  {/* Кнопки дій (видно тільки для Pending) */}
                  {request.status === 'Pending' && (
                    <div className="flex gap-3 md:flex-nowrap flex-wrap">
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={processingId === request.id}
                        className="flex-1 md:flex-none bg-green-900 border-2 border-green-600 text-green-200 font-black uppercase tracking-widest text-sm py-2 px-4 hover:bg-green-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === request.id ? '⏳...' : '✅ Прийняти'}
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={processingId === request.id}
                        className="flex-1 md:flex-none bg-red-900 border-2 border-red-600 text-red-200 font-black uppercase tracking-widest text-sm py-2 px-4 hover:bg-red-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === request.id ? '⏳...' : '❌ Відхилити'}
                      </button>
                    </div>
                  )}

                  {/* Інформація для обробленої заявки */}
                  {request.status !== 'Pending' && (
                    <div className="text-xs text-gray-400 font-bold md:text-right">
                      Оброблено: {request.resolvedAt ? new Date(request.resolvedAt).toLocaleDateString('uk-UA') : '—'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleBasedRender>
  );
};
