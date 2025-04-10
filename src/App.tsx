import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import CourseList from './components/courses/CourseList';
import CreateCourse from './components/courses/CreateCourse';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import Pricing from './components/landing/Pricing';
import Footer from './components/layout/Footer';
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

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/create" element={<CreateCourse />} />
          <Route path="/courses/:id" element={<div>Страница курса</div>} />
          <Route path="/profile" element={<div>Профиль</div>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
