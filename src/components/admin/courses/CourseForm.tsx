import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courseService, CreateCourseData } from '../../../api/courseService';
import { SubjectType } from '../../../types/enums';

interface CourseFormData extends CreateCourseData {
  image?: File;
}

const initialFormData: CourseFormData = {
  title: '',
  description: '',
  subject: SubjectType.Math,
  image: undefined
};

const CourseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCourse();
    }
  }, [id]);

  const loadCourse = async () => {
    try {
      setIsLoading(true);
      const course = await courseService.getCourse(id!);
      setFormData({
        title: course.title,
        description: course.description,
        subject: course.subject
      });
      if (course.imageUrl) {
        setImagePreview(course.imageUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Kurs yüklənərkən xəta baş verdi');
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
        await courseService.updateCourse(id, formData);
      } else {
        await courseService.createCourse(formData);
      }
      navigate('/admin/courses');
    } catch (err: any) {
      setError(err.message || 'Kurs yadda saxlanılarkən xəta baş verdi');
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
      [name]: name === 'subject' ? value as SubjectType : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading && id) {
    return <div className="loading">Yüklənir...</div>;
  }

  return (
    <div>
      <h1>{id ? 'Kursu Düzəlt' : 'Yeni Kurs'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="title">Kursun adı</label>
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
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Fənn</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            {Object.values(SubjectType).map(subject => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Şəkil</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Course preview" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/courses')}
          >
            Ləğv et
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Yüklənir...' : id ? 'Yadda saxla' : 'Yarat'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm; 