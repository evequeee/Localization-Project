import { ApiTester } from '../components/ApiTester';

export const ApiTesterPage = () => {
  return (
    <div className="min-h-screen bg-p4-bg p-8 p4-scanline">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-black text-p4-white uppercase 
                     tracking-tighter p4-text-shadow mb-4">🧪 API Tester</h1>
        <p className="text-lg text-p4-gray font-black uppercase tracking-widest mb-12">
          Manual JWT Authentication & Authorization Testing
        </p>
        
        <ApiTester />
      </div>

      {/* Background decoration */}
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-p4-yellow opacity-5 
                     transform skew-x-12 -z-10 pointer-events-none"></div>
    </div>
  );
};
