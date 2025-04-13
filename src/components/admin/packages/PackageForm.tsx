import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CoursePackage, getPackage, createPackage, updatePackage, CreatePackageData } from '../../../services/packageService';
import { getCourses } from '../../../services/courseService';
import '../../admin/Admin.css';

interface CourseOption {
  id: string;
  title: string;
}

const PackageForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CreatePackageData>({
    title: '',
    description: '',
    price: 0,
    courseIds: [],
    discount: 0,
    duration: 30,
    status: 'active'
  });
  
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load available courses for multiselect
        const coursesData = await getCourses();
        setCourses(coursesData.map(course => ({
          id: course.id,
          title: course.title
        })));
        
        // If ID is provided, load package data for editing
        if (id && id !== 'new') {
          const packageData = await getPackage(id);
          setFormData({
            title: packageData.title,
            description: packageData.description,
            price: packageData.price,
            courseIds: packageData.courseIds,
            discount: packageData.discount,
            duration: packageData.duration,
            status: packageData.status
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
    
    if (name === 'price' || name === 'discount' || name === 'duration') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleCourseSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      courseIds: selectedOptions
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      if (id && id !== 'new') {
        await updatePackage(id, formData);
      } else {
        await createPackage(formData);
      }
      
      navigate('/admin/packages');
    } catch (err: any) {
      setError(err.message || 'Failed to save package');
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return (
    <div className="admin-content">
      <div className="page-header">
        <h1>{id && id !== 'new' ? 'Paketi düzəliş et' : 'Yeni paket əlavə et'}</h1>
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
          <label htmlFor="discount">Endirim (%)</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            min="0"
            max="100"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="duration">Müddət (gün)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="courseIds">Kurslar</label>
          <select
            id="courseIds"
            name="courseIds"
            multiple
            value={formData.courseIds}
            onChange={handleCourseSelection}
            required
            size={5}
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <small>Ctrl və ya Cmd düyməsi ilə bir neçə kurs seçə bilərsiniz.</small>
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
            <option value="active">Aktiv</option>
            <option value="inactive">Deaktiv</option>
          </select>
        </div>
        
        <div className="form-buttons">
          <button 
            type="button" 
            onClick={() => navigate('/admin/packages')} 
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

export default PackageForm; 