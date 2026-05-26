import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage, type Language } from '../context/LanguageContext';
import { RoleBasedRender } from './ProtectedRoute';
import { useState } from 'react';

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang: Language = language === 'uk' ? 'en' : 'uk';
    setLanguage(newLang);
  };

  return (
    <nav className="bg-p4-bg border-b-4 border-p4-yellow shadow-2xl relative z-50">
      {/* Background accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-p4-yellow via-p4-accent to-p4-yellow opacity-80"></div>

      <div className="px-8 py-6 flex justify-between items-center">
        {/* Logo Section - MIDNIGHT LOCALIZE */}
        <Link 
          to="/" 
          className="group flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="text-3xl font-black uppercase tracking-tighter transform -skew-x-6 
                          bg-p4-yellow text-p4-bg px-4 py-2 shadow-p4">
            📺
          </div>
          <div className="text-lg font-black text-p4-white uppercase tracking-widest 
                          transform -skew-x-2 group-hover:text-p4-yellow transition-colors duration-200">
            MIDNIGHT <span className="text-p4-yellow">LOCALIZE</span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <div className="flex items-center gap-6 font-bold uppercase tracking-widest text-sm">
          {/* Home Link */}
          <Link 
            to="/"
            onMouseEnter={() => setHoveredItem('home')}
            onMouseLeave={() => setHoveredItem(null)}
            className="p4-menu-item group relative"
          >
            <span className="relative">
              {t('nav.home')}
              <span className={`absolute bottom-0 left-0 h-1 bg-p4-yellow transition-all duration-200 
                              ${hoveredItem === 'home' ? 'w-full' : 'w-0'}`}></span>
            </span>
          </Link>

          {isAuthenticated && user ? (
            <>
              {/* Games Link */}
              <Link 
                to="/games"
                onMouseEnter={() => setHoveredItem('games')}
                onMouseLeave={() => setHoveredItem(null)}
                className="p4-menu-item group relative"
              >
                <span className="relative">
                  {t('nav.games')}
                  <span className={`absolute bottom-0 left-0 h-1 bg-p4-yellow transition-all duration-200 
                                  ${hoveredItem === 'games' ? 'w-full' : 'w-0'}`}></span>
                </span>
              </Link>

              {/* Teams Link */}
              <Link 
                to="/teams"
                onMouseEnter={() => setHoveredItem('teams')}
                onMouseLeave={() => setHoveredItem(null)}
                className="p4-menu-item group relative"
              >
                <span className="relative">
                  {t('nav.teams')}
                  <span className={`absolute bottom-0 left-0 h-1 bg-p4-yellow transition-all duration-200 
                                  ${hoveredItem === 'teams' ? 'w-full' : 'w-0'}`}></span>
                </span>
              </Link>

              {/* Add Game Button - Admin Only */}
              <RoleBasedRender
                requiredRoles={['Admin']}
                fallback={null}
              >
                <Link 
                  to="/add-game" 
                  className="p4-button text-xs hover:bg-p4-yellow hover:border-p4-yellow hover:text-p4-bg"
                >
                  ⚔️ {t('games.add')}
                </Link>
              </RoleBasedRender>

              {/* Add Team Button */}
              <Link 
                to="/add-team" 
                className="p4-button text-xs hover:bg-p4-yellow hover:border-p4-yellow hover:text-p4-bg"
              >
                👥 {t('teams.create')}
              </Link>

              {/* User Info Section */}
              <div className="flex items-center gap-3 pl-6 border-l-2 border-p4-gray">
                <div className="text-right">
                  <div className="text-xs text-p4-gray uppercase tracking-wider font-light">User</div>
                  <div className="text-sm font-black text-p4-white">{user.email}</div>
                </div>
                <div className="text-2xl">👤</div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="p4-button text-xs hover:bg-p4-yellow hover:border-p4-yellow hover:text-p4-bg"
              >
                ⚡ {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              {/* Login Button */}
              <Link 
                to="/login" 
                className="p4-button text-xs hover:bg-p4-yellow hover:border-p4-yellow hover:text-p4-bg"
              >
                🔐 {t('nav.login')}
              </Link>

              {/* Register Button */}
              <Link 
                to="/register" 
                className="p4-button-yellow text-xs"
              >
                ✨ {t('nav.register')}
              </Link>
            </>
          )}

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="ml-4 px-3 py-2 border-2 border-p4-yellow bg-p4-bg text-p4-yellow 
                       font-black uppercase tracking-widest text-xs rounded hover:bg-p4-yellow 
                       hover:text-p4-bg transition-all duration-150 transform -skew-x-2"
            title={`Switch to ${language === 'uk' ? 'English' : 'Ukrainian'}`}
          >
            {language === 'uk' ? 'УКР' : 'ENG'}
          </button>
        </div>
      </div>

      {/* Decorative bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-p4-yellow to-transparent opacity-60"></div>
    </nav>
  );
};