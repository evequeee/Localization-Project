import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomSelect } from '../components/CustomSelect';
import { apiPost } from '../services/api';

// Options for languages
const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Ukrainian', label: 'Ukrainian' },
  { value: 'Other', label: 'Other' }
];

// Options for status
const statusOptions = [
  { value: 'Not Started', label: 'Not Started' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Testing', label: 'Testing' },
  { value: 'Completed', label: 'Completed' }
];

export const AddGame = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    originalLanguage: 'English',
    translationStatus: 'In Progress',
    description: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Basic validation
    if (!formData.title.trim()) {
      setError('Game title is required!');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Game description is required!');
      setLoading(false);
      return;
    }

    try {
      await apiPost('/api/games', formData);
      
      setSuccess(`✅ Game "${formData.title}" added successfully! 🎮`);
      
      // Clear form
      setFormData({
        title: '',
        originalLanguage: 'English',
        translationStatus: 'In Progress',
        description: ''
      });
      
      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/games');
      }, 1500);
    } catch (err: any) {
      console.error("Error adding game:", err);
      setError(err.message || 'Failed to add game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-p4-bg p-8 p4-scanline">
      <div className="max-w-3xl mx-auto">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-7xl font-black text-p4-white uppercase 
                        tracking-tighter p4-text-shadow mb-2">
            Add New
          </h1>
          <div className="flex items-center gap-3">
            <div className="bg-p4-yellow text-p4-bg px-4 py-2 font-black 
                          transform -skew-x-6 shadow-p4">
              GAME
            </div>
            <h2 className="text-4xl font-black text-p4-gray uppercase">to Channel</h2>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="relative">
          {/* Shadow background */}
          <div className="absolute inset-0 bg-black transform -skew-x-2 translate-x-2 translate-y-2 -z-10"></div>

          {/* Main form box */}
          <div className="bg-p4-dark border-4 border-p4-white transform -skew-x-1 
                        p-8 shadow-p4-xl relative z-10">
            
            {/* Decorative corner */}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-p4-yellow 
                          border-2 border-p4-yellow"></div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-900 border-4 border-red-600 text-white p-4 
                            font-black uppercase tracking-widest text-sm transform -skew-x-1">
                ⚠️ {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-green-900 border-4 border-green-600 text-white p-4 
                            font-black uppercase tracking-widest text-sm transform -skew-x-1">
                {success}
              </div>
            )}

            <div className="flex flex-col gap-8">
              
              {/* Title Field */}
              <div className="flex flex-col">
                <label className="text-p4-yellow font-black uppercase tracking-widest 
                               text-sm mb-3">⚡ Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  disabled={loading}
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Persona 4 Golden"
                  className="p4-input"
                />
              </div>

              {/* Language & Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-30">
                {/* Original Language */}
                <CustomSelect 
                  label="🌐 Original Language"
                  name="originalLanguage"
                  value={formData.originalLanguage}
                  options={languageOptions}
                  onChange={handleSelectChange}
                />

                {/* Translation Status */}
                <CustomSelect 
                  label="📊 Translation Status"
                  name="translationStatus"
                  value={formData.translationStatus}
                  options={statusOptions}
                  onChange={handleSelectChange}
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col relative z-10">
                <label className="text-p4-yellow font-black uppercase tracking-widest 
                               text-sm mb-3">📝 Description</label>
                <textarea 
                  name="description"
                  required
                  disabled={loading}
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Tell us about this game. Genre, franchise, what makes it special..."
                  className="p4-input resize-none"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="p4-button-yellow text-lg hover:shadow-p4-xl
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Creating...' : '✨ Create Game'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Background decoration */}
      <div className="fixed top-20 left-0 w-96 h-96 bg-p4-yellow opacity-5 
                     transform -skew-x-12 -z-10 pointer-events-none"></div>
    </div>
  );
};