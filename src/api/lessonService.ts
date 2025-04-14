import apiClient from './apiClient';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  order: number;
  transcript?: string;
  imageUrl?: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  isFree?: boolean;
}

export interface CreateLessonData {
  title: string;
  description: string;
  video: File;
  order: number;
  transcript?: string;
  image?: File;
  courseId: string;
}

export const lessonService = {
  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    try {
      const response = await apiClient.get<Lesson[]>(`/courses/${courseId}/lessons`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch lessons');
    }
  },

  async getLessonById(courseId: string, lessonId: string): Promise<Lesson> {
    try {
      const response = await apiClient.get<Lesson>(`/courses/${courseId}/lessons/${lessonId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch lesson');
    }
  },

  async createLesson(data: CreateLessonData): Promise<Lesson> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('video', data.video);
      formData.append('order', data.order.toString());
      if (data.transcript) formData.append('transcript', data.transcript);
      formData.append('courseId', data.courseId);
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await apiClient.post<Lesson>(`/courses/${data.courseId}/lessons`, formData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create lesson');
    }
  },

  async updateLesson(courseId: string, lessonId: string, data: Partial<CreateLessonData>): Promise<Lesson> {
    try {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.video) formData.append('video', data.video);
      if (data.order) formData.append('order', data.order.toString());
      if (data.transcript) formData.append('transcript', data.transcript);
      if (data.image) formData.append('image', data.image);

      const response = await apiClient.put<Lesson>(`/courses/${courseId}/lessons/${lessonId}`, formData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update lesson');
    }
  },

  async deleteLesson(courseId: string, lessonId: string): Promise<void> {
    try {
      await apiClient.delete(`/courses/${courseId}/lessons/${lessonId}`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to delete lesson');
    }
  },

  async markLessonAsWatched(courseId: string, lessonId: string): Promise<void> {
    try {
      await apiClient.post(`/courses/${courseId}/lessons/${lessonId}/watch`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to mark lesson as watched');
    }
  },

  async getLessonProgress(courseId: string): Promise<{ [key: string]: boolean }> {
    try {
      const response = await apiClient.get<{ [key: string]: boolean }>(`/courses/${courseId}/lessons/progress`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch lesson progress');
    }
  }
}; 