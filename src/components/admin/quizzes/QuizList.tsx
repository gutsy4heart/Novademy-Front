import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getQuizzes, deleteQuiz } from '../../../services/quizService';
import { getCourse } from '../../../services/courseService';
import { getLesson } from '../../../services/lessonService';
import { Quiz } from '../../../services/quizService';

const QuizList: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courseName, setCourseName] = useState<string>('');
  const [lessonName, setLessonName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
    if (courseId) {
      loadCourseName();
    }
    if (lessonId) {
      loadLessonName();
    }
  }, [courseId, lessonId]);

  const loadQuizzes = async () => {
    try {
      const data = await getQuizzes(courseId, lessonId);
      setQuizzes(data);
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

  const loadLessonName = async () => {
    try {
      const lesson = await getLesson(lessonId!);
      setLessonName(lesson.title);
    } catch (err: any) {
      console.error("Не удалось загрузить название урока:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот тест?')) {
      try {
        await deleteQuiz(id);
        setQuizzes(quizzes.filter(quiz => quiz.id !== id));
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

  const getCreateUrl = () => {
    if (lessonId) {
      return `/admin/lessons/${lessonId}/quizzes/new`;
    }
    if (courseId) {
      return `/admin/courses/${courseId}/quizzes/new`;
    }
    return '/admin/quizzes/new';
  };

  return (
    <div>
      <div className="page-header">
        <h1>
          {lessonId ? (
            <>
              Тесты для урока: <span className="lesson-title">{lessonName}</span>
            </>
          ) : courseId ? (
            <>
              Тесты курса: <span className="course-title">{courseName}</span>
            </>
          ) : (
            "Все тесты"
          )}
        </h1>
        <Link 
          to={getCreateUrl()} 
          className="btn btn-primary"
        >
          Новый тест
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <p>Тесты не найдены</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Количество вопросов</th>
              <th>Лимит времени</th>
              <th>Проходной балл</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map(quiz => (
              <tr key={quiz.id}>
                <td>{quiz.title}</td>
                <td>{quiz.description}</td>
                <td>{quiz.questions.length}</td>
                <td>{quiz.timeLimit ? `${quiz.timeLimit} мин.` : 'Не ограничено'}</td>
                <td>{quiz.passingScore}%</td>
                <td>
                  <div className="table-actions">
                    <Link 
                      to={`/admin/quizzes/${quiz.id}/edit`}
                      className="btn btn-secondary"
                    >
                      Редактировать
                    </Link>
                    <button
                      onClick={() => handleDelete(quiz.id)}
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

export default QuizList; 