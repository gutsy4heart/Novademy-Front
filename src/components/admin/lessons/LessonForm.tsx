import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lesson, getLesson, createLesson, updateLesson, CreateLessonData } from '../../../api/lessonService';
import { getCourses, Course } from '../../../api/courseService';
import '../../admin/Admin.css';

const LessonForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CreateLessonData>({
    title: '',
    description: '',
    courseId: '',
    video: null,
    content: '',
    order: 0
  });
  
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load available courses for dropdown
        const coursesData = await getCourses();
        setCourses(coursesData);
        
        // If ID is provided, load lesson data for editing
        if (id && id !== 'new') {
          const lesson = await getLesson(id);
          setFormData({
            title: lesson.title,
            description: lesson.description,
            courseId: lesson.courseId,
            video: null,
            content: lesson.content || '',
            order: lesson.order
          });
          if (lesson.videoUrl) {
            setVideoPreview(lesson.videoUrl);
          }
        }
        
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Məlumatları yükləmək mümkün olmadı');
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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, video: file }));
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
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
      setError(err.message || 'Dərsi saxlamaq mümkün olmadı');
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Yüklənir...</div>;
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
          <label htmlFor="video">Video</label>
          <input
            type="file"
            id="video"
            name="video"
            accept="video/*"
            onChange={handleVideoChange}
          />
          {videoPreview && (
            <div className="video-preview">
              <video controls src={videoPreview} className="preview-video" />
            </div>
          )}
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
        
        <div className="form-actions">
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