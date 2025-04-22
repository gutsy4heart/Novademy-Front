import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourse, Course } from '../../api/courseService';
import { getEnrolledCourses, getLessonProgress, LessonProgress, getCourseLessons } from '../../api/studentService';
import { Lesson } from '../../api/lessonService';
import '../../styles/CourseView.css';

interface RouteParams {
  courseId: string;
  [key: string]: string | undefined;
}

const CourseView: React.FC = () => {
  const { courseId } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        // Get course details and lessons in parallel
        const [courseData, lessonData, enrolledCourses] = await Promise.all([
          getCourse(courseId),
          getCourseLessons(courseId),
          getEnrolledCourses()
        ]);
        
        setCourse(courseData);
        setLessons(lessonData);
        
        // Check if user is enrolled in this course
        const enrolledCourse = enrolledCourses.find(c => c.id === courseId);
        
        if (!enrolledCourse) {
          setError("Bu kursa qeydiyyatdan keçməmisiniz");
          setLoading(false);
          return;
        }
        
        // Get lesson progress for the course
        const progressData = await getLessonProgress(courseId);
        setProgress(progressData);
        
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const calculateOverallProgress = (): number => {
    if (!progress || !lessons.length) return 0;
    
    const completedLessons = Object.values(progress).filter(p => p.completed).length;
    return Math.round((completedLessons / lessons.length) * 100);
  };

  const handleLessonClick = (lessonId: string) => {
    navigate(`/courses/${courseId}/lessons/${lessonId}`);
  };

  if (loading) {
    return <div className="loading">Kurs məlumatları yüklənir...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!course) {
    return <div className="error-message">Kurs tapılmadı</div>;
  }

  return (
    <div className="course-view">
      <div className="course-header">
        <Link to="/dashboard" className="back-button">
          &larr; Kurslara qayıt
        </Link>
        <h1>{course.title}</h1>
        <div className="course-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${calculateOverallProgress()}%` }}
            ></div>
          </div>
          <span className="progress-text">{calculateOverallProgress()}% tamamlanıb</span>
        </div>
      </div>

      <div className="course-description">
        <p>{course.description}</p>
      </div>
      
      <div className="lessons-container">
        <h2>Dərslər</h2>
        {lessons.length === 0 ? (
          <p className="no-lessons">Bu kursda hələ dərs yoxdur.</p>
        ) : (
          <div className="lessons-list">
            {lessons.map((lesson, index) => {
              // Get lesson progress for this lesson
              const lessonProgress = progress?.[lesson.id];
              const isCompleted = lessonProgress?.completed || false;
              
              return (
                <div 
                  key={lesson.id} 
                  className={`lesson-item ${isCompleted ? 'completed' : ''}`}
                  onClick={() => handleLessonClick(lesson.id)}
                >
                  <div className="lesson-number">{index + 1}</div>
                  <div className="lesson-details">
                    <h3>{lesson.title}</h3>
                    <p>{lesson.description}</p>
                  </div>
                  <div className="lesson-status">
                    {isCompleted ? (
                      <span className="completed-icon">✓</span>
                    ) : (
                      <span className="duration">
                        {lesson.videoUrl ? 
                          "Video" :
                          "Videosuz"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseView; 