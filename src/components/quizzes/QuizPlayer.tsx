import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuiz } from '../../services/quizService';
import { Quiz, QuizQuestion } from '../../services/quizService';
import './QuizPlayer.css';

const QuizPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (id) {
      loadQuiz();
    }
  }, [id]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const quizData = await getQuiz(id!);
      setQuiz(quizData);
      // Initialize selected answers array with nulls
      setSelectedAnswers(new Array(quizData.questions.length).fill(null));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizSubmit = () => {
    if (!quiz) return;

    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctOptionIndex) {
        correctAnswers++;
      }
    });

    const percentage = (correctAnswers / quiz.questions.length) * 100;
    setScore(percentage);
    setQuizCompleted(true);
  };

  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D...
  };

  if (isLoading) {
    return <div>Yüklənir...</div>;
  }

  if (error || !quiz) {
    return <div className="error-message">{error || 'Test tapılmadı'}</div>;
  }

  const renderQuestion = (question: QuizQuestion) => (
    <div className="quiz-question">
      <h3 className="question-number">{currentQuestion + 1}. {question.text}</h3>
      <div className="answer-options">
        {question.options.map((option, index) => (
          <div 
            key={index} 
            className={`answer-option ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
            onClick={() => handleAnswerSelect(index)}
          >
            <div className="option-letter">{getOptionLetter(index)}</div>
            <div className="option-text">{option}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuizResult = () => (
    <div className="quiz-result">
      <h2>Test Nəticələri</h2>
      <div className="score-display">
        <div className="score">{Math.round(score)}%</div>
        <div className="score-text">
          {score >= quiz.passingScore 
            ? 'Təbriklər! Siz testi uğurla keçdiniz.' 
            : 'Təəssüf ki, siz testin keçid balını toplaya bilmədiniz.'}
        </div>
      </div>
      
      <div className="result-details">
        <div className="result-row">
          <span className="label">Doğru cavablar:</span>
          <span className="value">
            {selectedAnswers.filter((answer, index) => 
              answer === quiz.questions[index].correctOptionIndex
            ).length} 
            / {quiz.questions.length}
          </span>
        </div>
        <div className="result-row">
          <span className="label">Keçid balı:</span>
          <span className="value">{quiz.passingScore}%</span>
        </div>
      </div>
      
      <div className="result-actions">
        <button 
          className="btn btn-primary"
          onClick={() => {
            setCurrentQuestion(0);
            setSelectedAnswers(new Array(quiz.questions.length).fill(null));
            setQuizCompleted(false);
          }}
        >
          Yenidən Cəhd Et
        </button>
        <Link to={`/courses/${quiz.courseId}`} className="btn btn-secondary">
          Kursa Qayıt
        </Link>
      </div>
    </div>
  );

  return (
    <div className="quiz-player-container">
      <div className="lesson-sidebar">
        <div className="course-info">
          <h3>Giriş</h3>
          <div className="sidebar-lesson-list">
            <div className="sidebar-section">
              <div className="sidebar-section-header">
                <h4>Natural ədədlər</h4>
              </div>
              <ul>
                <li>
                  <span className="lesson-icon">►</span>
                  Dərs 2 - Toplama, çıxma, vurulma və bölünmə
                </li>
                <li>
                  <span className="lesson-icon">►</span>
                  Online sinif tərifi
                </li>
                <li>
                  <span className="lesson-icon">▣</span>
                  Məsələlər toplusu, mürəkkəb
                </li>
                {/* More lesson items */}
              </ul>
            </div>
            <div className="sidebar-section">
              <div className="sidebar-section-header">
                <h4>Adi və onluq kəsrlər</h4>
              </div>
              <ul>
                <li>
                  <span className="lesson-icon">►</span>
                  Sadə kəsrlər anlayışı
                </li>
                <li>
                  <span className="lesson-icon">⚑</span>
                  Ev tapşırığı
                </li>
                <li className="active">
                  <span className="lesson-icon">▣</span>
                  Natural ədədlər - Test
                </li>
                {/* More lesson items */}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="quiz-content">
        <div className="quiz-header">
          <h2>{quiz.title}</h2>
        </div>
        
        {!quizCompleted ? (
          <>
            <div className="quiz-main-content">
              {renderQuestion(quiz.questions[currentQuestion])}
            </div>
            
            <div className="quiz-navigation">
              <button 
                className="btn btn-secondary"
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
              >
                ◄ Əvvəlki Sual
              </button>
              
              <div className="question-progress">
                Sual {currentQuestion + 1} / {quiz.questions.length}
              </div>
              
              {currentQuestion < quiz.questions.length - 1 ? (
                <button 
                  className="btn btn-primary"
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestion] === null}
                >
                  Sonrakı Sual ►
                </button>
              ) : (
                <button 
                  className="btn btn-success"
                  onClick={handleQuizSubmit}
                  disabled={selectedAnswers.some(answer => answer === null)}
                >
                  Testi Tamamla
                </button>
              )}
            </div>
          </>
        ) : (
          renderQuizResult()
        )}
      </div>
    </div>
  );
};

export default QuizPlayer; 