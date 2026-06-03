import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const FloatingApiTesterButton = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  // Show button only for Admin
  if (!user || user.role !== 'Admin') {
    return null;
  }

  return (
    <Link
      to="/api-tester"
      className="fixed bottom-8 left-8 bg-p4-yellow text-p4-bg hover:bg-yellow-400 
               font-black py-3 px-4 rounded-full shadow-lg border-2 border-p4-bg 
               transition-all duration-200 hover:shadow-xl hover:scale-110 
               flex items-center gap-2 z-40 text-sm"
      title={t('api_tester.button')}
    >
      <span className="text-xl">🧪</span>
      <span className="hidden sm:inline">{t('api_tester.button')}</span>
    </Link>
  );
};
