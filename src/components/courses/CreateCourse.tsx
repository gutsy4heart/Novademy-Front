import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateCourseData, SubjectType, courseService } from '../../api/courseService';

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateCourseData>({
    title: '',
    description: '',
    subject: SubjectType.Math,
    image: undefined
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await courseService.createCourse(formData);
      navigate('/courses');
    } catch (err) {
      setError('Ошибка при создании курса');
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
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
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Предмет</label>
          <select
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value as SubjectType })}
            required
          >
            {Object.values(SubjectType).map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Изображение</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit">Создать курс</button>
      </form>
    </div>
  );
};

export default CreateCourse; 