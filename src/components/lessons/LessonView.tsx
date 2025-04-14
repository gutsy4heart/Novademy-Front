import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { lessonService, Lesson } from '../../api/lessonService';
import './LessonView.css';

export const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = React.useState<Lesson | null>(null);
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
        setLessons(lessonsData.sort((a, b) => a.order - b.order));
        const progressData = await lessonService.getLessonProgress(courseId);
        setProgress(progressData);
      } catch (err: any) {
        setError(err.message || 'Dərslərin siyahısı yüklənərkən xəta baş verdi');
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
        const data = await lessonService.getLessonById(courseId, lessonId);
        setCurrentLesson(data);
      } catch (err: any) {
        setError(err.message || 'Dərs yüklənərkən xəta baş verdi');
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
      setProgress(prev => ({ ...prev, [lessonId]: true }));
      
      // Находим следующий урок
      const currentIndex = lessons.findIndex(lesson => lesson.id === lessonId);
      const nextLesson = lessons[currentIndex + 1];
      
      if (nextLesson) {
        navigate(`/courses/${courseId}/lessons/${nextLesson.id}`);
      }
    } catch (err: any) {
      console.error('Failed to mark lesson as watched:', err.message);
    }
  };

  if (loading) return <div className="loading">Yüklənir...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!currentLesson) return <div className="error">Dərs tapılmadı</div>;

  // Находим предыдущий и следующий уроки
  const currentIndex = lessons.findIndex(lesson => lesson.id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

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
        <h2>{currentLesson.title}</h2>
        <div className="video-container">
          <video
            controls
            src={currentLesson.videoUrl}
            poster={currentLesson.imageUrl || "/video-placeholder.jpg"}
            onEnded={handleVideoEnd}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        
        {currentLesson.description && (
          <div className="lesson-description">
            <h3>Təsvir</h3>
            <p>{currentLesson.description}</p>
          </div>
        )}
        
        <div className="lesson-navigation-buttons">
          {prevLesson && (
            <Link 
              to={`/courses/${courseId}/lessons/${prevLesson.id}`}
              className="nav-button prev"
            >
              ← Əvvəlki dərs
            </Link>
          )}
          {nextLesson && (
            <Link 
              to={`/courses/${courseId}/lessons/${nextLesson.id}`}
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