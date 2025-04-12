import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>İdarəetmə paneli</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Kurslar</h3>
          <p>Kursları idarə edin</p>
          <Link to="/admin/courses" className="btn btn-primary">
            Kurslara keçid
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Dərslər</h3>
          <p>Dərsləri idarə edin</p>
          <Link to="/admin/lessons" className="btn btn-primary">
            Dərslərə keçid
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Testlər</h3>
          <p>Testləri idarə edin</p>
          <Link to="/admin/quizzes" className="btn btn-primary">
            Testlərə keçid
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Paketlər</h3>
          <p>Paketləri idarə edin</p>
          <Link to="/admin/packages" className="btn btn-primary">
            Paketlərə keçid
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>Abunəliklər</h3>
          <p>Abunəlikləri idarə edin</p>
          <Link to="/admin/subscriptions" className="btn btn-primary">
            Abunəliklərə keçid
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>İstifadəçilər</h3>
          <p>İstifadəçiləri idarə edin</p>
          <Link to="/admin/users" className="btn btn-primary">
            İstifadəçilərə keçid
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 