import React, { useState, useRef, useEffect } from 'react';
import './Auth.css';

const AuthCode: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to next input if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    // TODO: Implement verification logic
    console.log('Verification code:', verificationCode);
  };

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Təsdiq kodu</h2>
        <form onSubmit={handleSubmit}>
          <div className="verification-code">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={setInputRef(index)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="code-input"
                required
              />
            ))}
          </div>
          <button type="submit" className="submit-button">
            Davam et
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthCode; 