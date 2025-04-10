import apiClient from './apiClient';

export enum SubjectType {
  Math = 'Math',
  Physics = 'Physics',
  Chemistry = 'Chemistry',
  Biology = 'Biology',
  History = 'History',
  Geography = 'Geography',
  Literature = 'Literature',
  Azerbaijani = 'Azerbaijani',
  Russian = 'Russian',
  English = 'English',
  IT = 'IT',
  Other = 'Other'
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: SubjectType;
  imageUrl?: string;
  teacherId: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  subject: SubjectType;
  image?: File;
}

export const courseService = {
  async getAllCourses(): Promise<Course[]> {
    const response = await apiClient.get<Course[]>('/course');
    return response.data;
  },

  async getCourseById(id: string): Promise<Course> {
    const response = await apiClient.get<Course>(`/course/${id}`);
    return response.data;
  },

  async createCourse(data: CreateCourseData): Promise<Course> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('subject', data.subject);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.post<Course>('/course', formData);
    return response.data;
  },

  async updateCourse(id: string, data: Partial<CreateCourseData>): Promise<Course> {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.subject) formData.append('subject', data.subject);
    if (data.image) formData.append('image', data.image);

    const response = await apiClient.put<Course>(`/course/${id}`, formData);
    return response.data;
  },

  async deleteCourse(id: string): Promise<void> {
    await apiClient.delete(`/course/${id}`);
  }
}; 