import axios from 'axios';

// Создаем новый настроенный экземпляр axios
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5258/api/v1', // Порт из launchSettings.json
  headers: {
    'Content-Type': 'application/json' // устанавливаем заголовок, т.к данные отправляются в формате JSON
  },
  // Важно для CORS при использовании credentials
  withCredentials: true
});

// Добавляем перехватчик запросов для включения токена
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Добавляем интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Обработка неавторизованного доступа
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient; 

//Интерцепторы — это функции, которые выполняются 
// до отправки запроса или после получения ответа.
// Интерцепторы позволяют выполнять различные действия, 
// например, добавлять заголовки авторизации, обрабатывать ошибки и т.д.
