import { useState } from 'react';
import { apiPost } from '../services/api';

interface JoinTeamButtonProps {
  teamId: number;
  teamName: string;
  onSuccess?: () => void;
}

export const JoinTeamButton = ({ teamId, teamName, onSuccess }: JoinTeamButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [error, setError] = useState('');

  const handleJoinClick = async () => {
    setIsLoading(true);
    setError('');

    try {
      await apiPost(`/api/teams/${teamId}/requests`, {});
      setHasRequested(true);
      onSuccess?.();
    } catch (err: any) {
      console.error('Помилка при подачі заявки:', err);
      setError(err.message || 'Помилка при подачі заявки');
    } finally {
      setIsLoading(false);
    }
  };

  if (hasRequested) {
    return (
      <button
        disabled
        className="w-full bg-gray-700 text-gray-300 border-2 border-gray-600 font-black uppercase tracking-widest text-sm py-3 cursor-not-allowed opacity-75"
      >
        ✅ Заявка на розгляді
      </button>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 bg-red-900 border-2 border-red-600 text-white p-3 font-bold uppercase tracking-widest text-xs">
          ⚠️ {error}
        </div>
      )}
      <button
        onClick={handleJoinClick}
        disabled={isLoading}
        className={`w-full border-2 font-black uppercase tracking-widest text-sm py-3 transition-all duration-200 ${
          isLoading
            ? 'bg-gray-700 text-gray-300 border-gray-600 cursor-not-allowed opacity-50'
            : 'bg-p4yellow text-black border-black hover:bg-white hover:scale-[1.02] active:scale-95'
        }`}
      >
        {isLoading ? '⏳ Подання заявки...' : `+ Вступити до "${teamName}"`}
      </button>
    </>
  );
};
