import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface Comment {
  id: number;
  text: string;
  gameId: number;
  userId: number;
  userName: string;
  createdAt: string;
}

interface GameDetails {
  id: number;
  title: string;
  description: string;
  originalLanguage: string;
  translationStatus: string;
  imageUrl?: string;
  createdAt: string;
  comments: Comment[];
  likeCount: number;
  isLikedByCurrentUser: boolean;
}

export const GameDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [togglingLike, setTogglingLike] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchGameDetails = async () => {
      try {
        const response = await apiGet(`/api/games/${id}/details`);
        setGame(response);
      } catch (error) {
        console.error('Error fetching game details:', error);
      } finally {
        setLoading(false);
      }
    };
    void fetchGameDetails();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;

    setSubmittingComment(true);
    try {
      const response = await apiPost(`/api/games/${id}/comments`, { text: commentText });
      setGame(prev => prev ? {
        ...prev,
        comments: [response, ...prev.comments]
      } : null);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleToggleLike = async () => {
    if (!id) return;
    setTogglingLike(true);
    try {
      const response = await apiPost(`/api/games/${id}/toggle-like`, {});
      setGame(prev => prev ? {
        ...prev,
        likeCount: response.likeCount,
        isLikedByCurrentUser: response.liked
      } : null);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setTogglingLike(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-p4-bg p4-scanline p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-black text-p4-yellow mb-4 animate-pulse">
            📺
          </div>
          <div className="text-2xl font-black text-white uppercase tracking-wider">
            {language === 'uk' ? 'Завантаження...' : 'Loading...'}
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-p4-bg p4-scanline p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl font-black text-neutral-700 opacity-30 mb-4">
            🎮
          </div>
          <p className="text-2xl font-black text-white uppercase tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
            {language === 'uk' ? 'Гру не знайдено' : 'Game not found'}
          </p>
          <button
            onClick={() => navigate('/games')}
            className="mt-6 px-6 py-3 bg-p4-yellow text-p4-bg font-black uppercase
                     border-4 border-p4-yellow shadow-[4px_4px_0_0_#000]
                     hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1
                     transition-all duration-150"
          >
            {language === 'uk' ? 'Повернутися до ігор' : 'Back to Games'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-p4-bg p4-scanline">
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/games')}
          className="mb-8 px-4 py-2 bg-p4-dark text-p4-yellow font-black uppercase
                   border-4 border-p4-yellow shadow-[4px_4px_0_0_#000]
                   hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1
                   transition-all duration-150 text-sm"
        >
          ← {language === 'uk' ? 'Назад' : 'Back'}
        </button>

        {/* Game Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Game Cover */}
            <div className="w-full md:w-1/3">
              <div className="relative bg-p4-dark border-4 border-p4-white
                              shadow-[4px_4px_0_0_#000] overflow-hidden">
                {game.imageUrl ? (
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="aspect-[3/4] flex items-center justify-center">
                    <div className="text-8xl opacity-30">🎮</div>
                  </div>
                )}
              </div>
            </div>

            {/* Game Info */}
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-black text-white uppercase
                            tracking-tighter mb-4 p4-text-shadow">
                {game.title}
              </h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="px-4 py-2 bg-p4-dark border-4 border-p4-white
                                font-black uppercase text-sm">
                  🌐 {game.originalLanguage}
                </div>
                <div className="px-4 py-2 bg-p4-dark border-4 border-p4-white
                                font-black uppercase text-sm">
                  {game.translationStatus}
                </div>
              </div>

              <p className="text-gray-200 text-lg leading-relaxed mb-6 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                {game.description || (language === 'uk' ? 'Опис відсутній' : 'No description available')}
              </p>

              {/* Like Button */}
              <button
                onClick={handleToggleLike}
                disabled={togglingLike}
                className={`px-6 py-3 font-black uppercase tracking-wider text-lg
                         border-4 shadow-[4px_4px_0_0_#000]
                         hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1
                         transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                         ${game.isLikedByCurrentUser
                           ? 'bg-p4-yellow text-p4-bg border-p4-yellow'
                           : 'bg-p4-dark text-p4-yellow border-p4-white'
                         }`}
              >
                {togglingLike
                  ? '...'
                  : `${game.isLikedByCurrentUser ? '❤️' : '🤍'} ${game.likeCount} ${language === 'uk' ? 'лайків' : 'likes'}`
                }
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">
            {language === 'uk' ? 'Коментарі' : 'Comments'}
          </h2>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="bg-p4-dark border-4 border-p4-white p-6 shadow-[4px_4px_0_0_#000]">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={language === 'uk' ? 'Напишіть коментар...' : 'Write a comment...'}
                rows={3}
                className="w-full px-4 py-3 bg-p4-bg border-4 border-p4-white text-white
                         font-bold placeholder-gray-500 focus:outline-none focus:border-p4-yellow
                         focus:ring-4 focus:ring-p4-yellow transition-all duration-150 resize-none"
                disabled={submittingComment}
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="px-6 py-3 bg-p4-yellow text-p4-bg font-black uppercase
                           border-4 border-p4-yellow shadow-[4px_4px_0_0_#000]
                           hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1
                           transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment
                    ? (language === 'uk' ? 'Надсилання...' : 'Sending...')
                    : (language === 'uk' ? 'Надіслати' : 'Send')
                  }
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {game.comments.length === 0 ? (
              <div className="text-center py-12 bg-p4-dark border-4 border-p4-white
                              border-dashed">
                <div className="text-6xl mb-4 opacity-30">💬</div>
                <p className="text-white font-bold uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  {language === 'uk' ? 'Ще немає коментарів' : 'No comments yet'}
                </p>
              </div>
            ) : (
              game.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-p4-dark border-4 border-p4-white p-6 shadow-[4px_4px_0_0_#000]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-p4-yellow border-4 border-p4-white
                                      flex items-center justify-center font-black text-p4-bg">
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-p4-yellow uppercase text-sm">
                          {comment.userName}
                        </div>
                        <div className="text-gray-400 text-xs uppercase font-bold">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-200 leading-relaxed drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
