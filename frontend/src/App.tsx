import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { FloatingApiTesterButton } from './components/FloatingApiTesterButton';
import { withProtection } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { GamesList } from './pages/GamesList';
import { Teams } from './pages/Teams';
import { TeamDetails } from './pages/TeamDetails';
import { AddGame } from './pages/AddGame';
import { AddLocalization } from './pages/AddLocalization';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AddTeam } from './pages/AddTeam';
import { ApiTesterPage } from './pages/ApiTesterPage';

// Обгортаємо сторінки з захистом за ролями
const ProtectedGamesList = withProtection(GamesList);
const ProtectedTeams = withProtection(Teams);
const ProtectedTeamDetails = withProtection(TeamDetails);
const ProtectedAddTeam = withProtection(AddTeam);
const ProtectedAddGame = withProtection(AddGame, ['Admin']);
const ProtectedAddLocalization = withProtection(AddLocalization, ['User', 'TeamAdmin', 'Admin']);
const ProtectedApiTester = withProtection(ApiTesterPage, ['Admin']);

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-p4black text-white selection:bg-p4yellow selection:text-p4black font-sans">
          <Navbar />
          <FloatingApiTesterButton />

          <main className="max-w-7xl mx-auto relative">
            <Routes>
            {/* Публічні маршрути */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Захищені маршрути */}
              <Route path="/games" element={<ProtectedGamesList />} />
              <Route path="/teams" element={<ProtectedTeams />} />
              <Route path="/team/:teamId" element={<ProtectedTeamDetails />} />
              <Route path="/add-team" element={<ProtectedAddTeam />} />
              <Route path="/add-game" element={<ProtectedAddGame />} />
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