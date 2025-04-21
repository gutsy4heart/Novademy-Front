import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SectorType, UserRole } from '../../api/authService';
import './Auth.css';

const phonePrefixes = ["050", "051", "055", "070", "077"];

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [roleId, setRoleId] = useState(UserRole.Student); // По умолчанию Student
  const [group, setGroup] = useState(1);
  const [sector, setSector] = useState(SectorType.Azerbaijani);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [phonePrefix, setPhonePrefix] = useState(phonePrefixes[0]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      // Создаем превью изображения
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Базовая валидация
    if (!username || !password || !firstName || !lastName || !email || !phoneNumber) {
      setFormError('Zəhmət olmasa bütün sahələri doldurun');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Şifrələr uyğun gəlmir');
      return;
    }

    if (password.length < 6) {
      setFormError('Şifrə ən azı 6 simvoldan ibarət olmalıdır');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Düzgün e-poçt ünvanı daxil edin');
      return;
    }

    if (!/^\+?[0-9]{10,15}$/.test(phoneNumber.replace(/\s/g, ''))) {
      setFormError('Düzgün telefon nömrəsi daxil edin');
      return;
    }

    try {
      console.log("Submitting registration form", { 
        username, password, firstName, lastName, email, phoneNumber, roleId, group, sector, profilePicture: !!profilePicture 
      });
      
      await register({
        username, 
        password, 
        firstName, 
        lastName, 
        email, 
        phoneNumber: `${phonePrefix}${phoneNumber}`, 
        roleId, 
        group, 
        sector, 
        profilePicture: profilePicture || undefined
      });
      
      console.log("Registration successful");
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Registration error:", err);
      // Показываем детальную ошибку если она есть
      setFormError(err.message || 'Qeydiyyat zamanı xəta baş verdi');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="navbar-logo">novademy</Link>
        
        {formError && <div className="error-message">{formError}</div>}
        
        <div className="auth-links">
          <span>Hesabın var?</span>
          <Link to="/login">Hesaba giriş</Link>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Ad</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder=""
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Soyad</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder=""
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username@gmail.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Mobil nömrə</label>
            <div className="phone-input-container">
              <select
                value={phonePrefix}
                onChange={(e) => setPhonePrefix(e.target.value)}
              >
                {phonePrefixes.map(prefix => (
                  <option key={prefix} value={prefix}>{prefix}</option>
                ))}
              </select>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="*** ** **"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sector">Sektor</label>
              <select
                id="sector"
                value={sector}
                onChange={(e) => setSector(Number(e.target.value) as SectorType)}
                required
              >
                <option value={SectorType.Azerbaijani}>AZ</option>
                <option value={SectorType.Russian}>RU</option>
                <option value={SectorType.English}>EN</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="group">Qrup</label>
              <select
                id="group"
                value={group}
                onChange={(e) => setGroup(Number(e.target.value))}
                required
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">İstifadəçi adı</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=""
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Şifrə</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Şifrənin təkrarı</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=""
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Yüklənir...' : 'Davam et'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 