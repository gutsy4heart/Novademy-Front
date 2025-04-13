import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPackages, deletePackage } from '../../../services/packageService';
import { CoursePackage } from '../../../services/packageService';

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<CoursePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const data = await getPackages();
      setPackages(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот пакет курсов?')) {
      try {
        await deletePackage(id);
        setPackages(packages.filter(pkg => pkg.id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Пакеты курсов</h1>
        <Link to="/admin/packages/new" className="btn btn-primary">
          Новый пакет
        </Link>
      </div>

      {packages.length === 0 ? (
        <p>Пакеты не найдены</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Цена</th>
              <th>Скидка</th>
              <th>Длительность</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => (
              <tr key={pkg.id}>
                <td>{pkg.title}</td>
                <td>{pkg.description}</td>
                <td>{pkg.price} AZN</td>
                <td>{pkg.discount}%</td>
                <td>{pkg.duration} дней</td>
                <td>{pkg.status}</td>
                <td>
                  <div className="table-actions">
                    <Link 
                      to={`/admin/packages/${pkg.id}/edit`}
                      className="btn btn-secondary"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="btn btn-danger"
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PackageList; 