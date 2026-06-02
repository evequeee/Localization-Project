# Ukrainian Localization Platform | Localization Project | Midnight

A comprehensive web platform and community created to unite Ukrainian teams of translators, editors, and gamers. The project aims to provide users with features such as: tracking the translation status of games, filtering by translation status, subscribing to translations/teams, the ability to support translation teams, and more.

## Tech Stack
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

## Already Implemented

### Backend
- [x] Basic database architecture (Code-First)
- [x] PostgreSQL connection
- [x] CRUD operations for game catalog (GET, POST, PUT, DELETE)
- [x] Game filtering by translation status
- [x] `Localization` entity for managing game localizations
- [x] `LocalizationTeam` entity for translator teams
- [x] `TeamJoinRequest` entity for team join requests
- [x] M:N relationships between localizations and teams
- [x] DTO pattern for database model isolation
- [x] Strict input validation (FluentValidation)
- [x] Endpoints for translator team management (GET, POST, GET by ID)
- [x] Endpoints for team join requests (POST, GET, PATCH)
- [x] Endpoints for game localization management (POST, GET)
- [x] Endpoint for assigning teams to localizations
- [x] **JWT Authentication:** Tokens, registration, login, authorization
- [x] **RBAC (Role-Based Access Control):** Admin, TeamAdmin, User roles with endpoint access checks
- [x] **Seed Data:** Automatic test Admin user creation

### Frontend
- [x] React components with Persona 4 Golden design
- [x] Routing: public and protected routes with role checking
- [x] React Context API for authentication management (AuthContext)
- [x] Custom useAuth hook for accessing auth state
- [x] ProtectedRoute component with redirect for unauthorized users
- [x] ErrorBoundary component for error handling
- [x] Pages: Login, Register, Home, GamesList, Teams, AddGame, AddLocalization, AddTeam
- [x] **CRUD Forms with proper handling:**
  - Loading state on button (disabled on submit)
  - Error banners for displaying errors
  - Success messages for action confirmation
  - Form clearing after successful creation
  - Delayed navigation for showing success message
- [x] **API Tester page** (for administrators) for manual JWT and authorization testing
- [x] **Floating API Tester button** at bottom left (visible only for Admin)
- [x] Automatic JWT token addition to all requests (fetch interceptor)
- [x] 401/403 error handling with redirect to login

## API Endpoints (Authentication)

| HTTP Method | Route | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user | `{ email, password }` | `{ token, user: { id, email, role } }` |
| **POST** | `/api/auth/login` | User login | `{ email, password }` | `{ token, user: { id, email, role } }` |

### User Roles and Access Rights

| Role | Access | Actions |
| :--- | :--- | :--- |
| **User** | Basic access | View games, teams, delete own join requests |
| **TeamAdmin** | Team administrator | Same as User + update games + manage team join requests |
| **Admin** | Super administrator | Everything: create/delete games and teams, manage localizations |
| **Guest** | No authentication | Only public pages (Home, /login, /register) |

## Development Setup

### Backend Run
```bash
cd LocalizationProject
dotnet run
# API available at http://localhost:5169
```

### Frontend Run
```bash
cd frontend
npm install
npm run dev
# Frontend available at http://localhost:5173 (or 5174, 5175 if ports are busy)
```

### Docker Run (both services)
```bash
docker-compose up --build
# Backend: http://localhost:5169
# Frontend will be available at http://localhost:3000 (if configured in Dockerfile)
```

## API Endpoints (Games)

| HTTP Method | Route | Description | Authorization | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/games` | Get list of all games (with `?status=` filtering) | Public | - |
| **GET** | `/api/games/{id}` | Get details of a specific game by ID | Public | - |
| **POST** | `/api/games` | Add a new game to catalog | Admin | `CreateGameDto` (JSON) |
| **PUT** | `/api/games/{id}` | Update information about an existing game | Admin, TeamAdmin | `UpdateGameDto` (JSON) |
| **DELETE** | `/api/games/{id}` | Delete game from catalog | Admin | - |

## API Endpoints (Teams)

| HTTP Method | Route | Description | Authorization | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/teams` | Get list of all teams | Public | - |
| **GET** | `/api/teams/{teamId}` | Get team details by ID | Public | - |
| **POST** | `/api/teams` | Add a new team | Admin | `CreateTeamDto` (JSON) |
| **POST** | `/api/teams/{teamId}/requests` | Create a team join request | User (Authorize) | - |
| **GET** | `/api/teams/{teamId}/requests` | Get team join requests | TeamAdmin, Admin | - |
| **PATCH** | `/api/teams/requests/{requestId}` | Approve/reject team join request | TeamAdmin, Admin | `UpdateTeamJoinRequestDto` (JSON) |

## API Endpoints (Localizations)

| HTTP Method | Route | Description | Authorization | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/localizations` | Get all localizations with their teams | Public | - |
| **POST** | `/api/localizations` | Create a new localization for a game | Admin | `CreateLocalizationDto` (JSON) |
| **POST** | `/api/localizations/{locId}/teams/{teamId}` | Assign team to localization | Admin, TeamAdmin | - |

> **Important:** 
> - POST and PUT requests undergo strict validation. For incorrect data, the server returns `400 Bad Request` with error details.
> - All operations require JWT token in the `Authorization: Bearer {token}` header
> - Requests without token or with expired token return `401 Unauthorized`
> - Requests with insufficient permissions return `403 Forbidden`
> - Automatic redirect to `/login` on 401 error

## Quick Start (Docker)

```bash
docker-compose up --build
```

After that:
- **API (Backend)** available at: http://localhost:5169
- **Frontend** developed locally at http://localhost:5173

## Testing

### Admin API Testing (API Tester)
1. Login as Admin: `admin@test.com` / `Admin123!`
2. Click the floating 🧪 button at bottom left
3. Go to `/api-tester` page
4. Test three types of requests:
   - **🔓 Public request** (GET /api/games) - works without token
   - **🔒 Protected request** (POST /api/teams) - requires token
   - **👑 Admin request** (POST /api/games) - requires Admin role

### Test Accounts
| Email | Password | Role |
| :--- | :--- | :--- |
| `admin@test.com` | `Admin123!` | Admin |

> Test data is automatically created on first backend run