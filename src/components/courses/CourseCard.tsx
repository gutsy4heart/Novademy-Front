import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../../services/courseService';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="course-card">
      <div className="course-info">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="course-meta">
          <span className="price">{course.price} AZN</span>
          <span className="subject">{course.subject}</span>
        </div>
        <Link to={`/courses/${course.id}`} className="btn-details">
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export default CourseCard; 