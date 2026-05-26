import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData.email, formData.password);
      navigate('/games');
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-p4-bg flex items-center justify-center p-4 relative p4-scanline">
      <div className="w-full max-w-md">
        
        {/* Title Section - Persona 4 Golden TV Style */}
        <div className="mb-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-p4-yellow text-p4-bg px-4 py-3 font-black 
                          transform -skew-x-6 text-5xl shadow-p4-lg">
              📺
            </div>
          </div>
          <h1 className="text-6xl font-black text-p4-white uppercase 
                        tracking-tighter p4-text-shadow mb-2">
            MIDNIGHT
          </h1>
          <p className="text-p4-gray font-black tracking-widest text-sm">
            ENTER THE CHANNEL
          </p>
          <div className="h-2 bg-gradient-to-r from-p4-yellow via-p4-accent to-transparent 
                        w-48 mx-auto mt-6"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="relative">
          {/* Shadow layer */}
          <div className="absolute inset-0 bg-black transform -skew-x-2 translate-x-3 translate-y-3 -z-10"></div>

          {/* Main form box */}
          <div className="bg-p4-dark border-4 border-p4-white transform -skew-x-1 
                        p-8 shadow-p4-xl relative z-10">
            
            {/* Decorative corner */}
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-p4-yellow 
                          border-2 border-p4-yellow"></div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-900 border-4 border-red-600 text-white p-4 
                            font-black uppercase tracking-widest text-sm transform -skew-x-1">
                ⚠️ {error}
              </div>
            )}

            <div className="flex flex-col gap-6">
              
              {/* Email Field */}
              <div className="flex flex-col">
                <label className="text-p4-yellow font-black uppercase tracking-widest text-sm mb-3">
                  📧 Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  disabled={loading}
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="p4-input"
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col">
                <label className="text-p4-yellow font-black uppercase tracking-widest text-sm mb-3">
                  🔐 Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  disabled={loading}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="p4-input"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="p4-button-yellow text-lg mt-4 hover:shadow-p4-xl
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Logging in...' : '🚀 Enter'}
              </button>
            </div>

            {/* Register Link */}
            <div className="mt-8 pt-6 border-t-2 border-p4-gray text-center">
              <p className="text-p4-gray font-black uppercase tracking-widest text-xs mb-4">
                No Account Yet?
              </p>
              <Link
                to="/register"
                className="inline-block p4-button text-sm hover:bg-p4-yellow 
                          hover:border-p4-yellow hover:text-p4-bg"
              >
                ✨ Join
              </Link>
            </div>

          </div>
        </form>

        {/* Footer */}
        <div className="mt-12 text-center text-p4-gray font-black uppercase 
                      tracking-tighter text-xs">
          v1.0 · MIDNIGHT CHANNEL
        </div>
      </div>

      {/* Background decorations */}
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-p4-yellow opacity-5 
                     transform skew-x-12 -z-10 pointer-events-none"></div>
    </div>
  );
};
