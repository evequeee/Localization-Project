import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="bg-p4yellow text-p4black px-8 py-4 shadow-lg border-b-4 border-black flex justify-between items-center relative z-10">
      <div className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
        📺 <span className="transform -skew-x-12 inline-block">Localize</span><span className="font-light">DB</span>
      </div>
      
      <div className="flex gap-8 font-bold uppercase tracking-widest text-sm">
        <Link to="/" className="hover:text-white transition-colors duration-200">Головна</Link>
        <Link to="/games" className="hover:text-white transition-colors duration-200">Ігри</Link>
        <Link to="/teams" className="hover:text-white transition-colors duration-200">Команди</Link>
      </div>
    </nav>
  );
};