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
    'nav.user': 'Користувач',
    'nav.switch_to': 'Переключити на {lang}',
    
    // Home
    'home.welcome': 'ЛАСКАВО ПРОСИМО В MIDNIGHT LOCALIZE',
    'home.subtitle': 'ЦЕНТР УКРАЇНСЬКИХ ЛОКАЛІЗАЦІЙ',
    'home.description': 'Твоя головна база для пошуку українізаторів. Завантажуй локалізації, відстежуй прогрес у реальному часі та підтримуй команди, які роблять ігри доступними.',
    'home.features.organize': 'ВІДСТЕЖУЙ',
    'home.features.organize_desc': 'Слідкуй за відсотком готовності перекладу улюблених ігор у реальному часі. Жодних таємниць — весь прогрес як на долоні.',
    'home.features.translate': 'ЗАВАНТАЖУЙ',
    'home.features.translate_desc': 'Отримуй доступ до готових локалізацій або проміжних тестових білдів напряму від розробників.',
    'home.features.achieve': 'ПІДТРИМУЙ',
    'home.features.achieve_desc': 'Знаходь сторінки команд локалізаторів, слідкуй за їхніми новинами та підтримуй творців, які розвивають український геймінг.',
    'home.cta_title': 'ЧАС ГРАТИ СОЛОВ’ЇНОЮ',
    'home.cta_desc': 'Відкривай для себе сотні перекладених проєктів. Поринь у світ відеоігор без мовних бар’єрів прямо зараз!',
    'home.cta_start': '🚀 ПОЧАТИ ЗАРАЗ',
    'home.cta_browse': '📚 ПЕРЕГЛЯНУТИ ІГРИ',
    'home.stats.possibilities': 'МОЖЛИВОСТІ',
    'home.stats.dynamics': 'ДИНАМІКА',
    'home.stats.quality': 'ЯКІСТЬ',
    'home.cta_games': '🎮 Переглянути ігри',
    'home.cta_teams': '👥 Переглянути команди',
    'home.logged_in': 'Оберіть проєкт для перекладу',
    
    // Login
    'login.title': 'MIDNIGHT',
    'login.subtitle': 'УВІЙДІТЬ У КАНАЛ',
    'login.email': '📧 Електронна пошта',
    'login.password': '🔐 Пароль',
    'login.button': '🚀 Увійти',
    'login.register_link': 'Ще немає акаунта?',
    'login.register_cta': '✨ Приєднатися',
    'login.error': 'Не вдалося увійти',
    'login.loading': '⏳ Вхід...',
    
    // Register
    'register.title': 'Приєднуйтесь',
    'register.subtitle': 'УВІЙДІТЬ У КАНАЛ MIDNIGHT',
    'register.email': '📧 Електронна пошта',
    'register.password': '🔐 Пароль',
    'register.confirm_password': '🔄 Підтвердіть пароль',
    'register.button': '🚀 Створити акаунт',
    'register.signin_link': 'Вже маєте акаунт?',
    'register.signin_cta': '🔐 Увійти',
    'register.password_min': 'Пароль має містити щонайменше 6 символів',
    'register.passwords_match': 'Паролі не збігаються',
    'register.error': 'Не вдалося зареєструватися',
    'register.loading': '⏳ Створення акаунта...',
    'register.email_required': 'Потрібно вказати електронну пошту',
    'register.email_invalid': 'Невірний формат електронної пошти',
    'register.password_required': 'Потрібно вказати пароль',
    
    // Games
    'games.title': 'Ігри у каналі',
    'games.add': '➕ Додати гру',
    'games.empty': 'Ігор ще немає',
    'games.loading_title': 'Завантаження каталогу ігор',
    'games.loading_subtitle': 'з Midnight Channel...',
    'games.count_ready': '📺 {count} {word} готово до перекладу',
    'games.no_games_admin': '📭 Ігор ще немає. Адміністратор має додати першу гру.',
    'games.filter_label': 'Фільтр за статусом',
    'games.fetching_covers': '🎨 Автозавантаження обкладинок',
    'games.fetching_covers_loading': '⏳ Завантаження обкладинок...',
    'games.cover_results_processed': 'Оброблено: {successful}/{total} ✅ | Помилок: {failed} ⚠️',
    'games.catalog_empty': 'Каталог порожній',
    'games.no_games_status': 'Немає ігор із цим статусом',
    'games.try_filter': 'Спробуйте інший фільтр або додайте нові ігри.',
    'games.come_later': 'Поверніться пізніше, коли адміністратор додасть першу гру!',
    'games.language': 'Original Language',
    'games.status': 'Translation Status',
    'games.description': 'Description',
    'games.no_localizations': 'Локалізацій ще немає',
    'games.sign_in': 'Увійдіть',
    'games.download': 'Завантажити',
    'games.downloading_button': '⏬ Завантаження...',
    'games.downloading': 'Завантаження локалізації для "{title}"...',
    'games.edit': 'Редагувати',
    'games.delete': 'Видалити',
    'games.delete_error': 'Не вдалося видалити гру',
    'games.delete_confirm_prefix': 'Ви впевнені, що хочете видалити',
    
    // Teams
    'teams.title': 'Список команд',
    'teams.create': '➕ Створити команду',
    'teams.empty': 'Команд ще немає',
    'teams.view_details': 'Переглянути деталі →',
    'teams.verified': 'ПІДТВЕРДЖЕНО',
    'teams.email': 'Ел. пошта',
    'teams.loading': '📺 Пошук сигналу...',
    'teams.following': '🔔 Відстежую',
    'teams.follow': '🔕 Відстежувати',
    'teams.no_description': 'Без опису',
    'teams.first_team': 'Будьте першим, хто створить команду!',
    
    // Team Details
    'team_details.back': '← Назад до команд',
    'team_details.members': 'Учасники',
    'team_details.projects': 'Проєкти',
    'team_details.about': 'Про команду',
    'team_details.no_description': 'Опис відсутній',
    'team_details.join': '🚀 Хочете приєднатися?',
    'team_details.join_button': '➕ Приєднатися',
    'team_details.pending': '✅ Запит очікує перевірки',
    'team_details.requests': '📋 Запити на приєднання',
    'team_details.not_found': '❌ Команду не знайдено',
    'team_details.deleted': 'Команду, ймовірно, видалено.',
    'team_details.status': 'Статус',
    'team_details.loading': '📺 Пошук сигналу...',
    'team_details.approve': '✅ Підтвердити',
    'team_details.reject': '❌ Відхилити',
    'team_details.loading_requests': '📺 Завантаження запитів...',
    'team_details.no_requests': 'Запитів немає',
    'team_details.submitted': 'Надіслано',
    'team_details.processed': 'Оброблено',
    
    // Add Game
    'add_game.title': 'Додати нову',
    'add_game.title_game': 'ГРУ до каналу',
    'add_game.input_title': '⚡ Назва',
    'add_game.input_language': '🌐 Оригінальна мова',
    'add_game.input_status': '📊 Статус перекладу',
    'add_game.input_description': '📝 Опис',
    'add_game.button': '✨ Створити гру',
    'add_game.cover_url': '🖼️ URL обкладинки',
    'add_game.cover_hint': 'Необов’язково: вкажіть пряме посилання на обкладинку гри',
    'add_game.title_required': 'Назва гри обов’язкова!',
    'add_game.description_required': 'Опис гри обов’язковий!',
    'add_game.creating': '⏳ Створення...',
    'add_game.success': '✅ Гру "{title}" успішно додано! 🎮',
    'add_game.error': 'Не вдалося додати гру. Спробуйте ще раз.',
    
    // Add Team
    'add_team.title': 'Зареєструвати КОМАНДУ у списку',
    'add_team.input_name': '👥 Назва команди',
    'add_team.input_description': '📝 Опис',
    'add_team.input_email': '📧 Контактна пошта',
    'add_team.button': '✨ Створити команду',
    'add_team.note': 'Після реєстрації ваша команда чекатиме на перевірку адміністратором. Після схвалення можна буде набирати учасників!',
    'add_team.name_required': 'Назва команди обов’язкова!',
    'add_team.email_invalid': 'Будь ласка, введіть коректну адресу електронної пошти!',
    'add_team.creating': '⏳ Реєстрація...',
    'add_team.success': '✅ Команду "{name}" успішно зареєстровано! 🚀',
    'add_team.error': 'Не вдалося зареєструвати команду.',
    
    // Add Localization
    'add_localization.title': 'Додати новий ПЕРЕКЛАД для гри',
    'add_localization.language': '🌐 Мова перекладу',
    'add_localization.team': '👥 Команда локалізації',
    'add_localization.status': '📊 Статус перекладу',
    'add_localization.button': '✨ Прив’язати переклад',
    'add_localization.select_team': 'Будь ласка, оберіть команду',
    'localization.no_team': 'Без команди',
    'add_localization.loading': '⏳ Завантаження...',
    'add_localization.saving': '⏳ Збереження...',
    'add_localization.success': 'Переклад успішно прив’язано до гри #{gameId}!',
    'add_localization.error': 'Не вдалося зберегти переклад.',

    // Edit Game
    'edit_game.title': 'Редагувати гру',
    'edit_game.title_game': 'ГРУ у каналі',
    'edit_game.loading': '⏳ Завантаження гри...',
    'edit_game.update': '✨ Оновити гру',
    'edit_game.updating': '⏳ Оновлення...',
    'edit_game.cancel': 'Скасувати',
    'edit_game.title_required': 'Назва гри обов’язкова!',
    'edit_game.description_required': 'Опис гри обов’язковий!',
    'edit_game.success': '✅ Гру "{title}" успішно оновлено! 🎮',
    'edit_game.error': 'Не вдалося оновити гру. Спробуйте ще раз.',
    'edit_game.loading_error': 'Не вдалося завантажити гру. Спробуйте ще раз.',
    
    // API Tester
    'api_tester.subtitle': 'Ручне тестування JWT-аутентифікації та авторизації',
    'api_tester.status': 'Статус',
    'api_tester.authenticated_as': 'Авторизовано як',
    'api_tester.role': 'Роль',
    'api_tester.token': 'Токен',
    'api_tester.not_authenticated_short': 'Не виконено вхід. Увійдіть для повного тестування.',
    'api_tester.not_authenticated': 'Не автентифіковано! Потрібен вхід.',
    'api_tester.public_success': '✅ Успіх! Отримано {count} ігор',
    'api_tester.team_created': '✅ Успіх! Команду створено:',
    'api_tester.game_created': '✅ Успіх! Гру створено (у вас є права Admin):',
    'api_tester.token_expired': '❌ Термін дії токена минув (401)',
    'api_tester.access_denied': '❌ Доступ заборонено (403)! Ваша роль: {role}. Потрібно: Admin',
    'api_tester.test_public': 'Тест: GET /api/games',
    'api_tester.test_protected': 'Тест: POST /api/teams',
    'api_tester.test_admin': 'Тест: POST /api/games (Admin)',
    'api_tester.clear_results': 'Очистити результати',
    'api_tester.show_data': 'Показати дані',
    'api_tester.results_placeholder': 'Результати з’являться тут...',
    'api_tester.button': 'API Тестер',

    // Common
    'common.loading': '⏳ Завантаження...',
    'common.saving': '⏳ Збереження...',
    'common.error': '❌ Помилка',
    'common.success': '✅ Успішно',
    'common.searching_signal': '📺 Пошук сигналу...',
    'common.loading_requests': '📺 Завантаження запитів...',
    'common.not_found': 'Не знайдено',
    'common.no_description': 'Без опису',
    'common.loading_text': '⏳ Завантаження...',
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
    'register.email_required': 'Email is required',
    'register.email_invalid': 'Invalid email format',
    'register.password_required': 'Password is required',
    
    // Games
    'games.title': 'Games in Channel',
    'games.add': '➕ Add Game',
    'games.empty': 'No Games Yet',
    'games.loading_title': 'Loading Game Catalog',
    'games.loading_subtitle': 'from the Midnight Channel...',
    'games.count_ready': '📺 {count} {word} ready for translation',
    'games.no_games_admin': '📭 No games yet. Admin must add the first game.',
    'games.filter_label': 'Filter by status',
    'games.fetching_covers': '🎨 Auto-fetch Missing Covers',
    'games.fetching_covers_loading': '⏳ Fetching Covers...',
    'games.cover_results_processed': 'Processed: {successful}/{total} ✅ | Failed: {failed} ⚠️',
    'games.catalog_empty': 'Catalog Empty',
    'games.no_games_status': 'No games with this status',
    'games.try_filter': 'Try another filter or add new games.',
    'games.come_later': 'Come back later when the admin adds the first game!',
    'games.language': 'Original Language',
    'games.status': 'Translation Status',
    'games.description': 'Description',
    'games.no_localizations': 'No localizations yet',
    'games.sign_in': 'Sign in',
    'games.download': 'Download',
    'games.downloading_button': '⏬ Downloading...',
    'games.downloading': 'Downloading localization for "{title}"...',
    'games.edit': 'Edit',
    'games.delete': 'Delete',
    'games.delete_error': 'Failed to delete game',
    'games.delete_confirm_prefix': 'Are you sure you want to delete',
    
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
    'localization.no_team': 'No team',

    // Edit Game
    'edit_game.title': 'Edit Game',
    'edit_game.title_game': 'GAME in Channel',
    'edit_game.loading': '⏳ Loading game...',
    'edit_game.update': '✨ Update Game',
    'edit_game.updating': '⏳ Updating...',
    'edit_game.cancel': 'Cancel',
    'edit_game.title_required': 'Game title is required!',
    'edit_game.description_required': 'Game description is required!',
    'edit_game.success': '✅ Game "{title}" updated successfully! 🎮',
    'edit_game.error': 'Failed to update game. Please try again.',
    'edit_game.loading_error': 'Failed to load game. Please try again.',
    
    // API Tester
    'api_tester.subtitle': 'Manual JWT authentication and authorization testing',
    'api_tester.status': 'Status',
    'api_tester.authenticated_as': 'Authenticated as',
    'api_tester.role': 'Role',
    'api_tester.token': 'Token',
    'api_tester.not_authenticated_short': 'Not authenticated. Login for full testing.',
    'api_tester.not_authenticated': 'Not authenticated! Login required.',
    'api_tester.public_success': '✅ Success! Retrieved {count} games',
    'api_tester.team_created': '✅ Success! Team created:',
    'api_tester.game_created': '✅ Success! Game created (you have Admin rights):',
    'api_tester.token_expired': '❌ Token expired (401)',
    'api_tester.access_denied': '❌ Access Denied (403)! Your role: {role}. Required: Admin',
    'api_tester.test_public': 'Test: GET /api/games',
    'api_tester.test_protected': 'Test: POST /api/teams',
    'api_tester.test_admin': 'Test: POST /api/games (Admin)',
    'api_tester.clear_results': 'Clear Results',
    'api_tester.show_data': 'Show Data',
    'api_tester.results_placeholder': 'Results will appear here...',
    'api_tester.button': 'API Tester',
    
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
