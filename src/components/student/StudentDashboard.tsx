import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEnrolledCourses, EnrolledCourse } from '../../api/studentService';
import '../../styles/StudentDashboard.css';

const StudentDashboard: React.FC = () => {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const enrolledCourses = await getEnrolledCourses();
        setCourses(enrolledCourses);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="student-dashboard">
      <h1>Mənim Kurslarım</h1>
      
      {loading && <div className="loading">Kurslar yüklənir...</div>}
      
      {error && <div className="error-message">{error}</div>}
      
      {!loading && !error && courses.length === 0 && (
        <div className="no-courses">
          <p>Hal-hazırda heç bir kursa qeydiyyatdan keçməmisiniz.</p>
          <Link to="/courses" className="browse-button">Kursları göstər</Link>
        </div>
      )}
      
      {!loading && !error && courses.length > 0 && (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                {course.imageUrl ? (
                  <img src={course.imageUrl} alt={course.title} />
                ) : (
                  <div className="no-image">Şəkil yoxdur</div>
                )}
              </div>
              <div className="course-info">
                <h3>{course.title}</h3>
                <p>{course.description.length > 100 
                  ? `${course.description.substring(0, 100)}...` 
                  : course.description}
                </p>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{course.progress}% tamamlanıb</span>
                </div>
                <Link 
                  to={`/courses/${course.id}`} 
                  className="continue-button"
                >
                  {course.progress > 0 ? 'Davam et' : 'Başla'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard; 