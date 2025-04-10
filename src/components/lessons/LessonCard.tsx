import React from 'react';
import { Link } from 'react-router-dom';

interface Lesson {
  id: number;
  title: string;
  description: string;
  hasVideo: boolean;
  hasTest: boolean;
}

interface LessonCardProps {
  lesson: Lesson;
  subjectId: number;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, subjectId }) => {
  return (
    <div className="lesson-card">
      <h3>{lesson.title}</h3>
      <p>{lesson.description}</p>
      <div className="lesson-actions">
        <Link to={`/subjects/${subjectId}/lessons/${lesson.id}`}>
          Материалы
        </Link>
        {lesson.hasVideo && (
          <Link to={`/subjects/${subjectId}/lessons/${lesson.id}/video`}>
            Видеоурок
          </Link>
        )}
        {lesson.hasTest && (
          <Link to={`/subjects/${subjectId}/lessons/${lesson.id}/test`}>
            Тест
          </Link>
        )}
      </div>
    </div>
  );
};

export default LessonCard; 