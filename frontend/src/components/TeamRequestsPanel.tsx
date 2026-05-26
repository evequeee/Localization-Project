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
      console.error('Error loading join requests:', err);
      setError(err.message || 'Failed to load join requests');
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
      console.error('Error approving request:', err);
      setError(err.message || 'Failed to approve request');
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
      console.error('Error rejecting request:', err);
      setError(err.message || 'Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pending: { bg: 'bg-yellow-900', border: 'border-yellow-600', text: 'text-yellow-200', label: '⏳ Pending' },
      Approved: { bg: 'bg-green-900', border: 'border-green-600', text: 'text-green-200', label: '✅ Approved' },
      Rejected: { bg: 'bg-red-900', border: 'border-red-600', text: 'text-red-200', label: '❌ Rejected' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
    
    return (
      <span className={`${config.bg} ${config.border} ${config.text} px-3 py-1 border-2 font-black uppercase text-xs tracking-widest`}>
        {config.label}
      </span>
    );
  };

  return (
    <RoleBasedRender
      requiredRoles={['Admin', 'TeamAdmin']}
      fallback={null}
    >
      <div className="mt-16 pt-8 border-t-4 border-p4-yellow">
        <h2 className="text-4xl font-black text-p4-yellow uppercase 
                     tracking-tighter p4-text-shadow mb-8">
          📋 Join Requests
        </h2>

        {error && (
          <div className="mb-6 bg-red-900 border-4 border-red-600 text-white p-4 
                        font-black uppercase tracking-widest text-sm transform -skew-x-1">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-p4-yellow text-lg font-bold animate-pulse">
            📺 Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center bg-p4-dark border-4 border-p4-gray p-12 transform -skew-x-1">
            <div className="text-5xl font-black text-p4-gray opacity-30 mb-4">📋</div>
            <p className="text-p4-gray font-black uppercase tracking-wider">No Requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(request => (
              <div
                key={request.id}
                className="relative group"
              >
                {/* Shadow layer */}
                <div className="absolute inset-0 bg-black transform -skew-x-2 translate-x-1 translate-y-1 -z-10"></div>
                
                {/* Main request card */}
                <div className="bg-p4-dark border-4 border-p4-white transform -skew-x-1 
                              p-6 shadow-p4 relative z-10">
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Request info */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-3 flex-wrap">
                        <span className="text-lg font-black text-p4-white">👤 {request.userEmail}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="text-xs text-p4-gray font-bold uppercase tracking-widest">
                        📅 Submitted: {new Date(request.createdAt).toLocaleDateString('en-US')}
                      </div>
                    </div>

                    {/* Action buttons for Pending requests */}
                    {request.status === 'Pending' && (
                      <div className="flex gap-3 flex-wrap md:flex-nowrap">
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={processingId === request.id}
                          className="flex-1 md:flex-none bg-green-900 border-2 border-green-600 
                                   text-green-200 font-black uppercase tracking-widest text-sm py-2 px-4 
                                   hover:bg-green-800 transition-colors duration-200 
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === request.id ? '⏳...' : '✅ Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={processingId === request.id}
                          className="flex-1 md:flex-none bg-red-900 border-2 border-red-600 
                                   text-red-200 font-black uppercase tracking-widest text-sm py-2 px-4 
                                   hover:bg-red-800 transition-colors duration-200 
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingId === request.id ? '⏳...' : '❌ Reject'}
                        </button>
                      </div>
                    )}

                    {/* Info for processed requests */}
                    {request.status !== 'Pending' && (
                      <div className="text-xs text-p4-gray font-bold uppercase tracking-widest md:text-right">
                        📅 Processed: {request.resolvedAt ? new Date(request.resolvedAt).toLocaleDateString('en-US') : '—'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleBasedRender>
  );
};
