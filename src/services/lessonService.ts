import apiClient from '../api/apiClient';

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  courseId: string;
  order: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonResponse {
  lesson: Lesson;
  nextLesson?: Lesson;
  prevLesson?: Lesson;
}

export const lessonService = {
  // Получить все уроки курса
  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    try {
      const response = await apiClient.get(`/courses/${courseId}/lessons`);
      return response.data as Lesson[];
    } catch (error) {
      throw new Error('Failed to fetch lessons');
    }
  },

  // Получить конкретный урок с информацией о следующем и предыдущем уроках
  async getLesson(courseId: string, lessonId: string): Promise<LessonResponse> {
    try {
      const response = await apiClient.get(`/courses/${courseId}/lessons/${lessonId}`);
      return response.data as LessonResponse;
    } catch (error) {
      throw new Error('Failed to fetch lesson');
    }
  },

  // Отметить урок как просмотренный
  async markLessonAsWatched(courseId: string, lessonId: string): Promise<void> {
    try {
      await apiClient.post(`/courses/${courseId}/lessons/${lessonId}/watch`);
    } catch (error) {
      throw new Error('Failed to mark lesson as watched');
    }
  },

  // Получить прогресс просмотра уроков курса
  async getLessonProgress(courseId: string): Promise<{ [key: string]: boolean }> {
    try {
      const response = await apiClient.get(`/courses/${courseId}/lessons/progress`);
      return response.data as { [key: string]: boolean };
    } catch (error) {
      throw new Error('Failed to fetch lesson progress');
    }
  }
}; 