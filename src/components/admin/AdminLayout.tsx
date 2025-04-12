import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './Admin.css';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname.startsWith(`/admin${path}`);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h1>Novademy</h1>
        </div>
        <nav className="admin-nav">
          <Link 
            to="/admin/dashboard" 
            className={`nav-item ${isActiveRoute('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/courses" 
            className={`nav-item ${isActiveRoute('/courses') ? 'active' : ''}`}
          >
            Kurslar
          </Link>
          <Link 
            to="/admin/lessons" 
            className={`nav-item ${isActiveRoute('/lessons') ? 'active' : ''}`}
          >
            Dərslər
          </Link>
          <Link 
            to="/admin/quizzes" 
            className={`nav-item ${isActiveRoute('/quizzes') ? 'active' : ''}`}
          >
            Testlər
          </Link>
          <Link 
            to="/admin/packages" 
            className={`nav-item ${isActiveRoute('/packages') ? 'active' : ''}`}
          >
            Paketlər
          </Link>
          <Link 
            to="/admin/subscriptions" 
            className={`nav-item ${isActiveRoute('/subscriptions') ? 'active' : ''}`}
          >
            Abunəliklər
          </Link>
          <Link 
            to="/admin/users" 
            className={`nav-item ${isActiveRoute('/users') ? 'active' : ''}`}
          >
            İstifadəçilər
          </Link>
        </nav>
      </aside>
      <main className="admin-content">
        <header className="admin-header">
          <div className="admin-header-content">
            <h2>Admin Panel</h2>
            <div className="admin-user-menu">
              <button className="logout-button">Çıxış</button>
            </div>
          </div>
        </header>
        <div className="admin-main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 