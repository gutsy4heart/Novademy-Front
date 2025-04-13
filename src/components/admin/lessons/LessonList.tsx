import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLessons, deleteLesson } from '../../../services/lessonService';
import { getCourse } from '../../../services/courseService';
import { Lesson } from '../../../services/lessonService';

const LessonList: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseName, setCourseName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLessons();
    if (courseId) {
      loadCourseName();
    }
  }, [courseId]);

  const loadLessons = async () => {
    try {
      const data = await getLessons(courseId);
      setLessons(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourseName = async () => {
    try {
      const course = await getCourse(courseId!);
      setCourseName(course.title);
    } catch (err: any) {
      console.error("Не удалось загрузить название курса:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот урок?')) {
      try {
        await deleteLesson(id);
        setLessons(lessons.filter(lesson => lesson.id !== id));
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
        <h1>
          {courseId ? (
            <>
              Уроки курса: <span className="course-title">{courseName}</span>
            </>
          ) : (
            "Все уроки"
          )}
        </h1>
        <Link 
          to={courseId ? `/admin/courses/${courseId}/lessons/new` : "/admin/lessons/new"} 
          className="btn btn-primary"
        >
          Новый урок
        </Link>
      </div>

      {lessons.length === 0 ? (
        <p>Уроки не найдены</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Порядок</th>
              <th>Видео</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map(lesson => (
              <tr key={lesson.id}>
                <td>{lesson.title}</td>
                <td>{lesson.description}</td>
                <td>{lesson.order}</td>
                <td>{lesson.videoUrl ? "Есть" : "Нет"}</td>
                <td>{new Date(lesson.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="table-actions">
                    <Link 
                      to={`/admin/lessons/${lesson.id}/edit`}
                      className="btn btn-secondary"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(lesson.id)}
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

export default LessonList; 