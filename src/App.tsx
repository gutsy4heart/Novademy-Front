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
import LessonPlayer from './components/student/LessonPlayer';
import QuizPlayer from './components/quizzes/QuizPlayer';
import Profile from './components/profile/Profile';
import ProfilePage from './components/profile/ProfilePage';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import CourseView from './components/student/CourseView';

const LandingPage: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <Pricing />
    </>
  );
};

// В React children - это специальный проп, который позволяет компонентам
// передавать элементы JSX напрямую внутрь других компонентов. 
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
              
              {/* Student course and lesson routes */}
              <Route path="/courses/:courseId" element={
                <>
                  <Navbar />
                  <CourseView />
                  <Footer />
                </>
              } />
              
              <Route path="/courses/:courseId/lessons/:lessonId" element={
                <>
                  <Navbar />
                  <LessonPlayer />
                  <Footer />
                </>
              } />

              {/* Admin routes - redirecting to admin application */}
              <Route path="/admin/*" element={<Navigate to="http://localhost:3002/login" replace />} />
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
