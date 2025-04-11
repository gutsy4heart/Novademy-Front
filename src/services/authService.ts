import apiClient from '../api/apiClient';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
}

export const register = async (data: RegisterData) => {
  try {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    
    if (apiError.response?.data?.errors) {
      // Преобразуем ошибки валидации в читаемый формат
      const errorMessages = Object.entries(apiError.response.data.errors)
        .map(([field, messages]) => {
          // Преобразуем названия полей в читаемый формат
          const fieldNames: Record<string, string> = {
            firstName: 'Ad',
            lastName: 'Soyad',
            email: 'Email',
            phone: 'Mobil nömrə',
            password: 'Şifrə'
          };
          const fieldName = fieldNames[field] || field;
          return `${fieldName}: ${messages.join(', ')}`;
        })
        .join('\n');
      throw new Error(errorMessages);
    }
    
    if (apiError.response?.data?.message) {
      throw new Error(apiError.response.data.message);
    }
    
    if (apiError.response?.status === 500) {
      throw new Error('Server xətası. Zəhmət olmasa bir az sonra yenidən cəhd edin.');
    }
    
    throw new Error('Qeydiyyat zamanı xəta baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin.');
  }
}; 