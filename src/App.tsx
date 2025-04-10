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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
