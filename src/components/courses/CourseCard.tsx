import React from 'react';
import { Link } from 'react-router-dom';
import { Course, SubjectType } from '../../api/courseService';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="course-card">
      {course.imageUrl && (
        <img src={course.imageUrl} alt={course.title} className="course-image" />
      )}
      <div className="course-content">
        <h3>{course.title}</h3>
        <p className="subject">{SubjectType[course.subject]}</p>
        <p className="description">{course.description}</p>
        <Link to={`/courses/${course.id}`} className="view-course">
          Перейти к курсу
        </Link>
      </div>
    </div>
  );
};

export default CourseCard; 