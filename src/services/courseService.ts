import apiClient from '../api/apiClient';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  createdAt: string;
  status: string;
}

interface CreateCourseData {
  title: string;
  description: string;
  price: number;
  status: string;
}

export const getCourses = async (): Promise<Course[]> => {
  try {
    const response = await apiClient.get('/courses');
    return response.data as Course[];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Kursları yükləmək mümkün olmadı');
  }
};

export const getCourse = async (id: string): Promise<Course> => {
  try {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data as Course;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Kursu yükləmək mümkün olmadı');
  }
};

export const createCourse = async (data: CreateCourseData): Promise<Course> => {
  try {
    const response = await apiClient.post('/courses', data);
    return response.data as Course;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Kurs yaratmaq mümkün olmadı');
  }
};

export const updateCourse = async (id: string, data: Partial<CreateCourseData>): Promise<Course> => {
  try {
    const response = await apiClient.put(`/courses/${id}`, data);
    return response.data as Course;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Kursu yeniləmək mümkün olmadı');
  }
};

export const deleteCourse = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/courses/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Kursu silmək mümkün olmadı');
  }
}; 