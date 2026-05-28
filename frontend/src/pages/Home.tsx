import { useLanguage } from '../context/LanguageContext';

export const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-p4-bg pt-12">
      {/* Hero Section */}
      <div className="px-8 py-20 max-w-6xl mx-auto">
        {/* Main Title - WELCOME TO MIDNIGHT */}
        <div className="mb-12 space-y-4">
          <div className="text-center">
            <h1 className="text-8xl md:text-9xl font-black uppercase tracking-tighter 
                          text-p4-white mb-4 p4-text-shadow">
              {t('home.welcome')}
            </h1>
            <div className="border-4 border-p4-yellow bg-p4-dark px-6 py-4 
                          transform -skew-x-2 max-w-2xl mx-auto shadow-p4">
              <p className="text-lg text-p4-yellow uppercase tracking-wider font-black">
                {t('home.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="border-4 border-p4-yellow bg-p4-dark px-6 py-4 
                        transform -skew-x-2 max-w-3xl mx-auto mb-12 shadow-p4">
          <p className="text-lg text-p4-white font-light leading-relaxed">
            {t('home.description')}
          </p>
        </div>

        {/* Feature Cards - TV Channel Style */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {/* Card 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-black transform -skew-x-2 
                          group-hover:translate-x-1 group-hover:translate-y-1 
                          transition-all duration-200 z-0"></div>
            <div className="relative z-10 bg-p4-dark border-4 border-p4-white 
                          transform -skew-x-1 p-6 shadow-p4
                          group-hover:shadow-p4-lg group-hover:-translate-y-1 
                          transition-all duration-200">
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-p4-yellow 
                            border-2 border-p4-yellow"></div>
              <div className="text-4xl font-black text-p4-yellow mb-3">🎮</div>
              <h3 className="text-2xl font-black text-p4-white uppercase mb-2">
                {t('home.features.organize')}
              </h3>
              <p className="text-sm text-gray-400">
                {t('home.features.organize_desc')}
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-black transform -skew-x-2 
                          group-hover:translate-x-1 group-hover:translate-y-1 
                          transition-all duration-200 z-0"></div>
            <div className="relative z-10 bg-p4-dark border-4 border-p4-white 
                          transform -skew-x-1 p-6 shadow-p4
                          group-hover:shadow-p4-lg group-hover:-translate-y-1 
                          transition-all duration-200">
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-p4-yellow 
                            border-2 border-p4-yellow"></div>
              <div className="text-4xl font-black text-p4-yellow mb-3">🌍</div>
              <h3 className="text-2xl font-black text-p4-white uppercase mb-2">
                {t('home.features.translate')}
              </h3>
              <p className="text-sm text-gray-400">
                {t('home.features.translate_desc')}
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-black transform -skew-x-2 
                          group-hover:translate-x-1 group-hover:translate-y-1 
                          transition-all duration-200 z-0"></div>
            <div className="relative z-10 bg-p4-dark border-4 border-p4-white 
                          transform -skew-x-1 p-6 shadow-p4
                          group-hover:shadow-p4-lg group-hover:-translate-y-1 
                          transition-all duration-200">
              <div className="absolute top-1/2 -right-3 w-6 h-6 bg-p4-yellow 
                            border-2 border-p4-yellow"></div>
              <div className="text-4xl font-black text-p4-yellow mb-3">✨</div>
              <h3 className="text-2xl font-black text-p4-white uppercase mb-2">
                {t('home.features.achieve')}
              </h3>
              <p className="text-sm text-gray-400">
                {t('home.features.achieve_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="border-4 border-p4-yellow bg-gradient-to-br 
                        from-p4-dark to-p4-bg p-8 transform -skew-y-1
                        shadow-p4-xl">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-p4-white mb-4
                        p4-text-shadow tracking-tighter">
            {t('home.cta_title')}
          </h2>
          <p className="text-lg text-gray-400 mb-8 font-light max-w-2xl">
            {t('home.cta_desc')}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href="/register" 
               className="p4-button-yellow group relative overflow-hidden">
              <span className="relative z-10">{t('home.cta_start')}</span>
            </a>
            <a href="/games" 
               className="p4-button group relative overflow-hidden">
              <span className="relative z-10">{t('home.cta_browse')}</span>
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-3 gap-4">
          <div className="bg-p4-dark border-4 border-p4-white p-6 
                        transform -skew-x-1 shadow-p4 text-center">
            <div className="text-5xl font-black text-p4-yellow">∞</div>
            <p className="text-sm text-gray-300 uppercase font-bold mt-2">
              {t('home.stats.possibilities')}
            </p>
          </div>
          <div className="bg-p4-dark border-4 border-p4-white p-6 
                        transform -skew-x-1 shadow-p4 text-center">
            <div className="text-5xl font-black text-p4-yellow">→</div>
            <p className="text-sm text-gray-300 uppercase font-bold mt-2">
              {t('home.stats.dynamics')}
            </p>
          </div>
          <div className="bg-p4-dark border-4 border-p4-white p-6 
                        transform -skew-x-1 shadow-p4 text-center">
            <div className="text-5xl font-black text-p4-yellow">◆</div>
            <p className="text-sm text-gray-300 uppercase font-bold mt-2">
              {t('home.stats.quality')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};