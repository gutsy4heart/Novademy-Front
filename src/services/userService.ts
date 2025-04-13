import apiClient from '../api/apiClient';
import { SectorType } from '../types/enums';

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  group: number;
  sector: SectorType;
  profilePictureUrl?: string;
  roleId: number;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  group?: number;
  sector?: SectorType;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get('/api/v1/user/profile');
  return response.data as UserProfile;
};

export const updateUserProfile = async (data: UpdateProfileData): Promise<UserProfile> => {
  const response = await apiClient.put('/api/v1/user/profile', data);
  return response.data as UserProfile;
};

export const uploadProfilePhoto = async (file: File): Promise<{ profilePictureUrl: string }> => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  
  const response = await apiClient.post('/api/v1/user/profile/picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data as { profilePictureUrl: string };
};

export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  await apiClient.post('/api/v1/user/change-password', data);
}; 