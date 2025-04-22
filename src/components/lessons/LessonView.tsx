import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { lessonService, Lesson } from '../../api/lessonService';
import CommentSection from './CommentSection';

export const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = React.useState<Lesson | null>(null);
  const [lessons, setLessons] = React.useState<Lesson[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<{ [key: string]: boolean }>({});
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto max-w-4xl my-8">
        <p>{error}</p>
      </div>
    );
  }
  
  if (!currentLesson) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mx-auto max-w-4xl my-8">
        <p>Dərs tapılmadı</p>
      </div>
    );
  }

  // Находим предыдущий и следующий уроки
  const currentIndex = lessons.findIndex(lesson => lesson.id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile lesson navigation toggle */}
      <div className="lg:hidden bg-white border-b p-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-between w-full"
        >
          <span className="font-medium">Dərslər</span>
          <svg 
            className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className={`bg-white border-r border-gray-200 w-full lg:w-72 lg:min-w-72 lg:block ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-lg">Mövcud dərslər</h3>
          </div>
          <nav className="overflow-y-auto h-[calc(100vh-4rem)]">
            <ul className="divide-y divide-gray-200">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link 
                    to={`/courses/${courseId}/lessons/${lesson.id}`}
                    className={`flex items-center p-4 hover:bg-gray-50 ${lesson.id === lessonId ? 'bg-blue-50 border-l-4 border-primary' : ''}`}
                  >
                    <div className="flex-1">
                      <span className={`block ${lesson.id === lessonId ? 'font-semibold text-primary' : ''}`}>
                        {lesson.title}
                      </span>
                    </div>
                    {progress[lesson.id] && (
                      <span className="ml-2 text-green-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{currentLesson.title}</h1>
            
            {/* Video player */}
            <div className="bg-black rounded-lg overflow-hidden shadow-lg mb-8 aspect-video">
              <video
                className="w-full h-full"
                controls
                src={currentLesson.videoUrl}
                poster={currentLesson.imageUrl || "/video-placeholder.jpg"}
                onEnded={handleVideoEnd}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            {/* Lesson description */}
            {currentLesson.description && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Təsvir</h2>
                <div className="prose max-w-none">
                  <p>{currentLesson.description}</p>
                </div>
              </div>
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-between mb-8">
              {prevLesson ? (
                <Link 
                  to={`/courses/${courseId}/lessons/${prevLesson.id}`}
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Əvvəlki dərs
                </Link>
              ) : (
                <div></div>
              )}
              {nextLesson && (
                <Link 
                  to={`/courses/${courseId}/lessons/${nextLesson.id}`}
                  className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white transition-colors"
                >
                  Növbəti dərs
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
            
            {/* Comments section */}
            {lessonId && <CommentSection lessonId={lessonId} />}
          </div>
        </main>
      </div>
    </div>
  );
}; 