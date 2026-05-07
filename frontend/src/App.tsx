import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { withProtection } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { GamesList } from './pages/GamesList';
import { Teams } from './pages/Teams';
import { AddGame } from './pages/AddGame';
import { AddLocalization } from './pages/AddLocalization';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AddTeam } from './pages/AddTeam';

// Обгортаємо сторінки з захистом за ролями
const ProtectedGamesList = withProtection(GamesList);
const ProtectedTeams = withProtection(Teams);
const ProtectedAddTeam = withProtection(AddTeam);
const ProtectedAddGame = withProtection(AddGame, ['Root', 'TeamAdmin']);
const ProtectedAddLocalization = withProtection(AddLocalization, ['User', 'TeamAdmin', 'Root']);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-p4black text-white selection:bg-p4yellow selection:text-p4black font-sans">
          <Navbar />

          <main className="max-w-7xl mx-auto relative">
            <Routes>
              {/* Публічні маршрути */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Захищені маршрути */}
              <Route path="/games" element={<ProtectedGamesList />} />
              <Route path="/teams" element={<ProtectedTeams />} />
              <Route path="/add-team" element={<ProtectedAddTeam />} />
              <Route path="/add-game" element={<ProtectedAddGame />} />
              <Route path="/add-localization/:gameId" element={<ProtectedAddLocalization />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;