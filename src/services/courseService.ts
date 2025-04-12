import apiClient from '../api/apiClient';

export enum SubjectType {
  MATH = 'MATH',
  PHYSICS = 'PHYSICS',
  CHEMISTRY = 'CHEMISTRY',
  BIOLOGY = 'BIOLOGY',
  HISTORY = 'HISTORY',
  LITERATURE = 'LITERATURE'
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  createdAt: string;
  status: string;
  subject: SubjectType;
}

export interface CreateCourseData {
  title: string;
  description: string;
  price: number;
  status: string;
  subject: SubjectType;
}

export const getCourses = async (): Promise<Course[]> => {
  const response = await apiClient.get('/courses');
  return response.data as Course[];
};

export const getCourse = async (id: string): Promise<Course> => {
  const response = await apiClient.get(`/courses/${id}`);
  return response.data as Course;
};

export const createCourse = async (data: CreateCourseData): Promise<Course> => {
  const response = await apiClient.post('/courses', data);
  return response.data as Course;
};

export const updateCourse = async (id: string, data: CreateCourseData): Promise<Course> => {
  const response = await apiClient.put(`/courses/${id}`, data);
  return response.data as Course;
};

export const deleteCourse = async (id: string): Promise<void> => {
  await apiClient.delete(`/courses/${id}`);
}; 