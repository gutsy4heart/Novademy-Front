import axios from 'axios';
import { Course } from './courseService';
import { Lesson } from './lessonService';

// Base URL for API requests
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

// Interface for enrolled course with progress
export interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  subject: string;
  imageUrl?: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessedLessonId?: string;
}

// Interface for comment
export interface Comment {
  id: string;
  lessonId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

// Interface for adding comment
export interface AddCommentData {
  lessonId: string;
  text: string;
}

export interface ProgressData {
  lessonId: string;
  completed: boolean;
  progress: number; // percentage or seconds watched
  lastWatchedAt: string;
}

export interface LessonProgress {
  [lessonId: string]: ProgressData;
}

export interface CourseProgress {
  courseId: string;
  progress: number;
  lessonsProgress: LessonProgress[];
}

// Student service functions
const getEnrolledCourses = async (): Promise<EnrolledCourse[]> => {
  try {
    const response = await axios.get<EnrolledCourse[]>(`${API_URL}/student/courses`, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    throw new Error('Qeydiyyatda olduğunuz kursları yükləmək mümkün olmadı');
  }
};

export const getCourseLessons = async (courseId: string): Promise<Lesson[]> => {
  try {
    const response = await axios.get<Lesson[]>(`${API_URL}/courses/${courseId}/lessons`, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Dərsləri yükləmək mümkün olmadı', error);
    throw new Error('Dərsləri yükləmək mümkün olmadı');
  }
};

export const getLessonComments = async (lessonId: string): Promise<Comment[]> => {
  try {
    const response = await axios.get<Comment[]>(`${API_URL}/lessons/${lessonId}/comments`, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Şərhləri yükləmək mümkün olmadı', error);
    throw new Error('Şərhləri yükləmək mümkün olmadı');
  }
};

export const addComment = async (data: AddCommentData): Promise<Comment> => {
  try {
    const response = await axios.post<Comment>(`${API_URL}/lessons/${data.lessonId}/comments`, {
      text: data.text
    }, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Şərh əlavə etmək mümkün olmadı', error);
    throw new Error('Şərh əlavə etmək mümkün olmadı');
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
  } catch (error) {
    console.error('Şərhi silmək mümkün olmadı', error);
    throw new Error('Şərhi silmək mümkün olmadı');
  }
};

export const enrollInCourse = async (courseId: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/student/enroll`, {
      courseId
    }, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
  } catch (error) {
    console.error('Kursa qeydiyyatdan keçmək mümkün olmadı', error);
    throw new Error('Kursa qeydiyyatdan keçmək mümkün olmadı');
  }
};

const getCourseProgress = async (courseId: string): Promise<CourseProgress> => {
  try {
    const response = await axios.get<CourseProgress>(`${API_URL}/student/courses/${courseId}/progress`, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching course progress:', error);
    throw new Error('Kurs üzrə irəliləyişi yükləmək mümkün olmadı');
  }
};

const updateLessonProgress = async (
  courseId: string,
  lessonId: string,
  watchedSeconds: number,
  completed: boolean
): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}/student/courses/${courseId}/lessons/${lessonId}/progress`,
      { watchedSeconds, completed },
      {
        headers: getAuthHeaders(),
        withCredentials: true
      }
    );
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    throw new Error('Dərs üzrə irəliləyişi yeniləmək mümkün olmadı');
  }
};

// Export getLessonComments as getComments for backward compatibility
export const getComments = getLessonComments;

// Add sendComment function that's compatible with the existing components
export const sendComment = async (lessonId: string, content: string): Promise<Comment> => {
  return addComment({ lessonId, text: content });
};

// Add markLessonAsWatched function
export const markLessonAsWatched = async (lessonId: string, currentTime?: number): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}/student/lessons/${lessonId}/watch`,
      { progress: currentTime || 100 },
      {
        headers: getAuthHeaders(),
        withCredentials: true
      }
    );
  } catch (error) {
    console.error('Error marking lesson as watched:', error);
    throw new Error('Dərsi izlənilmiş kimi qeyd etmək mümkün olmadı');
  }
};

// Add getLessonProgress function
export const getLessonProgress = async (courseId: string): Promise<LessonProgress> => {
  try {
    const response = await axios.get<LessonProgress>(`${API_URL}/student/courses/${courseId}/lessons/progress`, {
      headers: getAuthHeaders(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    throw new Error('Dərslərin irəliləyişini yükləmək mümkün olmadı');
  }
};

export const studentService = {
  getEnrolledCourses,
  getCourseLessons,
  getLessonComments,
  addComment,
  deleteComment,
  enrollInCourse,
  getCourseProgress,
  updateLessonProgress,
  getLessonProgress,
  getComments,
  sendComment,
  markLessonAsWatched
};

export default studentService;

export {
  getEnrolledCourses,
  getCourseProgress,
  updateLessonProgress
}; 