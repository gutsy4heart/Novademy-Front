import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lesson, getLesson, createLesson, updateLesson, CreateLessonData } from '../../../services/lessonService';
import { getCourses } from '../../../services/courseService';
import '../../admin/Admin.css';

interface CourseOption {
  id: string;
  title: string;
}

const LessonForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CreateLessonData>({
    title: '',
    description: '',
    courseId: '',
    videoUrl: '',
    content: '',
    order: 0
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
        
        // If ID is provided, load lesson data for editing
        if (id && id !== 'new') {
          const lesson = await getLesson(id);
          setFormData({
            title: lesson.title,
            description: lesson.description,
            courseId: lesson.courseId,
            videoUrl: lesson.videoUrl || '',
            content: lesson.content || '',
            order: lesson.order
          });
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
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      if (id && id !== 'new') {
        await updateLesson(id, formData);
      } else {
        await createLesson(formData);
      }
      
      navigate('/admin/lessons');
    } catch (err: any) {
      setError(err.message || 'Failed to save lesson');
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <div className="admin-content">
      <div className="page-header">
        <h1>{id && id !== 'new' ? 'Dərsi düzəliş et' : 'Yeni dərs əlavə et'}</h1>
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
          <label htmlFor="videoUrl">Video URL (ixtiyari)</label>
          <input
            type="text"
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Məzmun (ixtiyari)</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="order">Sıra</label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        
        <div className="form-buttons">
          <button 
            type="button" 
            onClick={() => navigate('/admin/lessons')} 
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

export default LessonForm; 