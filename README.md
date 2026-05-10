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
- [x] **Аутентифікація:** JWT токени, реєстрація та вхід
- [x] **RBAC (Role-Based Access Control):** Ролі Root, TeamAdmin, User, Guest
- [x] **Frontend:** React компоненти з Persona 4 Golden дизайном
- [x] **Frontend Маршрутизація:** Публічні та захищені маршрути з перевіркою ролей
- [x] **Frontend Компоненти:** AuthContext, useAuth, ProtectedRoute, ErrorBoundary
- [x] **Frontend Сторінки:** Login, Register, Home, GamesList, Teams, AddGame, AddLocalization, AddTeam

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
# API доступне на http://localhost:8080
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
# Backend: http://localhost:8080
# Frontend буде доступне на http://localhost:3000 (якщо налаштовано в Dockerfile)
```

  ## API Ендпоінти (Games)

| HTTP Метод | Маршрут | Опис | Тіло запиту |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/games` | Отримати список усіх ігор (з фільтрацією `?status=`) | - |
| **GET** | `/api/games/{id}` | Отримати деталі конкретної гри за ID | - |
| **POST** | `/api/games` | Додати нову гру в каталог | `CreateGameDto` (JSON) |
| **PUT** | `/api/games/{id}` | Оновити інформацію про існуючу гру | `UpdateGameDto` (JSON) |
| **DELETE** | `/api/games/{id}` | Видалити гру з каталогу | - |

## API Ендпоінти (Teams)

| HTTP Метод | Маршрут | Опис | Тіло запиту |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/teams` | Отримати список усіх команд | - |
| **POST** | `/api/teams` | Додати нову команду | `CreateTeamDto` (JSON) |

## API Ендпоінти (Localizations)

| HTTP Метод | Маршрут | Опис | Тіло запиту |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/localizations` | Отримати всі локалізації з їхніми командами | - |
| **POST** | `/api/localizations` | Створити нову локалізацію для гри | `CreateLocalizationDto` (JSON) |
| **POST** | `/api/localizations/{locId}/teams/{teamId}` | Прив'язати команду до локалізації | - |

> **Важливо:** POST та PUT запити проходять сувору валідацію. При некоректних даних сервер повертає статус `400 Bad Request` із деталізацією помилок.

## Швидкий запуск (Docker)

```bash
docker-compose up --build
```

Після цього:
- **API (Backend)** буде доступне за адресою: http://localhost:8080
- **Frontend** розробляється локально на http://localhost:5173 (або далі)