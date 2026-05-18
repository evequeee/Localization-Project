import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const FloatingApiTesterButton = () => {
  const { user } = useAuth();
  
  // Показуємо кнопку тільки для Admin
  if (!user || user.role !== 'Admin') {
    return null;
  }

  return (
    <Link
      to="/api-tester"
      className="fixed bottom-8 left-8 bg-p4yellow text-p4black hover:bg-yellow-400 font-black py-3 px-4 rounded-full shadow-lg border-2 border-p4black transition-all duration-200 hover:shadow-xl hover:scale-110 flex items-center gap-2 z-40 text-sm"
      title="API Tester (тільки для Admin)"
    >
      <span className="text-xl">🧪</span>
      <span className="hidden sm:inline">API Tester</span>
    </Link>
  );
};
