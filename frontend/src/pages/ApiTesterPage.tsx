import { ApiTester } from '../components/ApiTester';

export const ApiTesterPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-5xl font-black text-p4yellow uppercase tracking-tight drop-shadow-md mb-8">🧪 API Tester</h1>
      <p className="text-lg text-gray-300 mb-8">Ручне тестування JWT автентифікації та авторизації</p>
      
      <ApiTester />
    </div>
  );
};
