import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Quiz, getQuizzes, deleteQuiz } from '../../../services/quizService';
import '../../admin/Admin.css';

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getQuizzes();
      setQuizzes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(id);
        setQuizzes(quizzes.filter(quiz => quiz.id !== id));
      } catch (err: any) {
        setError(err.message || 'Failed to delete quiz');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-content">
      <div className="page-header">
        <h1>Testlər</h1>
        <Link to="/admin/quizzes/new" className="btn-primary">Yeni test əlavə et</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Başlıq</th>
              <th>Kurs</th>
              <th>Sualların sayı</th>
              <th>Vaxt</th>
              <th>Fəaliyyətlər</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-data">Heç bir test tapılmadı</td>
              </tr>
            ) : (
              quizzes.map(quiz => (
                <tr key={quiz.id}>
                  <td>{quiz.title}</td>
                  <td>{quiz.courseId}</td>
                  <td>{quiz.questions.length}</td>
                  <td>{quiz.timeLimit} dəqiqə</td>
                  <td className="table-actions">
                    <button
                      onClick={() => navigate(`/admin/quizzes/${quiz.id}`)}
                      className="btn-secondary"
                    >
                      Düzəliş et
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="btn-danger"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizList; 