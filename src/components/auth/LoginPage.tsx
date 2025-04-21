import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

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
    <div className="auth-container">
      <div className="auth-card">
        <h2>Hesabınıza daxil olun</h2>
        
        {formError && <div className="error-message">{formError}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">İstifadəçi adı</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="İstifadəçi adınızı daxil edin"

            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Şifrə</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrənizi daxil edin"

            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Yüklənir...' : 'Daxil ol'}
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/register">Hesabınız yoxdur? Qeydiyyatdan keçin</Link>
          <Link to="/forgot-password">Şifrəni unutmusunuz?</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 