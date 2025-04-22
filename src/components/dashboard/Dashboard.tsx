import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StudentDashboard from './StudentDashboard';
import { UserRole } from '../../api/authService';

const Dashboard: React.FC = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>İstifadəçi daxil olmayıb. Zəhmət olmasa daxil olun.</p>
        </div>
      </div>
    );
  }

  // For admin and teacher users
  if (isAdmin || isTeacher) {
    // In the future, we could add admin and teacher dashboards here
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">İdarəetmə paneli</h1>
          <p className="mb-4">
            {isAdmin ? 'Admin' : 'Müəllim'} kimi daxil olmusunuz.
          </p>
          <p>
            İdarəetmə paneli bu hesab üçün əlçatan deyil. Admin funksiyalarına daxil olmaq üçün admin portalından istifadə edin.
          </p>
        </div>
      </div>
    );
  }
  
  // For student users
  return <StudentDashboard />;
};

export default Dashboard; 