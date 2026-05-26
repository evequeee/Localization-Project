import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiGet } from '../services/api';
import { JoinTeamButton } from '../components/JoinTeamButton';
import { TeamRequestsPanel } from '../components/TeamRequestsPanel';
import { RoleBasedRender } from '../components/ProtectedRoute';
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
        console.error('Error loading team:', err);
        setError(err.message || 'Failed to load team');
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, [teamId]);

  if (loading) {
    return <div className="min-h-screen bg-p4-bg p-8 flex items-center justify-center p4-scanline">
      <div className="text-p4-yellow text-2xl font-bold animate-pulse">📺 Searching for signal...</div>
    </div>;
  }

  if (!team || error) {
    return (
      <div className="min-h-screen bg-p4-bg p-8 flex items-center justify-center p4-scanline">
        <div className="max-w-md">
          <h1 className="text-4xl font-black text-p4-yellow mb-4 uppercase tracking-wider">❌ Team Not Found</h1>
          <p className="text-p4-gray mb-8">{error || 'Team may have been deleted.'}</p>
          <button
            onClick={() => navigate('/teams')}
            className="p4-button-yellow hover:shadow-p4"
          >
            ← Back to Teams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-p4-bg p-8 p4-scanline">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/teams')}
          className="text-p4-yellow font-black uppercase tracking-widest text-sm mb-8 
                   hover:text-p4-white transition-colors"
        >
          ← Back to Teams
        </button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-black text-p4-white uppercase 
                        tracking-tighter p4-text-shadow mb-6">
            {team.name}
          </h1>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="bg-p4-yellow text-p4-bg px-4 py-2 font-black uppercase 
                          tracking-widest text-sm transform -skew-x-2">
              ✅ VERIFIED
            </div>
            {team.contactEmail && (
              <a
                href={`mailto:${team.contactEmail}`}
                className="bg-p4-dark border-4 border-p4-yellow text-p4-yellow px-4 py-2 
                         font-black uppercase tracking-widest text-sm 
                         hover:bg-p4-yellow hover:text-p4-bg transition-all duration-150"
              >
                📧 {team.contactEmail}
              </a>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-black transform -skew-x-2 translate-x-2 translate-y-2 -z-10"></div>
          <div className="bg-p4-dark border-4 border-p4-white transform -skew-x-1 
                        p-8 shadow-p4-xl relative z-10">
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* About */}
              <div className="md:col-span-2">
                <h2 className="text-3xl font-black text-p4-yellow uppercase 
                             tracking-tighter p4-text-shadow mb-6">About</h2>
                <p className="text-p4-gray text-lg leading-relaxed">
                  {team.description || 'No description available. Contact admin for more information.'}
                </p>
              </div>

              {/* Stats */}
              <div className="bg-p4-bg border-4 border-p4-yellow p-6">
                <h3 className="text-sm font-black text-p4-yellow uppercase 
                             tracking-widest mb-6">Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-p4-gray">
                    <span className="text-p4-gray font-black">Members:</span>
                    <span className="text-p4-yellow font-black text-lg">∞</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-p4-gray font-black">Projects:</span>
                    <span className="text-p4-yellow font-black text-lg">N/A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Join button for non-admins */}
        {user && user.role !== 'Admin' && (
          <div className="mb-12">
            <h2 className="text-4xl font-black text-p4-yellow uppercase 
                         tracking-tighter p4-text-shadow mb-6">
              🚀 Want to Join?
            </h2>
            <JoinTeamButton
              teamId={parseInt(teamId || '0')}
              teamName={team.name}
              onSuccess={() => {
                // Optional: add success message
              }}
            />
          </div>
        )}

        {/* Admin panel */}
        <RoleBasedRender requiredRoles={['Admin', 'TeamAdmin']}>
          {teamId && <TeamRequestsPanel teamId={parseInt(teamId)} />}
        </RoleBasedRender>
      </div>

      {/* Background decoration */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-p4-yellow opacity-5 
                     transform -skew-x-12 -z-10 pointer-events-none"></div>
    </div>
  );
};
