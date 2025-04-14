import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { lessonService, Lesson, LessonResponse } from '../../services/lessonService';
import './LessonView.css';

export const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lessonData, setLessonData] = React.useState<LessonResponse | null>(null);
  const [lessons, setLessons] = React.useState<Lesson[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<{ [key: string]: boolean }>({});

  // Загрузка списка всех уроков курса
  React.useEffect(() => {
    const fetchLessons = async () => {
      if (!courseId) return;
      try {
        const lessonsData = await lessonService.getLessonsByCourse(courseId);
        setLessons(lessonsData);
        const progressData = await lessonService.getLessonProgress(courseId);
        setProgress(progressData);
      } catch (err) {
        setError('Dərslərin siyahısı yüklənərkən xəta baş verdi');
      }
    };

    fetchLessons();
  }, [courseId]);

  // Загрузка текущего урока
  React.useEffect(() => {
    const fetchLesson = async () => {
      if (!courseId || !lessonId) return;
      try {
        setLoading(true);
        const data = await lessonService.getLesson(courseId, lessonId);
        setLessonData(data);
      } catch (err) {
        setError('Dərs yüklənərkən xəta baş verdi');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  // Обработчик завершения просмотра видео
  const handleVideoEnd = async () => {
    if (!courseId || !lessonId) return;
    try {
      await lessonService.markLessonAsWatched(courseId, lessonId);
      // Обновляем прогресс локально
      setProgress(prev => ({ ...prev, [lessonId]: true }));
      
      // Если есть следующий урок, переходим к нему
      if (lessonData?.nextLesson) {
        navigate(`/courses/${courseId}/lessons/${lessonData.nextLesson.id}`);
      }
    } catch (err) {
      console.error('Failed to mark lesson as watched:', err);
    }
  };

  if (loading) return <div className="loading">Yüklənir...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!lessonData) return <div className="error">Dərs tapılmadı</div>;

  return (
    <div className="lesson-view">
      <div className="lesson-sidebar">
        <div className="sidebar-header">
          <h3>Mövcud dərslər</h3>
        </div>
        <nav className="lesson-navigation">
          <ul>
            {lessons.map((lesson) => (
              <li
                key={lesson.id}
                className={lesson.id === lessonId ? 'active' : ''}
              >
                <Link to={`/courses/${courseId}/lessons/${lesson.id}`}>
                  {lesson.title}
                  {progress[lesson.id] && <span className="completed-mark">✓</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="lesson-content">
        <h2>{lessonData.lesson.title}</h2>
        <div className="video-container">
          <video
            controls
            src={lessonData.lesson.videoUrl}
            poster="/video-placeholder.jpg"
            onEnded={handleVideoEnd}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className="lesson-navigation-buttons">
          {lessonData.prevLesson && (
            <Link 
              to={`/courses/${courseId}/lessons/${lessonData.prevLesson.id}`}
              className="nav-button prev"
            >
              ← Əvvəlki dərs
            </Link>
          )}
          {lessonData.nextLesson && (
            <Link 
              to={`/courses/${courseId}/lessons/${lessonData.nextLesson.id}`}
              className="nav-button next"
            >
              Növbəti dərs →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}; 