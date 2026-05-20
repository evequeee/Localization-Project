# Платформа-форум українських локалізацій | Localization Project

Комплексна веб-платформа та спільнота, створена для об'єднання українських команд перекладачів, редакторів та гравців. Проєкт має мету надати користувачам такі функції як: відстежування статусу перекладу ігор, фільтрація по статусу перекладу, підписка на переклад/команду, можливість підтримати команду перекладачів та інші.

## Технологічний стек
- **Backend:** ASP.NET Core Web API (.NET 10)
- **Database:** PostgreSQL + Entity Framework Core
- **Validation:** FluentValidation
- **Architecture:** DTO (Data Transfer Objects)
- **Authentication:** JWT (JSON Web Tokens), ASP.NET Core Identity
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Routing:** React Router v7
- **Infrastructure:** Docker, Docker Compose

## Вже реалізовано

### Backend
- [x] Базова архітектура бази даних (Code-First)
- [x] Підключення до PostgreSQL
- [x] CRUD операції для каталогу ігор (GET, POST, PUT, DELETE)
- [x] Фільтрація ігор за статусом перекладу
- [x] Сутність `Localization` для управління локалізаціями ігор
- [x] Сутність `LocalizationTeam` для команд перекладачів
- [x] Відношення M:N між локалізаціями та командами
- [x] Патерн DTO для ізоляції моделей бази даних
- [x] Строга валідація вхідних даних (FluentValidation)
- [x] Ендпоінти для управління командами перекладачів (GET, POST)
- [x] Ендпоінти для управління локалізаціями ігор (POST, GET)
- [x] Ендпоінт для прив'язування команд до локалізацій
- [x] **JWT Аутентифікація:** Токени, реєстрація, вхід, авторизація
- [x] **RBAC (Role-Based Access Control):** Ролі Admin, User, Guest з перевіркою доступу на ендпоінтах
- [x] **Seed Data:** Автоматичне створення тестового Admin користувача

### Frontend
- [x] React компоненти з Persona 4 Golden дизайном
- [x] Маршрутизація: публічні та захищені маршрути з перевіркою ролей
- [x] React Context API для управління аутентифікацією (AuthContext)
- [x] Кастомний hook useAuth для доступу до auth стану
- [x] ProtectedRoute компонент з редіректом неавторизованих користувачів
- [x] ErrorBoundary компонент для ловлення помилок
- [x] Сторінки: Login, Register, Home, GamesList, Teams, AddGame, AddLocalization, AddTeam
- [x] **CRUD Форми з правильною обробкою:**
  - Loading state на кнопці (блокування при відправці)
  - Error banners для виведення помилок
  - Success messages для підтвердження дій
  - Очистка форми після успішного створення
  - Затримана навігація для показу success повідомлення
- [x] **API Tester сторінка** (адміністратору) для ручного тестування JWT та авторизації
- [x] **Плаваюча кнопка API Tester** внизу зліва (видима тільки для Admin)
- [x] Автоматичне додавання JWT токена до всіх запитів (fetch interceptor)
- [x] Обробка 401/403 помилок з редіректом на login

## API Ендпоінти (Authentication)

| HTTP Метод | Маршрут | Опис | Тіло запиту | Відповідь |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Реєстрація нового користувача | `{ email, password }` | `{ token, user: { id, email, role } }` |
| **POST** | `/api/auth/login` | Вхід користувача | `{ email, password }` | `{ token, user: { id, email, role } }` |

### Ролі користувачів та права доступу

| Роль | Доступ | Дії |
| :--- | :--- | :--- |
| **Guest** | Публічні сторінки | Переглядання Home, /login, /register |
| **User** | Базовий доступ | Переглядання ігор, команд, додавання перекладів |
| **TeamAdmin** | Адміністратор команди | Ті ж, що й у User + додавання ігор для своєї команди |
| **Root** | Суперадміністратор | Все + управління всіма даними |

## Налаштування розробки

### Backend запуск
```bash
cd LocalizationProject
dotnet run
# API доступне на http://localhost:5169
```

### Frontend запуск
```bash
cd frontend
npm install
npm run dev
# Frontend доступне на http://localhost:5173 (або 5174, 5175 якщо порти зайняті)
```

### Docker запуск (обидва сервіси)
```bash
docker-compose up --build
# Backend: http://localhost:5169
# Frontend буде доступне на http://localhost:3000 (якщо налаштовано в Dockerfile)
```

## API Ендпоінти (Games)

| HTTP Метод | Маршрут | Опис | Авторизація | Тіло запиту |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/games` | Отримати список усіх ігор (з фільтрацією `?status=`) | Публічна | - |
| **GET** | `/api/games/{id}` | Отримати деталі конкретної гри за ID | Публічна | - |
| **POST** | `/api/games` | Додати нову гру в каталог | Admin | `CreateGameDto` (JSON) |
| **PUT** | `/api/games/{id}` | Оновити інформацію про існуючу гру | Admin, TeamAdmin | `UpdateGameDto` (JSON) |
| **DELETE** | `/api/games/{id}` | Видалити гру з каталогу | Admin | - |

## API Ендпоінти (Teams)

| HTTP Метод | Маршрут | Опис | Авторизація | Тіло запиту |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/teams` | Отримати список усіх команд | Публічна | - |
| **POST** | `/api/teams` | Додати нову команду | Admin | `CreateTeamDto` (JSON) |

## API Ендпоінти (Localizations)

| HTTP Метод | Маршрут | Опис | Авторизація | Тіло запиту |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/localizations` | Отримати всі локалізації з їхніми командами | Публічна | - |
| **POST** | `/api/localizations` | Створити нову локалізацію для гри | Admin | `CreateLocalizationDto` (JSON) |
| **POST** | `/api/localizations/{locId}/teams/{teamId}` | Прив'язати команду до локалізації | Admin, TeamAdmin | - |

> **Важливо:** 
> - POST та PUT запити проходять сувору валідацію. При некоректних даних сервер повертає статус `400 Bad Request` із деталізацією помилок.
> - Усі операції вимагають наявність JWT токена у заголовку `Authorization: Bearer {token}`
> - Запити без токена або з протермінованим токеном повертають `401 Unauthorized`
> - Запити з недостатніми правами повертають `403 Forbidden`
> - Автоматичний редірект на `/login` при 401 помилці

## Швидкий запуск (Docker)

```bash
docker-compose up --build
```

Після цього:
- **API (Backend)** буде доступне за адресою: http://localhost:5169
- **Frontend** розробляється локально на http://localhost:5173 (або далі)

## Тестування

### Admin Тестування API (API Tester)
1. Залогіньтеся як Admin: `admin@test.com` / `Admin123!`
2. Натисніть на плаваючу кнопку 🧪 внизу зліва
3. Перейдіть на сторінку `/api-tester`
4. Тестуйте три типи запитів:
   - **🔓 Публічний запит** (GET /api/games) - працює без токена
   - **🔒 Захищений запит** (POST /api/teams) - потребує токена
   - **👑 Admin запит** (POST /api/games) - потребує Admin ролі

### Тестові облікові записи
| Email | Пароль | Роль |
| :--- | :--- | :--- |
| `admin@test.com` | `Admin123!` | Admin |

> Тестові дані автоматично створюються при першому запуску бекенду