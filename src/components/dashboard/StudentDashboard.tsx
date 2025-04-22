import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getFullName } from '../../api/authService';
import { getEnrolledCourses } from '../../api/studentService';

// Define a basic type for the course data
interface CourseCard {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Fetch courses
        const enrolledCourses = await getEnrolledCourses();
        
        // Map API data to our interface
        const formattedCourses = enrolledCourses.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          imageUrl: course.imageUrl,
          progress: course.progress || 0,
          completedLessons: course.completedLessons || 0,
          totalLessons: course.totalLessons || 0
        }));
        
        setCourses(formattedCourses);
      } catch (err: any) {
        setError(err.message || 'Kursları yükləmək mümkün olmadı');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Xoş gəlmisiniz, {user ? getFullName(user) : 'Tələbə'}!
        </h1>
        <p className="text-white text-opacity-90">
          Təhsilinizə davam etmək üçün kurslarınızdan birini seçin
        </p>
      </div>

      <h2 className="text-xl md:text-2xl font-semibold mb-6">Kurslarım</h2>

      {courses.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-600 mb-4">Hələ heç bir kursa qeydiyyatdan keçməmisiniz</h3>
          <p className="text-gray-500 mb-6">Kursları araşdırın və təhsilinizə başlamaq üçün birinə qoşulun</p>
          <Link 
            to="/courses" 
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Kursları araşdır
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {course.imageUrl ? (
                <img 
                  src={course.imageUrl} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-lg">Kurs şəkli</span>
                </div>
              )}
              
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Tamamlanıb: {course.completedLessons}/{course.totalLessons}</span>
                    <span>{Math.round(course.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <Link 
                  to={`/courses/${course.id}`} 
                  className="block text-center py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
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