import apiClient from '../api/apiClient';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  avatarUrl?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  idNumber?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get('/users/profile');
  return response.data as UserProfile;
};

export const updateUserProfile = async (data: UpdateProfileData): Promise<UserProfile> => {
  const response = await apiClient.put('/users/profile', data);
  return response.data as UserProfile;
};

export const uploadProfilePhoto = async (file: File): Promise<{ avatarUrl: string }> => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  const response = await apiClient.post('/users/profile/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data as { avatarUrl: string };
};

export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  await apiClient.post('/users/profile/password', data);
}; 