import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { getFullName } from '../../api/authService';
import '../../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would normally fetch the user's enrolled courses
    setLoading(false);
  }, []);

  return (
    <div className="dashboard-container">
      <h1>İstifadəçi Paneli</h1>
      
      <div className="dashboard-welcome">
        <h2>Xoş gəlmisiniz, {user ? getFullName(user) : 'İstifadəçi'}!</h2>
        <p>Öyrənməyə davam etmək üçün kurslarınızı seçin.</p>
      </div>
      
      <div className="dashboard-courses">
        <h3>Kurslarım</h3>
        {loading ? (
          <p>Yüklənir...</p>
        ) : courses.length > 0 ? (
          <div className="courses-grid">
            {/* Course items would be rendered here */}
            <div className="course-card">
              <h4>Nümunə kurs</h4>
              <p>Bu nümunə kurs kartıdır.</p>
              <Link to="/courses/1" className="course-link">Kursa baxmaq</Link>
            </div>
          </div>
        ) : (
          <div className="empty-courses">
            <p>Hələ heç bir kursa qeydiyyatdan keçməmisiniz.</p>
            <Link to="/" className="cta-button">Kursları kəşf edin</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 