import React from 'react';
import './Pricing.css';

const Pricing: React.FC = () => {
  return (
    <section className="pricing">
      <h2>Qiymətlər</h2>
      
      <div className="pricing-cards">
        <div className="pricing-card">
          <div className="pricing-header">
            <h3>250 AZN</h3>
            <p>1 fənn</p>
          </div>
          <ul className="pricing-features">
            <li>Ana dili</li>
            <li>İngilis dili</li>
            <li>Riyaziyyat</li>
          </ul>
          <button className="pricing-button">Daxil olun</button>
        </div>

        <div className="pricing-card featured">
          <div className="pricing-badge">Ən çox seçilən</div>
          <div className="pricing-header">
            <h3>1000 AZN</h3>
            <p>Qızıl paket</p>
          </div>
          <ul className="pricing-features">
            <li>1-ci qrup</li>
            <li>2-ci qrup</li>
            <li>3-cü qrup</li>
            <li>4-cü qrup</li>
            <li>Riyaziyyat</li>
          </ul>
          <button className="pricing-button">Daxil olun</button>
        </div>

        <div className="pricing-card">
          <div className="pricing-header">
            <h3>650 AZN</h3>
            <p>Buraxılış paketi</p>
          </div>
          <ul className="pricing-features">
            <li>Ana dili</li>
            <li>İngilis dili</li>
            <li>Riyaziyyat</li>
          </ul>
          <button className="pricing-button">Daxil olun</button>
        </div>
      </div>
    </section>
  );
};

export default Pricing; 