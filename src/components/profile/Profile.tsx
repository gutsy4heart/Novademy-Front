import React, { useState, useEffect, useRef } from 'react';
import { getUserProfile, updateUserProfile, uploadProfilePhoto, changePassword } from '../../services/userService';
import { UserProfile, UpdateProfileData, ChangePasswordData } from '../../services/userService';
import './Profile.css';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({});
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const userData = await getUserProfile();
      setProfile(userData);
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        idNumber: userData.idNumber
      });
    } catch (err: any) {
      setError('Profil məlumatlarını yükləmək mümkün olmadı');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedProfile = await updateUserProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccessMessage('Profil uğurla yeniləndi');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError('Profil yeniləmək mümkün olmadı');
      console.error(err);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (passwordData.newPassword.length < 6) {
      setError('Şifrə ən azı 6 simvol olmalıdır');
      return;
    }

    try {
      await changePassword(passwordData);
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: ''
      });
      setSuccessMessage('Şifrə uğurla dəyişdirildi');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      setError('Şifrəni dəyişmək mümkün olmadı');
      console.error(err);
    }
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      try {
        setIsLoading(true);
        const result = await uploadProfilePhoto(file);
        
        setProfile(prev => {
          if (!prev) return null;
          return { ...prev, avatarUrl: result.avatarUrl };
        });
        
        setSuccessMessage('Profil şəkli uğurla yeniləndi');

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } catch (err: any) {
        setError('Şəkili yükləmək mümkün olmadı');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading && !profile) {
    return <div className="loading-container">Yüklənir...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <h3>Tənzimləmələr</h3>
        <ul className="settings-nav">
          <li className="active">
            <span className="settings-icon">👤</span>
            Şəxsi məlumatlar
          </li>
          <li>
            <span className="settings-icon">🔍</span>
            Kurslar
          </li>
          <li>
            <span className="settings-icon">📁</span>
            Sifarişlər
          </li>
          <li>
            <span className="settings-icon">💳</span>
            Billing məlumatları
          </li>
          <li>
            <span className="settings-icon">🔒</span>
            Çıxış
          </li>
        </ul>
      </div>
      
      <div className="profile-content">
        <h2>Şəxsi məlumatlar</h2>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <div className="profile-section">
          <div className="avatar-section">
            <div className="avatar-container">
              <img 
                src={profile?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=random'} 
                alt="Profile" 
                className="avatar-image" 
              />
              <button className="upload-button" onClick={handlePhotoUpload}>
                Upload
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          </div>
          
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Ad</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Soyad</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Mobil nömrə</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="idNumber">Vəsiqənin nömrəsi</label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            
            <div className="form-actions">
              {!isEditing ? (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Düzəliş et
                </button>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Ləğv et
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Yadda saxla
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
        
        <div className="profile-section">
          <h3>Şifrəni dəyiş</h3>
          
          <button
            className="btn btn-secondary password-toggle"
            onClick={() => setIsChangingPassword(!isChangingPassword)}
          >
            {isChangingPassword ? 'Ləğv et' : 'Şifrəni dəyiş'}
          </button>
          
          {isChangingPassword && (
            <form className="password-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Cari şifrə</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">Yeni şifrə</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary">
                Dəyiş
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 