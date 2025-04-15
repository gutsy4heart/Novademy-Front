import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Показываем прелоадер, пока проверяем статус аутентификации
  if (isLoading) {
    return <div className="loading">Yüklənir...</div>;
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  // Сохраняем текущий путь в state для возможности редиректа обратно после авторизации
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если авторизован - рендерим содержимое маршрута
  return <Outlet />;
};

export default ProtectedRoute; 