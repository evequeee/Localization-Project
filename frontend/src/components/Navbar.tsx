import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleBasedRender } from './ProtectedRoute';

export const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-p4yellow text-p4black px-8 py-4 shadow-lg border-b-4 border-black flex justify-between items-center relative z-10">
      <div className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
        📺 <span className="transform -skew-x-12 inline-block">Localize</span><span className="font-light">DB</span>
      </div>
      
      <div className="flex items-center gap-8 font-bold uppercase tracking-widest text-sm">
        <Link to="/" className="hover:text-white transition-colors duration-200">Головна</Link>
        
        {isAuthenticated && user ? (
          <>
            <Link to="/games" className="hover:text-white transition-colors duration-200">Ігри</Link>
            
            {/* Кнопка "Додати гру" - тільки для Admin */}
            <RoleBasedRender
              requiredRoles={['Admin']}
              fallback={null}
            >
              <Link 
                to="/add-game" 
                className="bg-p4black text-p4yellow px-4 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors duration-200 font-bold"
              >
                + Гра
              </Link>
            </RoleBasedRender>
            
            {/* Кнопка "Додати команду" */}
            <Link 
              to="/add-team" 
              className="bg-p4black text-p4yellow px-4 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors duration-200 font-bold"
            >
              + Команда
            </Link>

            <span className="text-p4black">👤 {user.email}</span>
            
            {/* Ролі користувача - для відладки */}
            <span className="text-xs bg-p4black text-p4yellow px-2 py-1 border border-p4black rounded">
              {user.role}
            </span>
            
            <button 
              onClick={handleLogout}
              className="bg-p4black text-p4yellow px-4 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors duration-200"
            >
              Вихід
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-p4black text-p4yellow px-4 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors duration-200">
              Вхід
            </Link>
            <Link to="/register" className="bg-p4black text-p4yellow px-4 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors duration-200">
              Реєстр
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};