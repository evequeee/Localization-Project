import { useState } from 'react';
import { apiPost } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface JoinTeamButtonProps {
  teamId: number;
  teamName: string;
  onSuccess?: () => void;
}

export const JoinTeamButton = ({ teamId, teamName, onSuccess }: JoinTeamButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleJoinClick = async () => {
    setIsLoading(true);
    setError('');

    try {
      await apiPost(`/api/teams/${teamId}/join`, {});
      setHasRequested(true);
      onSuccess?.();
    } catch (err: any) {
      console.error('Error submitting join request:', err);
      setError(err.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (hasRequested) {
    return (
      <button
        disabled
        className="w-full bg-p4-gray text-white border-4 border-p4-gray font-black
                 uppercase tracking-widest text-lg py-3 cursor-not-allowed opacity-60 p4-button p-4 text-center"
      >
        {t('team_details.pending')}
      </button>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 bg-red-900 border-4 border-red-600 text-white p-4 
                      font-black uppercase tracking-widest text-xs transform -skew-x-1">
          ⚠️ {error}
        </div>
      )}
      <button
        onClick={handleJoinClick}
        disabled={isLoading}
        className={`w-full font-black uppercase tracking-widest text-sm py-3 transition-all 
                   duration-200 p4-button-yellow hover:shadow-p4 
                   ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? t('common.loading_text') : `${t('team_details.join_button')} "${teamName}"`}
      </button>
    </>
  );
};
