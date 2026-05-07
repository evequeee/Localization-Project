import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { GamesList } from './pages/GamesList';
import { Teams } from './pages/Teams';
import { AddGame } from './pages/AddGame';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-p4black text-white selection:bg-p4yellow selection:text-p4black font-sans">
        <Navbar />

        <main className="max-w-7xl mx-auto relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<GamesList />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/add-game" element={<AddGame />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;