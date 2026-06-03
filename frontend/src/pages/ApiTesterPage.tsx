import { ApiTester } from '../components/ApiTester';
import { useLanguage } from '../context/LanguageContext';

export const ApiTesterPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-p4-bg p-8 p4-scanline">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-black text-p4-white uppercase 
                     tracking-tighter p4-text-shadow mb-4">🧪 {t('nav.api_tester')}</h1>
        <p className="text-lg text-p4-gray font-black uppercase tracking-widest mb-12">
          {t('api_tester.subtitle')}
        </p>
        
        <ApiTester />
      </div>
    </div>
  );
};
