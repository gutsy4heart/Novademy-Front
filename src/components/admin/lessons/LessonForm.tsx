import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createLesson, updateLesson, getLesson } from '../../../services/lessonService';
import { getCourses } from '../../../services/courseService';

interface LessonFormData {
  title: string;
  description: string;
  courseId: string;
  videoUrl: string;
  content: string;
  order: number;
}

interface Course {
  id: string;
  title: string;
}

const initialFormData: LessonFormData = {
  title: '',
  description: '',
  courseId: '',
  videoUrl: '',
  content: '',
  order: 1
};

const LessonForm: React.FC = () => {
  const { id, courseId } = useParams<{ id: string; courseId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LessonFormData>(initialFormData);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
    
    if (id) {
      loadLesson();
    } else if (courseId) {
      setFormData(prev => ({ ...prev, courseId }));
    }
  }, [id, courseId]);

  const loadCourses = async () => {
    try {
      const coursesData = await getCourses();
      setCourses(coursesData);
    } catch (err: any) {
      setError("Не удалось загрузить список курсов: " + err.message);
    }
  };

  const loadLesson = async () => {
    try {
      setIsLoading(true);
      const lesson = await getLesson(id!);
      setFormData({
        title: lesson.title,
        description: lesson.description,
        courseId: lesson.courseId,
        videoUrl: lesson.videoUrl || '',
        content: lesson.content || '',
        order: lesson.order
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (id) {
        await updateLesson(id, formData);
      } else {
        await createLesson(formData);
      }
      
      if (courseId) {
        navigate(`/admin/courses/${courseId}/lessons`);
      } else {
        navigate('/admin/lessons');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value
    }));
  };

  if (isLoading && id) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>{id ? 'Редактировать урок' : 'Новый урок'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="title">Название урока</label>
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
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="courseId">Курс</label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            disabled={!!courseId}
          >
            <option value="">Выберите курс</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="videoUrl">URL видео (необязательно)</label>
          <input
            type="url"
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Контент урока</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
          />
        </div>

        <div className="form-group">
          <label htmlFor="order">Порядок</label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => courseId 
              ? navigate(`/admin/courses/${courseId}/lessons`) 
              : navigate('/admin/lessons')
            }
          >
            Отмена
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : id ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LessonForm; 