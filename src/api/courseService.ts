import apiClient from './apiClient';
import { SubjectType } from '../types/enums';

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: SubjectType;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  subject: SubjectType;
  image?: File;
}

export const courseService = {
  async getCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get<Course[]>('/courses');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Kursları yükləmək mümkün olmadı');
    }
  },

  async getCourse(id: string): Promise<Course> {
    try {
      const response = await apiClient.get<Course>(`/courses/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Kursu yükləmək mümkün olmadı');
    }
  },

  async createCourse(data: CreateCourseData): Promise<Course> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('subject', data.subject);
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await apiClient.post<Course>('/courses', formData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Kursu yaratmaq mümkün olmadı');
    }
  },

  async updateCourse(id: string, data: Partial<CreateCourseData>): Promise<Course> {
    try {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.subject) formData.append('subject', data.subject);
      if (data.image) formData.append('image', data.image);

      const response = await apiClient.put<Course>(`/courses/${id}`, formData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Kursu yeniləmək mümkün olmadı');
    }
  },

  async deleteCourse(id: string): Promise<void> {
    try {
      await apiClient.delete(`/courses/${id}`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Kursu silmək mümkün olmadı');
    }
  }
};

export const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = courseService; 