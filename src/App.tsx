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
import QuizForm from './components/admin/quizzes/QuizForm';
import PackageList from './components/admin/packages/PackageList';
import PackageForm from './components/admin/packages/PackageForm';
import LessonPlayer from './components/lessons/LessonPlayer';
import QuizPlayer from './components/quizzes/QuizPlayer';
import Profile from './components/profile/Profile';
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
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Lesson and Quiz Player Routes */}
          <Route path="/lessons/:id" element={
            <ProtectedRoute>
              <LessonPlayer />
            </ProtectedRoute>
          } />
          <Route path="/quizzes/:id" element={
            <ProtectedRoute>
              <QuizPlayer />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Course routes */}
            <Route path="courses" element={<AdminCourseList />} />
            <Route path="courses/new" element={<CourseForm />} />
            <Route path="courses/:id" element={<CourseForm />} />
            
            {/* Lesson routes */}
            <Route path="lessons" element={<LessonList />} />
            <Route path="lessons/new" element={<LessonForm />} />
            <Route path="lessons/:id" element={<LessonForm />} />
            
            {/* Quiz routes */}
            <Route path="quizzes" element={<QuizList />} />
            <Route path="quizzes/new" element={<QuizForm />} />
            <Route path="quizzes/:id" element={<QuizForm />} />
            
            {/* Package routes */}
            <Route path="packages" element={<PackageList />} />
            <Route path="packages/new" element={<PackageForm />} />
            <Route path="packages/:id" element={<PackageForm />} />
            
            {/* User routes */}
            <Route path="users" element={<div>User Management</div>} />
            
            {/* Subscription routes */}
            <Route path="subscriptions" element={<div>Subscription Management</div>} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
