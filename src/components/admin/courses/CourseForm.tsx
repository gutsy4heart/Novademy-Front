import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCourse, updateCourse, getCourse } from '../../../services/courseService';

interface CourseFormData {
  title: string;
  description: string;
  price: number;
  status: string;
}

const initialFormData: CourseFormData = {
  title: '',
  description: '',
  price: 0,
  status: 'Draft'
};

const CourseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCourse();
    }
  }, [id]);

  const loadCourse = async () => {
    try {
      setIsLoading(true);
      const course = await getCourse(id!);
      setFormData({
        title: course.title,
        description: course.description,
        price: course.price,
        status: course.status
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
        await updateCourse(id, formData);
      } else {
        await createCourse(formData);
      }
      navigate('/admin/courses');
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
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  if (isLoading && id) {
    return <div>Yüklənir...</div>;
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
          <label htmlFor="price">Qiymət (AZN)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Draft">Qaralama</option>
            <option value="Published">Dərc edilib</option>
            <option value="Archived">Arxivləşdirilib</option>
          </select>
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