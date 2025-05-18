import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SectorType, UserRole } from '../../api/authService';
import './Auth.css';

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

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Limit to 9 digits (excluding country code)
    if (value.length > 9) {
      value = value.slice(0, 9);
    }
    
    // Format the phone number as shown in the images
    if (value.length > 0) {
      let formattedNumber = '';
      if (value.length <= 2) {
        formattedNumber = value;
      } else if (value.length <= 5) {
        formattedNumber = `${value.slice(0, 2)} ${value.slice(2)}`;
      } else if (value.length <= 7) {
        formattedNumber = `${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5)}`;
      } else {
        formattedNumber = `${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5, 7)} ${value.slice(7)}`;
      }
      setPhoneNumber(formattedNumber);
    } else {
      setPhoneNumber('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate phone number format
    const cleanPhoneNumber = phoneNumber.replace(/\s/g, '');
    if (!/^\d{9}$/.test(cleanPhoneNumber)) {
      setFormError('Düzgün telefon nömrəsi daxil edin (9 rəqəm)');
      return;
    }

    try {
      // Send the phone number without spaces and without country code
      // Backend will add the +994 prefix
      await register({
        username,
        password,
        firstName,
        lastName,
        email,
        phoneNumber: cleanPhoneNumber,
        roleId,
        group,
        sector,
        profilePicture: profilePicture || undefined
      });
      
      navigate('/dashboard');
    } catch (err: any) {
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
              <div className="country-code">+994</div>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="51 255 55 55"
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