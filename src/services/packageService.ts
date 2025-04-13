import apiClient from '../api/apiClient';

export interface CoursePackage {
  id: string;
  title: string;
  description: string;
  price: number;
  courseIds: string[];
  discount: number;
  duration: number; // in days
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageData {
  title: string;
  description: string;
  price: number;
  courseIds: string[];
  discount: number;
  duration: number;
  status: string;
}

export const getPackages = async (): Promise<CoursePackage[]> => {
  const response = await apiClient.get('/packages');
  return response.data as CoursePackage[];
};

export const getPackage = async (id: string): Promise<CoursePackage> => {
  const response = await apiClient.get(`/packages/${id}`);
  return response.data as CoursePackage;
};

export const createPackage = async (data: CreatePackageData): Promise<CoursePackage> => {
  const response = await apiClient.post('/packages', data);
  return response.data as CoursePackage;
};

export const updatePackage = async (id: string, data: Partial<CreatePackageData>): Promise<CoursePackage> => {
  const response = await apiClient.put(`/packages/${id}`, data);
  return response.data as CoursePackage;
};

export const deletePackage = async (id: string): Promise<void> => {
  await apiClient.delete(`/packages/${id}`);
}; 