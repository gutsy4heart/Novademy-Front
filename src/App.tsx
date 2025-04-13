import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import CourseList from './components/courses/CourseList';
import CreateCourse from './components/courses/CreateCourse';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import Pricing from './components/landing/Pricing';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AuthCode from './components/auth/AuthCode';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import AdminCourseList from './components/admin/courses/CourseList';
import CourseForm from './components/admin/courses/CourseForm';
import LessonList from './components/admin/lessons/LessonList';
import LessonForm from './components/admin/lessons/LessonForm';
import QuizList from './components/admin/quizzes/QuizList';
import PackageList from './components/admin/packages/PackageList';
import LessonPlayer from './components/lessons/LessonPlayer';
import QuizPlayer from './components/quizzes/QuizPlayer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

const LandingPage: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
    </>
  );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Auth routes without Navbar and Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<AuthCode />} />

          {/* Main routes with Navbar and Footer */}
          <Route path="/" element={
            <MainLayout>
              <LandingPage />
            </MainLayout>
          } />
          <Route path="/courses" element={
            <MainLayout>
              <CourseList />
            </MainLayout>
          } />
          <Route path="/courses/create" element={
            <MainLayout>
              <CreateCourse />
            </MainLayout>
          } />
          <Route path="/courses/:id" element={
            <MainLayout>
              <div>Страница курса</div>
            </MainLayout>
          } />
          <Route path="/profile" element={
            <MainLayout>
              <div>Профиль</div>
            </MainLayout>
          } />

          {/* Lesson and Quiz Player Routes */}
          <Route path="/lessons/:id" element={<LessonPlayer />} />
          <Route path="/quizzes/:id" element={<QuizPlayer />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout />
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Course routes */}
            <Route path="courses" element={<AdminCourseList />} />
            <Route path="courses/new" element={<CourseForm />} />
            <Route path="courses/:id/edit" element={<CourseForm />} />
            
            {/* Lesson routes */}
            <Route path="lessons" element={<LessonList />} />
            <Route path="lessons/new" element={<LessonForm />} />
            <Route path="lessons/:id/edit" element={<LessonForm />} />
            <Route path="courses/:courseId/lessons" element={<LessonList />} />
            <Route path="courses/:courseId/lessons/new" element={<LessonForm />} />
            
            {/* Quiz routes */}
            <Route path="quizzes" element={<QuizList />} />
            <Route path="courses/:courseId/quizzes" element={<QuizList />} />
            <Route path="lessons/:lessonId/quizzes" element={<QuizList />} />
            
            {/* Package routes */}
            <Route path="packages" element={<PackageList />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
