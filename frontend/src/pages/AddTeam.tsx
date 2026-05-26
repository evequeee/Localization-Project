import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../services/api';

export const AddTeam = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contactEmail: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.name.trim()) {
      setError('Team name is required!');
      setLoading(false);
      return;
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      setError('Please enter a valid email address!');
      setLoading(false);
      return;
    }

    try {
      await apiPost('/api/teams', formData);

      setSuccess(`✅ Team "${formData.name}" registered successfully! 🚀`);

      setFormData({
        name: '',
        description: '',
        contactEmail: ''
      });

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/teams');
      }, 1500);
    } catch (err: any) {
      console.error('Error adding team:', err);
      setError(err.message || 'Failed to register team.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-p4-bg p-8 p4-scanline">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-black text-p4-white uppercase 
                        tracking-tighter p4-text-shadow mb-2">
            Register
          </h1>
          <div className="flex items-center gap-3">
            <div className="bg-p4-yellow text-p4-bg px-4 py-2 font-black 
                          transform -skew-x-6 shadow-p4">
              TEAM
            </div>
            <h2 className="text-4xl font-black text-p4-gray uppercase">To Roster</h2>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative">
          {/* Shadow layer */}
          <div className="absolute inset-0 bg-black transform -skew-x-2 translate-x-2 translate-y-2 -z-10"></div>

          {/* Main form box */}
          <div className="bg-p4-dark border-4 border-p4-white transform -skew-x-1 
                        p-8 shadow-p4-xl relative z-10">
            
            {/* Corner accent */}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-p4-yellow 
                          border-2 border-p4-yellow"></div>

            {/* Error */}
            {error && (
              <div className="mb-6 bg-red-900 border-4 border-red-600 text-white p-4 
                            font-black uppercase tracking-widest text-sm transform -skew-x-1">
                ⚠️ {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-6 bg-green-900 border-4 border-green-600 text-white p-4 
                            font-black uppercase tracking-widest text-sm transform -skew-x-1">
                {success}
              </div>
            )}

            <div className="flex flex-col gap-8">

              {/* Team Name */}
              <div className="flex flex-col">
                <label className="text-p4-yellow font-black uppercase tracking-widest 
                               text-sm mb-3">👥 Team Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  disabled={loading}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Dragon Slayers Localization"
                  className="p4-input"
                />
              </div>

              {/* Team Description */}
              <div className="flex flex-col">
                <label className="text-p4-yellow font-black uppercase tracking-widest 
                               text-sm mb-3">📝 Description</label>
                <textarea
                  name="description"
                  disabled={loading}
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your team, specialization, experience..."
                  className="p4-input resize-none"
                />
              </div>

              {/* Contact Email */}
              <div className="flex flex-col">
                <label className="text-p4-yellow font-black uppercase tracking-widest 
                               text-sm mb-3">📧 Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  disabled={loading}
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="contact@yourteam.com"
                  className="p4-input"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="p4-button-yellow text-lg hover:shadow-p4-xl
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Registering...' : '✨ Create Team'}
              </button>
            </div>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 relative">
          <div className="absolute inset-0 bg-black transform -skew-x-2 translate-x-1 translate-y-1 -z-10"></div>
          <div className="bg-p4-dark border-4 border-p4-yellow p-6 transform -skew-x-1 relative z-10">
            <p className="text-p4-gray text-sm leading-relaxed">
              <span className="text-p4-yellow font-black">ℹ️ Note:</span> After registration, your team will be pending admin verification. You can start recruiting members once approved!
            </p>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed top-20 left-0 w-96 h-96 bg-p4-yellow opacity-5 
                     transform -skew-x-12 -z-10 pointer-events-none"></div>
    </div>
  );
};
