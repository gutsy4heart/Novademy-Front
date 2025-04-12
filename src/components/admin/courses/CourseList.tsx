import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, deleteCourse } from '../../../services/courseService';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  createdAt: string;
  status: string;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu kursu silmək istədiyinizə əminsiniz?')) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter(course => course.id !== id));
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (isLoading) {
    return <div>Yüklənir...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Kurslar</h1>
        <Link to="/admin/courses/new" className="btn btn-primary">
          Yeni Kurs
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Ad</th>
            <th>Təsvir</th>
            <th>Qiymət</th>
            <th>Status</th>
            <th>Yaradılma tarixi</th>
            <th>Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.description}</td>
              <td>{course.price} AZN</td>
              <td>{course.status}</td>
              <td>{new Date(course.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="table-actions">
                  <Link 
                    to={`/admin/courses/${course.id}/edit`}
                    className="btn btn-secondary"
                  >
                    Düzəliş et
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="btn btn-danger"
                  >
                    Sil
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseList; 