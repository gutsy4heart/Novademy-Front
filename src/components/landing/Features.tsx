import React from 'react';
import './Features.css';

const Features: React.FC = () => {
  return (
    <section className="features">
      <h2>Niyə novademy?</h2>
      <p className="features-subtitle">novademy təhsil və yeni təcrübə həvəsi olan</p>
      
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-icon">
            <img src="/icons/creative.svg" alt="Creative" />
          </div>
          <div className="feature-content">
            <h3>Maraqlı və yaradıcı dərslər</h3>
            <p>Təhsil almaq və yeni təcrübə həvəsi olan tələbələr üçün</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <img src="/icons/teacher.svg" alt="Teacher" />
          </div>
          <div className="feature-content">
            <h3>Peşəkar müəllimlər</h3>
            <p>novademy yeni bir təhsil təcrübəsində sizə</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <img src="/icons/budget.svg" alt="Budget" />
          </div>
          <div className="feature-content">
            <h3>Büdcənizə qənaət</h3>
            <p>Təhsilinizi 40% - 60% qənaət edərək başa vurun</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features; 