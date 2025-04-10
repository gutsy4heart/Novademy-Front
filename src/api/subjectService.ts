import apiClient from './apiClient';

export interface Subject {
  id: number;
  name: string;
  description: string;
  teacherId: number;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  subjectId: number;
}

export const subjectService = {
  // Получение всех предметов
  async getAllSubjects(): Promise<Subject[]> {
    const response = await apiClient.get<Subject[]>('/subjects');
    return response.data;
  },

  // Получение предмета по ID
  async getSubjectById(id: number): Promise<Subject> {
    const response = await apiClient.get<Subject>(`/subjects/${id}`);
    return response.data;
  },

  // Создание нового предмета (для учителей и админов)
  async createSubject(subject: Omit<Subject, 'id'>): Promise<Subject> {
    const response = await apiClient.post<Subject>('/subjects', subject);
    return response.data;
  },

  // Обновление предмета (для учителей и админов)
  async updateSubject(id: number, subject: Partial<Subject>): Promise<Subject> {
    const response = await apiClient.put<Subject>(`/subjects/${id}`, subject);
    return response.data;
  },

  // Удаление предмета (для админов)
  async deleteSubject(id: number): Promise<void> {
    await apiClient.delete(`/subjects/${id}`);
  },

  // Получение уроков по предмету
  async getLessonsBySubject(subjectId: number): Promise<Lesson[]> {
    const response = await apiClient.get<Lesson[]>(`/subjects/${subjectId}/lessons`);
    return response.data;
  },

  // Получение урока по ID
  async getLessonById(subjectId: number, lessonId: number): Promise<Lesson> {
    const response = await apiClient.get<Lesson>(`/subjects/${subjectId}/lessons/${lessonId}`);
    return response.data;
  }
}; 