export const Home = () => {
  return (
    <div className="min-h-screen bg-p4-bg pt-12 p4-scanline">
      {/* Hero Section */}
      <div className="px-8 py-20 max-w-6xl mx-auto">
        {/* Main Title with Inverted Accent */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter 
                          text-p4-white p4-text-shadow">
              Welcome to the
            </h1>
            <div className="bg-p4-yellow text-p4-bg px-4 py-2 transform -skew-x-6 
                          text-6xl md:text-7xl font-black uppercase shadow-p4-lg">
              NIGHT
            </div>
          </div>
          
          <div className="flex flex-wrap items-end gap-3">
            <div className="bg-p4-white text-p4-bg px-4 py-2 transform -skew-x-6 
                          text-5xl md:text-6xl font-black uppercase shadow-p4-lg">
              Channel
            </div>
            <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter 
                          text-p4-white p4-text-shadow">
              (P4G)
            </h1>
          </div>
        </div>

        {/* Subtitle with Geometric Border */}
        <div className="border-4 border-p4-yellow bg-p4-dark px-6 py-4 
                        transform -skew-x-2 max-w-2xl mb-12 shadow-p4">
          <p className="text-xl text-p4-gray uppercase tracking-wider font-black">
            ⚡ Game Localization Platform Next Generation
          </p>
          <p className="text-sm text-p4-white font-light mt-3 leading-relaxed">
            Unite teams, share games, and translate worlds. Every game deserves the height of art.
          </p>
        </div>

        {/* Feature Cards - TV Channel Style */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {/* Card 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-black transform -skew-x-2 
                          group-hover:translate-x-1 group-hover:translate-y-1 
                          transition-all duration-200 z-0"></div>
            <div className="relative z-10 bg-p4-dark border-4 border-p4-white 
                          transform -skew-x-1 p-6 shadow-p4
                          group-hover:shadow-p4-lg group-hover:-translate-y-1 
                          transition-all duration-200">
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-p4-yellow 
                            border-2 border-p4-yellow"></div>
              <div className="text-4xl font-black text-p4-yellow mb-3">🎮</div>
              <h3 className="text-2xl font-black text-p4-white uppercase mb-2">
                Organize
              </h3>
              <p className="text-sm text-p4-gray">
                Create teams and manage localizations for large projects.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-black transform -skew-x-2 
                          group-hover:translate-x-1 group-hover:translate-y-1 
                          transition-all duration-200 z-0"></div>
            <div className="relative z-10 bg-p4-dark border-4 border-p4-white 
                          transform -skew-x-1 p-6 shadow-p4
                          group-hover:shadow-p4-lg group-hover:-translate-y-1 
                          transition-all duration-200">
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-p4-yellow 
                            border-2 border-p4-yellow"></div>
              <div className="text-4xl font-black text-p4-yellow mb-3">🌍</div>
              <h3 className="text-2xl font-black text-p4-white uppercase mb-2">
                Translate
              </h3>
              <p className="text-sm text-p4-gray">
                Join teams and collaboratively develop translations at world class level.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-black transform -skew-x-2 
                          group-hover:translate-x-1 group-hover:translate-y-1 
                          transition-all duration-200 z-0"></div>
            <div className="relative z-10 bg-p4-dark border-4 border-p4-white 
                          transform -skew-x-1 p-6 shadow-p4
                          group-hover:shadow-p4-lg group-hover:-translate-y-1 
                          transition-all duration-200">
              <div className="absolute top-1/2 -right-3 w-6 h-6 bg-p4-yellow 
                            border-2 border-p4-yellow"></div>
              <div className="text-4xl font-black text-p4-yellow mb-3">✨</div>
              <h3 className="text-2xl font-black text-p4-white uppercase mb-2">
                Achieve
              </h3>
              <p className="text-sm text-p4-gray">
                Track progress, complete milestones, and celebrate team success.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="border-4 border-p4-yellow bg-gradient-to-br 
                        from-p4-dark to-p4-bg p-8 transform -skew-y-1
                        shadow-p4-xl">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-p4-white mb-4
                        p4-text-shadow tracking-tighter">
            Ready to Change Game Localization?
          </h2>
          <p className="text-lg text-p4-gray mb-8 font-light max-w-2xl">
            Join our community of developers and localizers. Create amazing translations right now!
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href="/register" 
               className="p4-button-yellow group relative overflow-hidden">
              <span className="relative z-10">🚀 Start Now</span>
            </a>
            <a href="/games" 
               className="p4-button group relative overflow-hidden">
              <span className="relative z-10">📚 Browse Games</span>
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-3 gap-4">
          <div className="bg-p4-dark border-4 border-p4-white p-6 
                        transform -skew-x-1 shadow-p4 text-center">
            <div className="text-5xl font-black text-p4-yellow">∞</div>
            <p className="text-sm text-p4-gray uppercase font-bold mt-2">
              Possibilities
            </p>
          </div>
          <div className="bg-p4-dark border-4 border-p4-white p-6 
                        transform -skew-x-1 shadow-p4 text-center">
            <div className="text-5xl font-black text-p4-yellow">→</div>
            <p className="text-sm text-p4-gray uppercase font-bold mt-2">
              Dynamics
            </p>
          </div>
          <div className="bg-p4-dark border-4 border-p4-white p-6 
                        transform -skew-x-1 shadow-p4 text-center">
            <div className="text-5xl font-black text-p4-yellow">◆</div>
            <p className="text-sm text-p4-gray uppercase font-bold mt-2">
              Quality
            </p>
          </div>
        </div>
      </div>

      {/* Background accent elements */}
      <div className="fixed top-20 right-0 w-96 h-96 bg-p4-yellow opacity-5 
                     transform skew-x-12 -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-p4-yellow opacity-5 
                     transform -skew-x-12 -z-10 pointer-events-none"></div>
    </div>
  );
};