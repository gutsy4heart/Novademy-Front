import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateCourseData, SubjectType, createCourse } from '../../services/courseService';

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateCourseData>({
    title: '',
    description: '',
    price: 0,
    subject: SubjectType.MATH,
    status: 'Draft'
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createCourse(formData);
      navigate('/courses');
    } catch (err) {
      console.error('Error creating course:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };

  return (
    <div className="create-course">
      <h2>Создать новый курс</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Название</label>
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
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Цена</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Статус</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Draft">Черновик</option>
            <option value="Published">Опубликован</option>
            <option value="Archived">Архивирован</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="subject">Предмет</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            {Object.values(SubjectType).map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Создать курс</button>
      </form>
    </div>
  );
};

export default CreateCourse; 