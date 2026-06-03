import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { FloatingApiTesterButton } from './components/FloatingApiTesterButton';
import { withProtection } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { GamesList } from './pages/GamesList';
import { GameDetails } from './pages/GameDetails';
import { Teams } from './pages/Teams';
import { TeamDetails } from './pages/TeamDetails';
import { TeamDashboard } from './pages/TeamDashboard';
import { AdminPanel } from './pages/AdminPanel';
import { AddGame } from './pages/AddGame';
import { EditGame } from './pages/EditGame';
import { AddLocalization } from './pages/AddLocalization';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AddTeam } from './pages/AddTeam';
import { ApiTesterPage } from './pages/ApiTesterPage';

// Обгортаємо сторінки з захистом за ролями
const ProtectedGamesList = withProtection(GamesList);
const ProtectedGameDetails = withProtection(GameDetails);
const ProtectedTeams = withProtection(Teams);
const ProtectedTeamDetails = withProtection(TeamDetails);
const ProtectedTeamDashboard = withProtection(TeamDashboard);
const ProtectedAdminPanel = withProtection(AdminPanel, ['Admin']);
const ProtectedAddTeam = withProtection(AddTeam);
const ProtectedAddGame = withProtection(AddGame, ['Admin']);
const ProtectedEditGame = withProtection(EditGame, ['Admin']);
const ProtectedAddLocalization = withProtection(AddLocalization, ['User', 'TeamAdmin', 'Admin']);
const ProtectedApiTester = withProtection(ApiTesterPage, ['Admin']);

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-p4-bg text-white selection:bg-p4-yellow selection:text-p4-bg font-sans">
          <Navbar />
          <FloatingApiTesterButton />

          <main className="relative">
            <Routes>
            {/* Публічні маршрути */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Захищені маршрути */}
              <Route path="/games" element={<ProtectedGamesList />} />
              <Route path="/games/:id" element={<ProtectedGameDetails />} />
              <Route path="/teams" element={<ProtectedTeams />} />
              <Route path="/team/:teamId" element={<ProtectedTeamDetails />} />
              <Route path="/team-dashboard" element={<ProtectedTeamDashboard />} />
              <Route path="/admin-panel" element={<ProtectedAdminPanel />} />
              <Route path="/add-team" element={<ProtectedAddTeam />} />
              <Route path="/add-game" element={<ProtectedAddGame />} />
              <Route path="/edit-game/:gameId" element={<ProtectedEditGame />} />
              <Route path="/add-localization/:gameId" element={<ProtectedAddLocalization />} />
              <Route path="/api-tester" element={<ProtectedApiTester />} />
            </Routes>
          </main>
        </div>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;