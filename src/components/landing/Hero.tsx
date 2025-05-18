import React from 'react';
import './Hero.css';
import studentImage from '../../images/student.png';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">Abituriyent həyatını bizimlə asanlaşdır</h1>
          <button className="hero-button">Ödənişsiz sınaq</button>
        </div>
        <div className="hero-image">
          <img src={studentImage} alt="Student with folder" />
        </div>
      </div>
      <div className="subjects">
        <div className="subjects-list">
          <button className="subject-tag active">1-ci qrup</button>
          <button className="subject-tag">2-ci qrup</button>
          <button className="subject-tag">3-cü qrup</button>
          <button className="subject-tag">4-cü qrup</button>
          <button className="subject-tag">Riyaziyyat</button>
          <button className="subject-tag">English</button>
        </div>
        <div className="subject-cards">
          <div className="subject-card">
            <img src="https://www.kdnuggets.com/wp-content/uploads/math-chalkboard-header-scaled.jpg" alt="Riyaziyyat" />
            <h3>Riyaziyyat</h3>
            <p>10 Dərs - Pulsuz Giriş</p>
          </div>
          <div className="subject-card">
            <img src="https://achievecareers.co.za/wp-content/uploads/2022/06/evolution-of-the-english-language.jpg" alt="English" />
            <h3>English</h3>
            <p>10 Dərs - Pulsuz Giriş</p>
          </div>
          <div className="subject-card">
            <img src="https://www.nec.ac.uk/wp-content/uploads/2024/09/Blog-Image-Size-1.png" alt="Fizika" />
            <h3>Fizika</h3>
            <p>10 Dərs - Pulsuz Giriş</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 