import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Subject, subjectService } from '../../api/subjectService';

const SubjectList: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await subjectService.getAllSubjects();
        setSubjects(data);
      } catch (err) {
        setError('Ошибка при загрузке предметов');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="subject-list">
      <h2>Предметы</h2>
      <div className="subjects-grid">
        {subjects.map((subject) => (
          <div key={subject.id} className="subject-card">
            <h3>{subject.name}</h3>
            <p>{subject.description}</p>
            <Link to={`/subjects/${subject.id}`}>Перейти к предмету</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectList; 