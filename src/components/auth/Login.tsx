import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Giriş</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Şifrə</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
            <small className="password-hint">(Minimum 8 simvol)</small>
          </div>
          <button type="submit" className="submit-button">
            Davam et
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login; 