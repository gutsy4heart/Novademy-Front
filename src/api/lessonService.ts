import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

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
      const response = await axios.get<Lesson[]>(`${API_URL}/lessons`, { headers: getAuthHeaders() });
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
      const response = await axios.get<Lesson>(`${API_URL}/lessons/${id}`, { headers: getAuthHeaders() });
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
      if (data.order) formData.append('order', String(data.order));
      if (data.content) formData.append('content', data.content);
      formData.append('courseId', data.courseId);

      const response = await axios.post<Lesson>(`${API_URL}/lessons`, formData, { headers: getAuthHeaders() });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Dərs yaratmaq mümkün olmadı');
    }
  },

  async updateLesson(id: string, data: Partial<CreateLessonData>): Promise<Lesson> {
    try {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.video) formData.append('video', data.video);
      if (data.order) formData.append('order', String(data.order));
      if (data.content) formData.append('content', data.content);
      if (data.courseId) formData.append('courseId', data.courseId);

      const response = await axios.put<Lesson>(`${API_URL}/lessons/${id}`, formData, { headers: getAuthHeaders() });
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
      await axios.delete(`${API_URL}/lessons/${id}`, { headers: getAuthHeaders() });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Dərsi silmək mümkün olmadı');
    }
  },

  async markLessonAsWatched(courseId: string, lessonId: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/student/courses/${courseId}/lessons/${lessonId}/watch`, {}, { headers: getAuthHeaders() });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Dərsi izlənilmiş kimi qeyd etmək mümkün olmadı');
    }
  },

  async getLessonProgress(courseId: string): Promise<{ [key: string]: boolean }> {
    try {
      const response = await axios.get<{ [key: string]: boolean }>(`${API_URL}/student/courses/${courseId}/lessons/progress`, { headers: getAuthHeaders() });
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
      const response = await axios.get<Lesson[]>(`${API_URL}/courses/${courseId}/lessons`, { headers: getAuthHeaders() });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Kurs dərslərini yükləmək mümkün olmadı');
    }
  },

  async getLessonById(courseId: string, lessonId: string): Promise<Lesson> {
    try {
      const response = await axios.get<Lesson>(`${API_URL}/courses/${courseId}/lessons/${lessonId}`, { headers: getAuthHeaders() });
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