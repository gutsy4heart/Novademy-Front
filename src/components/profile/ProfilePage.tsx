import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const { user, getFullName } = useAuth();
  
  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          Пользователь не авторизован
        </div>
      </div>
    );
  }

  const userName = getFullName(user);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Profil</h1>
          <div className="profile-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <div className="profile-info">
          <div className="info-row">
            <div className="info-label">Ad və Soyad:</div>
            <div className="info-value">{userName}</div>
          </div>
          
          <div className="info-row">
            <div className="info-label">E-poçt:</div>
            <div className="info-value">{user.email}</div>
          </div>
          
          <div className="info-row">
            <div className="info-label">Rol:</div>
            <div className="info-value">{user.roleId === 1 ? 'Administrator' : user.roleId === 2 ? 'Müəllim' : 'Tələbə'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 