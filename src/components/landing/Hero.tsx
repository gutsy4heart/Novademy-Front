import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">Abituriyent həyatını bizimlə asanlaşdır</h1>
          <button className="hero-button">Ödənişsiz sınaq</button>
        </div>
        <div className="hero-image">
          <img src="/student.png" alt="Student with folder" />
        </div>
      </div>
      <div className="subjects">
        <div className="subjects-list">
          <button className="subject-tag active">Riyaziyyat</button>
          <button className="subject-tag">Kimya</button>
          <button className="subject-tag">2-ci qrup</button>
          <button className="subject-tag">4-cü qrup</button>
          <button className="subject-tag">Coğrafiya</button>
        </div>
        <div className="subject-cards">
          <div className="subject-card">
            <img src="/subjects/riyaziyyat.png" alt="Riyaziyyat" />
            <h3>Riyaziyyat</h3>
            <p>10 Dərs - Pulsuz Giriş</p>
          </div>
          <div className="subject-card">
            <img src="/subjects/fizika.png" alt="Fizika" />
            <h3>Fizika</h3>
            <p>10 Dərs - Pulsuz Giriş</p>
          </div>
          <div className="subject-card">
            <img src="/subjects/informatika.png" alt="İnformatika" />
            <h3>İnformatika</h3>
            <p>10 Dərs - Pulsuz Giriş</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 