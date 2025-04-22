import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!username || !password) {
      setFormError('Zəhmət olmasa bütün sahələri doldurun');
      return;
    }

    try {
      console.log("Submitting login form with:", { username, password });
      await login({ username, password });
      console.log("Login successful");
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login form error:", err);
      setFormError(err.message || 'Giriş zamanı xəta baş verdi');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#a01b7a] to-[#4d1463] p-5 relative">
      <div className="fixed top-8 right-8 text-right">
        <Link to="/register" className="text-white hover:underline text-sm">
          Hesabınız yoxdur? Qeydiyyatdan keçin
        </Link>
      </div>
      
      <div className="w-full max-w-md bg-white/20 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-6">Hesabınıza daxil olun</h2>
        
        {formError && (
          <div className="bg-[#ffebee] text-[#ff4444] px-4 py-3 rounded-lg mb-4 text-sm text-center">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="mb-4">
            <label htmlFor="username" className="block text-white font-medium mb-1 text-sm">
              İstifadəçi adı
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="İstifadəçi adınızı daxil edin"
              className="w-full p-3 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-white font-medium mb-1 text-sm">
              Şifrə
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrənizi daxil edin"
              className="w-full p-3 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={`mt-4 w-full py-3 px-4 rounded-lg font-semibold text-white ${
              isLoading 
                ? 'bg-[#e9819d] cursor-not-allowed' 
                : 'bg-[#e91e63] hover:bg-[#d81b60] transition-colors'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Yüklənir...' : 'Daxil ol'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 