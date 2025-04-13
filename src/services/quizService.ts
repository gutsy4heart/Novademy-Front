import apiClient from '../api/apiClient';

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  lessonId?: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizData {
  title: string;
  description: string;
  courseId: string;
  lessonId?: string;
  questions: Omit<QuizQuestion, 'id'>[];
  timeLimit?: number;
  passingScore: number;
}

export const getQuizzes = async (courseId?: string, lessonId?: string): Promise<Quiz[]> => {
  let url = '/quizzes';
  if (courseId) url += `?courseId=${courseId}`;
  if (lessonId) url += courseId ? `&lessonId=${lessonId}` : `?lessonId=${lessonId}`;
  
  const response = await apiClient.get(url);
  return response.data as Quiz[];
};

export const getQuiz = async (id: string): Promise<Quiz> => {
  const response = await apiClient.get(`/quizzes/${id}`);
  return response.data as Quiz;
};

export const createQuiz = async (data: CreateQuizData): Promise<Quiz> => {
  const response = await apiClient.post('/quizzes', data);
  return response.data as Quiz;
};

export const updateQuiz = async (id: string, data: Partial<CreateQuizData>): Promise<Quiz> => {
  const response = await apiClient.put(`/quizzes/${id}`, data);
  return response.data as Quiz;
};

export const deleteQuiz = async (id: string): Promise<void> => {
  await apiClient.delete(`/quizzes/${id}`);
}; 