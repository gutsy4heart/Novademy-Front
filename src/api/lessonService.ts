import apiClient from './apiClient';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  order: number;
  transcript: string;
  imageUrl?: string;
  courseId: string;
}

export interface CreateLessonData {
  title: string;
  description: string;
  video: File;
  order: number;
  transcript: string;
  image?: File;
  courseId: string;
}

export const lessonService = {
  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    const response = await apiClient.get<Lesson[]>(`/lesson/course/${courseId}`);
    return response.data;
  },

  async getLessonById(id: string): Promise<Lesson> {
    const response = await apiClient.get<Lesson>(`/lesson/${id}`);
    return response.data;
  },

  async createLesson(data: CreateLessonData): Promise<Lesson> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('video', data.video);
    formData.append('order', data.order.toString());
    formData.append('transcript', data.transcript);
    formData.append('courseId', data.courseId);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.post<Lesson>('/lesson', formData);
    return response.data;
  },

  async updateLesson(id: string, data: Partial<CreateLessonData>): Promise<Lesson> {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.video) formData.append('video', data.video);
    if (data.order) formData.append('order', data.order.toString());
    if (data.transcript) formData.append('transcript', data.transcript);
    if (data.courseId) formData.append('courseId', data.courseId);
    if (data.image) formData.append('image', data.image);

    const response = await apiClient.put<Lesson>(`/lesson/${id}`, formData);
    return response.data;
  },

  async deleteLesson(id: string): Promise<void> {
    await apiClient.delete(`/lesson/${id}`);
  }
}; 