import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Quiz, QuizQuestion, getQuiz, createQuiz, updateQuiz, CreateQuizData } from '../../../services/quizService';
import { getCourses } from '../../../services/courseService';
import '../../admin/Admin.css';

interface CourseOption {
  id: string;
  title: string;
}

interface FormQuestion {
  id?: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

const QuizForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CreateQuizData>({
    title: '',
    description: '',
    courseId: '',
    timeLimit: 30,
    passingScore: 70,
    questions: []
  });
  
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load available courses for dropdown
        const coursesData = await getCourses();
        setCourses(coursesData.map(course => ({
          id: course.id,
          title: course.title
        })));
        
        // If ID is provided, load quiz data for editing
        if (id && id !== 'new') {
          const quiz = await getQuiz(id);
          setFormData({
            title: quiz.title,
            description: quiz.description,
            courseId: quiz.courseId,
            timeLimit: quiz.timeLimit || 30,
            passingScore: quiz.passingScore,
            questions: quiz.questions.map(q => ({
              id: q.id,
              text: q.text,
              options: q.options,
              correctOptionIndex: q.correctOptionIndex
            }))
          });
        } else {
          // Add one empty question to start with
          setFormData(prev => ({
            ...prev,
            questions: [
              {
                text: '',
                options: ['', '', '', ''],
                correctOptionIndex: 0
              }
            ]
          }));
        }
        
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'timeLimit' || name === 'passingScore') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleQuestionChange = (index: number, field: keyof FormQuestion, value: any) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = {
        ...newQuestions[index],
        [field]: value
      };
      return {
        ...prev,
        questions: newQuestions
      };
    });
  };
  
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      const newOptions = [...newQuestions[questionIndex].options];
      newOptions[optionIndex] = value;
      newQuestions[questionIndex] = {
        ...newQuestions[questionIndex],
        options: newOptions
      };
      return {
        ...prev,
        questions: newQuestions
      };
    });
  };
  
  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: '',
          options: ['', '', '', ''],
          correctOptionIndex: 0
        }
      ]
    }));
  };
  
  const removeQuestion = (index: number) => {
    if (formData.questions.length > 1) {
      setFormData(prev => {
        const newQuestions = [...prev.questions];
        newQuestions.splice(index, 1);
        return {
          ...prev,
          questions: newQuestions
        };
      });
    } else {
      setError('Test ən azı bir suala sahib olmalıdır');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate questions
    if (formData.questions.length === 0) {
      setError('Test ən azı bir suala sahib olmalıdır');
      return;
    }
    
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.text.trim()) {
        setError(`Sual ${i + 1} boş ola bilməz`);
        return;
      }
      
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          setError(`Sual ${i + 1}, Variant ${j + 1} boş ola bilməz`);
          return;
        }
      }
    }
    
    try {
      setSaving(true);
      
      if (id && id !== 'new') {
        await updateQuiz(id, formData);
      } else {
        await createQuiz(formData);
      }
      
      navigate('/admin/quizzes');
    } catch (err: any) {
      setError(err.message || 'Failed to save quiz');
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <div className="admin-content">
      <div className="page-header">
        <h1>{id && id !== 'new' ? 'Testi düzəliş et' : 'Yeni test əlavə et'}</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="title">Başlıq</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Təsvir</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="courseId">Kurs</label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
          >
            <option value="">Kurs seçin</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="timeLimit">Vaxt limiti (dəqiqə)</label>
          <input
            type="number"
            id="timeLimit"
            name="timeLimit"
            value={formData.timeLimit}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="passingScore">Keçid balı (%)</label>
          <input
            type="number"
            id="passingScore"
            name="passingScore"
            value={formData.passingScore}
            onChange={handleChange}
            min="1"
            max="100"
            required
          />
        </div>
        
        <h2>Suallar</h2>
        
        {formData.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="question-container">
            <h3>Sual {questionIndex + 1}</h3>
            
            <div className="form-group">
              <label htmlFor={`question-${questionIndex}`}>Sual mətni</label>
              <input
                type="text"
                id={`question-${questionIndex}`}
                value={question.text}
                onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                required
              />
            </div>
            
            <div className="options-container">
              <h4>Variantlar</h4>
              
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="form-group option-group">
                  <div className="option-input">
                    <label htmlFor={`question-${questionIndex}-option-${optionIndex}`}>
                      Variant {optionIndex + 1}
                    </label>
                    <input
                      type="text"
                      id={`question-${questionIndex}-option-${optionIndex}`}
                      value={option}
                      onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="option-radio">
                    <input
                      type="radio"
                      id={`question-${questionIndex}-correct-${optionIndex}`}
                      name={`question-${questionIndex}-correct`}
                      checked={question.correctOptionIndex === optionIndex}
                      onChange={() => handleQuestionChange(questionIndex, 'correctOptionIndex', optionIndex)}
                      required
                    />
                    <label htmlFor={`question-${questionIndex}-correct-${optionIndex}`}>
                      Düzgün cavab
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={() => removeQuestion(questionIndex)}
              className="btn-danger question-remove-btn"
              disabled={formData.questions.length <= 1}
            >
              Sualı sil
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addQuestion}
          className="btn-secondary"
        >
          Yeni sual əlavə et
        </button>
        
        <div className="form-buttons">
          <button 
            type="button" 
            onClick={() => navigate('/admin/quizzes')} 
            className="btn-secondary"
          >
            Geri qayıt
          </button>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={saving}
          >
            {saving ? 'Saxlanılır...' : 'Saxla'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizForm; 