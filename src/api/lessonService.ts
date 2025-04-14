import apiClient from './apiClient';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  imageUrl?: string;
  order: number;
  content?: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonData {
  title: string;
  description: string;
  video: File | null;
  order: number;
  content?: string;
  courseId: string;
}

export const lessonService = {
  async getLessons(): Promise<Lesson[]> {
    try {
      const response = await apiClient.get<Lesson[]>('/lessons');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Dərsləri yükləmək mümkün olmadı');
    }
  },

  async getLesson(id: string): Promise<Lesson> {
    try {
      const response = await apiClient.get<Lesson>(`/lessons/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Dərsi yükləmək mümkün olmadı');
    }
  },

  async createLesson(data: CreateLessonData): Promise<Lesson> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      if (data.video) formData.append('video', data.video);
      formData.append('order', data.order.toString());
      if (data.content) formData.append('content', data.content);
      formData.append('courseId', data.courseId);

      const response = await apiClient.post<Lesson>('/lessons', formData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Dərsi yaratmaq mümkün olmadı');
    }
  },

  async updateLesson(id: string, data: Partial<CreateLessonData>): Promise<Lesson> {
    try {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.video) formData.append('video', data.video);
      if (data.order) formData.append('order', data.order.toString());
      if (data.content) formData.append('content', data.content);
      if (data.courseId) formData.append('courseId', data.courseId);

      const response = await apiClient.put<Lesson>(`/lessons/${id}`, formData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Dərsi yeniləmək mümkün olmadı');
    }
  },

  async deleteLesson(id: string): Promise<void> {
    try {
      await apiClient.delete(`/lessons/${id}`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Dərsi silmək mümkün olmadı');
    }
  },

  async markLessonAsWatched(courseId: string, lessonId: string): Promise<void> {
    try {
      await apiClient.post(`/courses/${courseId}/lessons/${lessonId}/watch`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Dərsi izlənilmiş kimi qeyd etmək mümkün olmadı');
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
      throw new Error('Dərslərin irəliləyişini yükləmək mümkün olmadı');
    }
  },

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    try {
      const response = await apiClient.get<Lesson[]>(`/courses/${courseId}/lessons`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Kursun dərslərini yükləmək mümkün olmadı');
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
      throw new Error('Dərsi yükləmək mümkün olmadı');
    }
  }
};

export const {
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  markLessonAsWatched,
  getLessonProgress,
  getLessonsByCourse
} = lessonService; 