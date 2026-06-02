import { createContext, useState, useContext, type ReactNode } from 'react';

export type Language = 'uk' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
export const translations: Record<Language, Record<string, string>> = {
  uk: {
    // Navbar
    'nav.home': 'Головна',
    'nav.games': 'Ігри',
    'nav.teams': 'Команди',
    'nav.logout': 'Вийти',
    'nav.login': 'Вхід',
    'nav.register': 'Реєстрація',
    'nav.api_tester': 'API Тестер',
    
    // Home
    'home.welcome': 'WELCOME TO MIDNIGHT LOCALIZE',
    'home.subtitle': 'ЦЕНТР УКРАЇНСЬКИХ ЛОКАЛІЗАЦІЙ',
    'home.description': 'Твоя головна база для пошуку українізаторів. Завантажуй локалізації, відстежуй прогрес у реальному часі та підтримуй команди, які роблять ігри доступними.',
    'home.features.organize': 'ВІДСТЕЖУЙ',
    'home.features.organize_desc': 'Слідкуй за відсотком готовності перекладу улюблених ігор у реальному часі. Жодних таємниць — весь прогрес як на долоні..',
    'home.features.translate': 'ЗАВАНТАЖУЙ',
    'home.features.translate_desc': 'Отримуй доступ до готових локалізацій або проміжних тестових білдів напряму від розробників.',
    'home.features.achieve': 'ПІДТРИМУЙ',
    'home.features.achieve_desc': 'Знаходь сторінки команд локалізаторів, слідкуй за їхніми новинами та підтримуй творців, які розвивають український геймінг.',
    'home.cta_title': 'ЧАС ГРАТИ СОЛОВ\'ЇНОЮ',
    'home.cta_desc': 'Відкривай для себе сотні перекладених проектів. Поринь у світ відеоігор без мовних бар\'єрів прямо зараз!',
    'home.cta_start': '🚀 ПОЧАТИ ЗАРАЗ',
    'home.cta_browse': '📚 ПЕРЕГЛЯНУТИ ІГРИ',
    'home.stats.possibilities': 'МОЖЛИВОСТІ',
    'home.stats.dynamics': 'ДИНАМІКА',
    'home.stats.quality': 'ЯКІСТЬ',
    'home.cta_games': '🎮 Переглянути Ігри',
    'home.cta_teams': '👥 Переглянути Команди',
    'home.logged_in': 'Обиратимуй проєкт для перекладу',
    
    // Login
    'login.title': 'MIDNIGHT',
    'login.subtitle': 'ENTER THE CHANNEL',
    'login.email': '📧 Email',
    'login.password': '🔐 Password',
    'login.button': '🚀 Enter',
    'login.register_link': 'No Account Yet?',
    'login.register_cta': '✨ Join',
    'login.error': 'Login failed',
    
    // Register
    'register.title': 'Join Us',
    'register.subtitle': 'ENTER THE MIDNIGHT CHANNEL',
    'register.email': '📧 Email',
    'register.password': '🔐 Password',
    'register.confirm_password': '🔄 Confirm Password',
    'register.button': '🚀 Create Account',
    'register.signin_link': 'Already Have an Account?',
    'register.signin_cta': '🔐 Sign In',
    'register.password_min': 'Password must be at least 6 characters',
    'register.passwords_match': 'Passwords do not match',
    'register.error': 'Registration failed',
    
    // Games
    'games.title': 'Games in Channel',
    'games.add': '➕ Add Game',
    'games.empty': 'No Games Yet',
    'games.language': 'Original Language',
    'games.status': 'Translation Status',
    'games.description': 'Description',
    
    // Teams
    'teams.title': 'Team Roster',
    'teams.create': '➕ Create Team',
    'teams.empty': 'No Teams Yet',
    'teams.view_details': 'View Details →',
    'teams.verified': 'VERIFIED',
    'teams.email': 'Email',
    
    // Team Details
    'team_details.back': '← Back to Teams',
    'team_details.members': 'Members',
    'team_details.projects': 'Projects',
    'team_details.about': 'About',
    'team_details.no_description': 'No description available',
    'team_details.join': '🚀 Want to Join?',
    'team_details.join_button': '➕ Join',
    'team_details.pending': '✅ Request Pending Review',
    'team_details.requests': '📋 Join Requests',
    
    // Add Game
    'add_game.title': 'Add New',
    'add_game.title_game': 'GAME to Channel',
    'add_game.input_title': '⚡ Title',
    'add_game.input_language': '🌐 Original Language',
    'add_game.input_status': '📊 Translation Status',
    'add_game.input_description': '📝 Description',
    'add_game.button': '✨ Create Game',
    
    // Add Team
    'add_team.title': 'Register TEAM To Roster',
    'add_team.input_name': '👥 Team Name',
    'add_team.input_description': '📝 Description',
    'add_team.input_email': '📧 Contact Email',
    'add_team.button': '✨ Create Team',
    'add_team.note': 'Note: After registration, your team will be pending admin verification. You can start recruiting members once approved!',
    
    // Add Localization
    'add_localization.title': 'Add New TRANSLATION for Game',
    'add_localization.language': '🌐 Translation Language',
    'add_localization.team': '👥 Localization Team',
    'add_localization.status': '📊 Translation Status',
    'add_localization.button': '✨ Link Translation',
    'add_localization.select_team': 'Please select a team',
    
    // Common
    'common.loading': '⏳ Loading...',
    'common.saving': '⏳ Saving...',
    'common.error': '❌ Error',
    'common.success': '✅ Success',
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.games': 'Games',
    'nav.teams': 'Teams',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.api_tester': 'API Tester',
    
    // Home
    'home.welcome': 'WELCOME TO MIDNIGHT LOCALIZE',
    'home.subtitle': 'UKRAINIAN LOCALIZATION HUB',
    'home.description': 'Your ultimate base for finding Ukrainian translations. Download localizations, track progress in real-time, and support the teams making games accessible.',
    'home.features.organize': 'TRACK PROGRESS',
    'home.features.organize_desc': 'Monitor the translation completion percentage of your favorite games in real-time. No secrets — all progress is transparent.',
    'home.features.translate': 'DOWNLOAD',
    'home.features.translate_desc': 'Get direct access to finished localizations or early test builds straight from the translation teams.',
    'home.features.achieve': 'SUPPORT CREATORS',
    'home.features.achieve_desc': 'Find localization team pages, follow their updates, and support the creators who are growing the Ukrainian gaming community.',
    'home.cta_title': 'TIME TO PLAY IN YOUR LANGUAGE',
    'home.cta_desc': 'Discover hundreds of translated projects. Dive into the gaming world without language barriers right now!',
    'home.cta_start': '🚀 START NOW',
    'home.cta_browse': '📚 BROWSE GAMES',
    'home.stats.possibilities': 'POSSIBILITIES',
    'home.stats.dynamics': 'DYNAMICS',
    'home.stats.quality': 'QUALITY',
    'home.cta_games': '🎮 Browse Games',
    'home.cta_teams': '👥 Browse Teams',
    'home.logged_in': 'Choose a project to localize',
    
    // Login
    'login.title': 'MIDNIGHT',
    'login.subtitle': 'ENTER THE CHANNEL',
    'login.email': '📧 Email',
    'login.password': '🔐 Password',
    'login.button': '🚀 Enter',
    'login.register_link': 'No Account Yet?',
    'login.register_cta': '✨ Join',
    'login.error': 'Login failed',
    
    // Register
    'register.title': 'Join Us',
    'register.subtitle': 'ENTER THE MIDNIGHT CHANNEL',
    'register.email': '📧 Email',
    'register.password': '🔐 Password',
    'register.confirm_password': '🔄 Confirm Password',
    'register.button': '🚀 Create Account',
    'register.signin_link': 'Already Have an Account?',
    'register.signin_cta': '🔐 Sign In',
    'register.password_min': 'Password must be at least 6 characters',
    'register.passwords_match': 'Passwords do not match',
    'register.error': 'Registration failed',
    
    // Games
    'games.title': 'Games in Channel',
    'games.add': '➕ Add Game',
    'games.empty': 'No Games Yet',
    'games.language': 'Original Language',
    'games.status': 'Translation Status',
    'games.description': 'Description',
    
    // Teams
    'teams.title': 'Team Roster',
    'teams.create': '➕ Create Team',
    'teams.empty': 'No Teams Yet',
    'teams.view_details': 'View Details →',
    'teams.verified': 'VERIFIED',
    'teams.email': 'Email',
    
    // Team Details
    'team_details.back': '← Back to Teams',
    'team_details.members': 'Members',
    'team_details.projects': 'Projects',
    'team_details.about': 'About',
    'team_details.no_description': 'No description available',
    'team_details.join': '🚀 Want to Join?',
    'team_details.join_button': '➕ Join',
    'team_details.pending': '✅ Request Pending Review',
    'team_details.requests': '📋 Join Requests',
    
    // Add Game
    'add_game.title': 'Add New',
    'add_game.title_game': 'GAME to Channel',
    'add_game.input_title': '⚡ Title',
    'add_game.input_language': '🌐 Original Language',
    'add_game.input_status': '📊 Translation Status',
    'add_game.input_description': '📝 Description',
    'add_game.button': '✨ Create Game',
    
    // Add Team
    'add_team.title': 'Register TEAM To Roster',
    'add_team.input_name': '👥 Team Name',
    'add_team.input_description': '📝 Description',
    'add_team.input_email': '📧 Contact Email',
    'add_team.button': '✨ Create Team',
    'add_team.note': 'Note: After registration, your team will be pending admin verification. You can start recruiting members once approved!',
    
    // Add Localization
    'add_localization.title': 'Add New TRANSLATION for Game',
    'add_localization.language': '🌐 Translation Language',
    'add_localization.team': '👥 Localization Team',
    'add_localization.status': '📊 Translation Status',
    'add_localization.button': '✨ Link Translation',
    'add_localization.select_team': 'Please select a team',
    
    // Common
    'common.loading': '⏳ Loading...',
    'common.saving': '⏳ Saving...',
    'common.error': '❌ Error',
    'common.success': '✅ Success',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language | null;
    return saved || 'uk';
  });

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
