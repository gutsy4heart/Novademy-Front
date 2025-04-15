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
import ProfilePage from './components/profile/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import { LessonView } from './components/lessons/LessonView';

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
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Auth routes without Navbar and Footer */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify" element={<AuthCode />} />

            {/* Main routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <LandingPage />
                <Footer />
              </>
            } />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={
                <>
                  <Navbar />
                  <Dashboard />
                  <Footer />
                </>
              } />
              
              <Route path="/profile" element={
                <>
                  <Navbar />
                  <ProfilePage />
                  <Footer />
                </>
              } />
              
              <Route path="/courses/:courseId/lessons/:lessonId" element={
                <>
                  <Navbar />
                  <LessonView />
                  <Footer />
                </>
              } />

              {/* Admin routes */}
              <Route path="/admin/*" element={
                <>
                  <Navbar />
                  <AdminLayout />
                  <Footer />
                </>
              } />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
