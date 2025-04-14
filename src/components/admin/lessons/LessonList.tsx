import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lesson, getLessons, deleteLesson } from '../../../api/lessonService';
import { getCourses, Course } from '../../../api/courseService';
import '../../admin/Admin.css';

const LessonList: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lessonsData, coursesData] = await Promise.all([
        getLessons(),
        getCourses()
      ]);
      setLessons(lessonsData);
      setCourses(coursesData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Dərsləri yükləmək mümkün olmadı');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu dərsi silmək istədiyinizə əminsiniz?')) {
      try {
        await deleteLesson(id);
        setLessons(lessons.filter(lesson => lesson.id !== id));
      } catch (err: any) {
        setError(err.message || 'Dərsi silmək mümkün olmadı');
      }
    }
  };

  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Kurs tapılmadı';
  };

  if (loading) {
    return <div className="loading">Yüklənir...</div>;
  }

  return (
    <div className="admin-content">
      <div className="page-header">
        <h1>Dərslər</h1>
        <Link to="/admin/lessons/new" className="btn-primary">Yeni dərs əlavə et</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Başlıq</th>
              <th>Kurs</th>
              <th>Sıra</th>
              <th>Fəaliyyətlər</th>
            </tr>
          </thead>
          <tbody>
            {lessons.length === 0 ? (
              <tr>
                <td colSpan={4} className="no-data">Heç bir dərs tapılmadı</td>
              </tr>
            ) : (
              lessons.map(lesson => (
                <tr key={lesson.id}>
                  <td>{lesson.title}</td>
                  <td>{getCourseTitle(lesson.courseId)}</td>
                  <td>{lesson.order}</td>
                  <td className="table-actions">
                    <button
                      onClick={() => navigate(`/admin/lessons/${lesson.id}`)}
                      className="btn-secondary"
                    >
                      Düzəliş et
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
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

export default LessonList; 