import apiClient from '../api/apiClient';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  courseId: string;
  videoUrl?: string;
  content?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonData {
  title: string;
  description: string;
  courseId: string;
  videoUrl?: string;
  content?: string;
  order: number;
}

export const getLessons = async (courseId?: string): Promise<Lesson[]> => {
  const url = courseId ? `/lessons?courseId=${courseId}` : '/lessons';
  const response = await apiClient.get(url);
  return response.data as Lesson[];
};

export const getLesson = async (id: string): Promise<Lesson> => {
  const response = await apiClient.get(`/lessons/${id}`);
  return response.data as Lesson;
};

export const createLesson = async (data: CreateLessonData): Promise<Lesson> => {
  const response = await apiClient.post('/lessons', data);
  return response.data as Lesson;
};

export const updateLesson = async (id: string, data: Partial<CreateLessonData>): Promise<Lesson> => {
  const response = await apiClient.put(`/lessons/${id}`, data);
  return response.data as Lesson;
};

export const deleteLesson = async (id: string): Promise<void> => {
  await apiClient.delete(`/lessons/${id}`);
}; 