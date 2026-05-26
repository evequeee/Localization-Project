import React, { createContext, useState, useContext, ReactNode } from 'react';

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
    'home.welcome': 'WELCOME TO MIDNIGHT',
    'home.subtitle': 'ЛОКАЛІЗАЦІЙНА ПЛАТФОРМА',
    'home.description': 'Приєднайся до спільноти волонтерів-перекладачів та допоможи зробити улюблені ігри доступними для мільйонів гравців',
    'home.features.organize': 'ОРГАНІЗУВАТИ',
    'home.features.organize_desc': 'Створюй команди та керуй локалізаціями для великих проектів.',
    'home.features.translate': 'ПЕРЕКЛАДАТИ',
    'home.features.translate_desc': 'Приєднайся до команд та спільно розроб переклади на світовому рівні.',
    'home.features.achieve': 'ДОСЯГАЙ',
    'home.features.achieve_desc': 'Відстежуй прогрес, завершуй віхи та святкуй успіх команди.',
    'home.cta_title': 'ГОТОВИЙ ЗМІНИТИ ЛОКАЛІЗАЦІЮ ІГОР?',
    'home.cta_desc': 'Приєднайся до нашої спільноти розробників та локалізаторів. Створюй дивовижні переклади прямо зараз!',
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
    'home.welcome': 'WELCOME TO MIDNIGHT',
    'home.subtitle': 'LOCALIZATION PLATFORM',
    'home.description': 'Join our community of volunteer translators and help make your favorite games accessible to millions of players',
    'home.features.organize': 'ORGANIZE',
    'home.features.organize_desc': 'Create teams and manage localizations for large projects.',
    'home.features.translate': 'TRANSLATE',
    'home.features.translate_desc': 'Join teams and collaboratively develop translations at world class level.',
    'home.features.achieve': 'ACHIEVE',
    'home.features.achieve_desc': 'Track progress, complete milestones, and celebrate team success.',
    'home.cta_title': 'READY TO CHANGE GAME LOCALIZATION?',
    'home.cta_desc': 'Join our community of developers and localizers. Create amazing translations right now!',
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
