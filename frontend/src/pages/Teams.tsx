import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../services/api';
import type { Team } from '../types';

export const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/teams')
      .then(res => {
        setTeams(Array.isArray(res) ? res : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading teams:", err);
        // Mock data for testing design
        setTeams([
          { id: 1, name: "SBT Localization", description: "The largest community of Ukrainian game translators.", contactEmail: "info@sbt.ua" },
          { id: 2, name: "Sandigo", description: "Team specializing in Japanese RPG translations.", contactEmail: "contact@sandigo.jp" }
        ]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-p4-yellow text-2xl font-bold animate-pulse">📺 Searching for signal...</div>;

  return (
    <div className="min-h-screen bg-p4-bg p-8 p4-scanline">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <h1 className="text-6xl md:text-7xl font-black text-p4-white uppercase tracking-tighter p4-text-shadow">
            Team Roster
          </h1>
          <Link 
            to="/add-team"
            className="p4-button-yellow text-sm hover:shadow-p4-xl"
          >
            ➕ Create Team
          </Link>
        </div>

        {teams.length === 0 ? (
          <div className="text-center bg-p4-dark border-4 border-dashed border-p4-gray p-16 transform -skew-x-1">
            <div className="text-8xl font-black text-p4-gray opacity-30 mb-4">👥</div>
            <p className="text-2xl font-black text-p4-gray uppercase tracking-wider">
              No Teams Yet
            </p>
            <p className="text-sm text-p4-gray mt-2">
              Be the first to create one!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {teams.map(team => (
              <Link
                key={team.id}
                to={`/team/${team.id}`}
                className="group relative"
              >
                {/* Shadow layer */}
                <div className="absolute inset-0 bg-black transform -skew-x-2 
                              group-hover:translate-x-1 group-hover:translate-y-1 
                              transition-all duration-200 z-0"></div>
                
                {/* Main card */}
                <div className="relative z-10 bg-p4-dark border-4 border-p4-white 
                              transform -skew-x-1 p-6 shadow-p4
                              group-hover:shadow-p4-lg group-hover:-translate-y-1 
                              transition-all duration-200 flex flex-col h-full">
                  
                  {/* Corner accent */}
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-p4-yellow 
                                border-2 border-p4-yellow"></div>

                  {/* Team name */}
                  <h2 className="text-3xl font-black text-p4-white uppercase 
                               tracking-tighter p4-text-shadow mb-3">
                    {team.name}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-p4-gray text-sm mb-6 flex-grow leading-relaxed line-clamp-3 italic">
                    "{team.description || 'No description'}"
                  </p>

                  {/* Divider */}
                  <div className="h-1 bg-gradient-to-r from-p4-yellow to-transparent mb-4"></div>

                  {/* Email & Status */}
                  <div className="space-y-3">
                    {team.contactEmail && (
                      <div className="text-xs text-p4-gray font-bold uppercase tracking-widest">
                        📧 {team.contactEmail}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <span className="text-p4-yellow font-black text-xs uppercase">
                        ✅ VERIFIED
                      </span>
                      <span className="text-p4-white text-xs font-black uppercase 
                                     group-hover:text-p4-yellow transition-colors">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};