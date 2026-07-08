# Ukrainian Localization Platform | Localization Project | Midnight

A comprehensive web platform and community created to unite Ukrainian teams of translators, editors, and gamers. The project currently covers game tracking, filtering and search by translation status, game details with comments and likes, team management, localization assignment, and admin moderation tools.

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
- [x] Game filtering and search by translation status/title
- [x] Game details endpoint with comments and likes
- [x] Game cover auto-fetch endpoint for missing images
- [x] `Localization` entity for managing game localizations
- [x] `LocalizationTeam` entity for translator teams
- [x] `TeamJoinRequest` entity for team join requests
- [x] `Comment` and `GameLike` entities for game community interaction
- [x] M:N relationships between localizations and teams
- [x] DTO pattern for database model isolation
- [x] Strict input validation (FluentValidation)
- [x] Endpoints for translator team management (GET, POST, GET by ID)
- [x] Endpoints for team join requests (POST, GET, PATCH)
- [x] Endpoints for game localization management (POST, GET)
- [x] Endpoint for assigning teams to localizations
- [x] Localization target update deadline support
- [x] **JWT Authentication:** Tokens, registration, login, authorization
- [x] **RBAC (Role-Based Access Control):** Admin, TeamAdmin, User roles with endpoint access checks
- [x] **Seed Data:** Automatic test Admin user creation
- [x] **Team Approval Workflow:** New teams require admin approval before being visible
- [x] **Team Dashboard:** Endpoint for team owners and members to view team data
- [x] **Admin Panel:** Endpoints for moderating pending teams (approve/reject)
- [x] **Team Requests:** Endpoints for approving/rejecting team join requests

### Frontend

- [x] React components with Persona 4 Golden design
- [x] Routing: public and protected routes with role checking
- [x] React Context API for authentication management (AuthContext)
- [x] Custom useAuth hook for accessing auth state
- [x] ProtectedRoute component with redirect for unauthorized users
- [x] ErrorBoundary component for error handling
- [x] Pages: Login, Register, Home, GamesList, GameDetails, Teams, TeamDetails, TeamDashboard, AddGame, EditGame, AddLocalization, AddTeam, AdminPanel, ApiTesterPage
- [x] **CRUD Forms with proper handling:**
  - Loading state on button (disabled on submit)
  - Error banners for displaying errors
  - Success messages for action confirmation
  - Form clearing after successful creation
  - Delayed navigation for showing success message
- [x] **API Tester page** (for administrators) for manual JWT and authorization testing
- [x] **Floating API Tester button** at bottom left (visible only for Admin)
- [x] Game list search and translation-status filtering UI
- [x] Game details UI with cover, comments, and likes
- [x] Game edit UI for Admin users
- [x] Game cover fetch action for Admin users
- [x] Automatic JWT token addition to all requests (fetch interceptor)
- [x] 401/403 error handling with redirect to login
- [x] **Team Dashboard:** View team projects, members, and join requests (for team owners and members)
- [x] **Admin Panel:** Moderate pending teams with approve/reject functionality
- [x] **Team Requests Panel:** Approve/reject team join requests with P4G-styled buttons
- [x] **Join Team Button:** Request to join teams with pending state indication
- [x] Language switcher for Ukrainian and English UI
- [x] **Improved Text Contrast:** Enhanced readability across all pages with proper text colors

## API Endpoints (Authentication)

| HTTP Method | Route                | Description         | Request Body          | Response                               |
| :---------- | :------------------- | :------------------ | :-------------------- | :------------------------------------- |
| **POST**    | `/api/auth/register` | Register a new user | `{ email, password }` | `{ token, user: { id, email, role } }` |
| **POST**    | `/api/auth/login`    | User login          | `{ email, password }` | `{ token, user: { id, email, role } }` |

### User Roles and Access Rights

| Role          | Access              | Actions                                                                                                  |
| :------------ | :------------------ | :------------------------------------------------------------------------------------------------------- |
| **User**      | Basic access        | View games and teams, add teams, join teams, comment/like games, delete own join requests                |
| **TeamAdmin** | Team administrator  | Same as User + update games, create localizations, manage team join requests                             |
| **Admin**     | Super administrator | Everything: create/delete games and teams, manage localizations, approve/reject teams, fetch game covers |
| **Guest**     | No authentication   | Only public pages (Home, /login, /register)                                                              |

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

| HTTP Method | Route                         | Description                                                      | Authorization    | Request Body              |
| :---------- | :---------------------------- | :--------------------------------------------------------------- | :--------------- | :------------------------ |
| **GET**     | `/api/games`                  | Get list of all games (with `?status=` and `?search=` filtering) | Public           | -                         |
| **GET**     | `/api/games/{id}/details`     | Get full game details with comments and likes                    | Public           | -                         |
| **GET**     | `/api/games/{id}`             | Get details of a specific game by ID                             | Public           | -                         |
| **POST**    | `/api/games`                  | Add a new game to catalog                                        | Admin            | `CreateGameDto` (JSON)    |
| **PUT**     | `/api/games/{id}`             | Update information about an existing game                        | Admin, TeamAdmin | `UpdateGameDto` (JSON)    |
| **DELETE**  | `/api/games/{id}`             | Delete game from catalog                                         | Admin            | -                         |
| **POST**    | `/api/games/fetch-covers`     | Fetch missing game covers automatically                          | Admin            | -                         |
| **POST**    | `/api/games/{id}/comments`    | Add a comment to a game                                          | Authorized user  | `CreateCommentDto` (JSON) |
| **POST**    | `/api/games/{id}/toggle-like` | Like or unlike a game                                            | Authorized user  | -                         |

## API Endpoints (Teams)

| HTTP Method | Route                                 | Description                                       | Authorization    | Request Body           |
| :---------- | :------------------------------------ | :------------------------------------------------ | :--------------- | :--------------------- |
| **GET**     | `/api/teams`                          | Get list of all approved teams                    | Public           | -                      |
| **GET**     | `/api/teams/{teamId}`                 | Get team details by ID                            | Public           | -                      |
| **POST**    | `/api/teams`                          | Add a new team (requires approval)                | User (Authorize) | `CreateTeamDto` (JSON) |
| **POST**    | `/api/teams/{id}/join`                | Request to join a team                            | User (Authorize) | -                      |
| **GET**     | `/api/teams/{id}/requests`            | Get pending join requests for a team              | TeamAdmin, Admin | -                      |
| **GET**     | `/api/teams/my-dashboard`             | Get team dashboard data (for team owners/members) | User (Authorize) | -                      |
| **POST**    | `/api/teams/requests/{reqId}/approve` | Approve a team join request                       | User (Authorize) | -                      |
| **POST**    | `/api/teams/requests/{reqId}/reject`  | Reject a team join request                        | User (Authorize) | -                      |

## API Endpoints (Localizations)

| HTTP Method | Route                                       | Description                                                               | Authorization    | Request Body                   |
| :---------- | :------------------------------------------ | :------------------------------------------------------------------------ | :--------------- | :----------------------------- |
| **GET**     | `/api/localizations`                        | Get all localizations with their teams                                    | Public           | -                              |
| **POST**    | `/api/localizations`                        | Create a new localization for a game, optionally with a team and deadline | Admin, TeamAdmin | `CreateLocalizationDto` (JSON) |
| **POST**    | `/api/localizations/{locId}/teams/{teamId}` | Assign team to localization                                               | Admin, TeamAdmin | -                              |

## API Endpoints (Admin)

| HTTP Method | Route                           | Description                                 | Authorization | Request Body |
| :---------- | :------------------------------ | :------------------------------------------ | :------------ | :----------- |
| **GET**     | `/api/admin/pending-teams`      | Get list of pending teams awaiting approval | Admin         | -            |
| **POST**    | `/api/admin/teams/{id}/approve` | Approve a pending team                      | Admin         | -            |
| **POST**    | `/api/admin/teams/{id}/reject`  | Reject a pending team (deletes it)          | Admin         | -            |
| **POST**    | `/api/admin/fix-legacy-teams`   | Fix legacy teams (set all to approved)      | Admin         | -            |

> **Important:**
>
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

| Email            | Password    | Role  |
| :--------------- | :---------- | :---- |
| `admin@test.com` | `Admin123!` | Admin |

> Test data is automatically created on first backend run
