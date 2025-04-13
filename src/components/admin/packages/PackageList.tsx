import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CoursePackage, getPackages, deletePackage } from '../../../services/packageService';
import '../../admin/Admin.css';

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<CoursePackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await getPackages();
      setPackages(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu paketi silmək istədiyinizdən əminsinizmi?')) {
      try {
        await deletePackage(id);
        setPackages(packages.filter(pkg => pkg.id !== id));
      } catch (err: any) {
        setError(err.message || 'Failed to delete package');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-content">
      <div className="page-header">
        <h1>Paketlər</h1>
        <Link to="/admin/packages/new" className="btn-primary">Yeni paket əlavə et</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Başlıq</th>
              <th>Qiymət</th>
              <th>Endirim</th>
              <th>Müddət</th>
              <th>Status</th>
              <th>Fəaliyyətlər</th>
            </tr>
          </thead>
          <tbody>
            {packages.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data">Heç bir paket tapılmadı</td>
              </tr>
            ) : (
              packages.map(pkg => (
                <tr key={pkg.id}>
                  <td>{pkg.title}</td>
                  <td>{pkg.price} AZN</td>
                  <td>{pkg.discount}%</td>
                  <td>{pkg.duration} gün</td>
                  <td>{pkg.status === 'active' ? 'Aktiv' : 'Deaktiv'}</td>
                  <td className="table-actions">
                    <button
                      onClick={() => navigate(`/admin/packages/${pkg.id}`)}
                      className="btn-secondary"
                    >
                      Düzəliş et
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="btn-danger"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackageList; 