"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Lock, User, Eye, EyeOff, Briefcase, UserCircle, Home, LogIn } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    // Fallback for demo purposes if Supabase is not configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setTimeout(() => router.push('/dashboard'), 500);
      return;
    }

    try {
      if (loginMethod === 'password') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) router.push('/dashboard');
      } 
      else if (loginMethod === 'otp') {
        if (!otpSent) {
          // 1. Send OTP
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false, // Optional depending on if you want to allow signups
            },
          });
          if (error) throw error;
          setOtpSent(true);
          setSuccessMsg('OTP sent to your email!');
        } else {
          // 2. Verify OTP
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: otpCode,
            type: 'email',
          });
          if (error) throw error;
          if (data.session) router.push('/dashboard');
        }
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        {/* Abstract shapes and illustration to mimic the screenshot */}
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: '80px', height: '80px', borderRadius: '50%', background: 'white' }}></div>
        <img 
          src="https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/People/SVG/ic_fluent_people_24_regular.svg" 
          alt="Illustration" 
          className="login-left-illustration"
          style={{ width: '400px', height: 'auto', opacity: 0.8 }}
        />
        <div style={{ position: 'absolute', color: 'white', bottom: '10%', left: '10%', fontSize: '2rem', fontWeight: 'bold' }}>
          Welcome to MyLoanCRM
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="brand-logo">
            <div style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>m</div>
            <span className="brand-name">MyLoanCRM</span>
          </div>

          <h2 className="login-title">
            <Lock size={20} color="var(--primary)" />
            {loginMethod === 'password' ? 'Login with Password' : 'Login with OTP'}
          </h2>

          <div className="toggle-group">
            <button 
              className={`toggle-btn ${loginMethod === 'password' ? 'active' : ''}`}
              onClick={() => { setLoginMethod('password'); setErrorMsg(''); setSuccessMsg(''); }}
              type="button"
            >
              Password
            </button>
            <button 
              className={`toggle-btn ${loginMethod === 'otp' ? 'active' : ''}`}
              onClick={() => { setLoginMethod('otp'); setErrorMsg(''); setSuccessMsg(''); }}
              type="button"
            >
              Email OTP
            </button>
          </div>

          {errorMsg && <div className="error-message" style={{color: 'red', marginBottom: '1rem', fontSize: '0.875rem'}}>{errorMsg}</div>}
          {successMsg && <div className="success-message" style={{color: 'green', marginBottom: '1rem', fontSize: '0.875rem'}}>{successMsg}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                Email
              </label>
              <div className="form-input-wrapper">
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="Enter email id" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginMethod === 'otp' && otpSent}
                  required
                />
              </div>
            </div>

            {loginMethod === 'password' && (
              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} />
                  Password
                </label>
                <div className="form-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input" 
                    placeholder="Enter password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {showPassword ? (
                    <EyeOff size={18} className="eye-icon" onClick={() => setShowPassword(false)} />
                  ) : (
                    <Eye size={18} className="eye-icon" onClick={() => setShowPassword(true)} />
                  )}
                </div>
              </div>
            )}

            {loginMethod === 'otp' && otpSent && (
              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} />
                  OTP Code
                </label>
                <div className="form-input-wrapper">
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter 6-digit code" 
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {loginMethod === 'password' && (
              <a href="#" className="forgot-link">Forgot Password?</a>
            )}

            <button type="submit" className="submit-btn" disabled={isLoading}>
              <LogIn size={18} />
              {isLoading ? 'Processing...' : (
                loginMethod === 'password' ? 'Sign In' : (otpSent ? 'Verify OTP' : 'Send OTP')
              )}
            </button>

            <div className="signup-link">
              Don't have an account? <a href="#">Sign Up</a>
            </div>
          </form>

          <div className="calculator-section">
            <div className="calculator-title">Use Our Calculator</div>
            <div className="calc-cards">
              <div className="calc-card" onClick={() => router.push('/calculator/business')}>
                <Briefcase size={24} />
                <span>Business Loan</span>
              </div>
              <div className="calc-card" onClick={() => router.push('/calculator/personal')}>
                <UserCircle size={24} />
                <span>Personal Loan</span>
              </div>
              <div className="calc-card" onClick={() => router.push('/calculator/home')}>
                <Home size={24} />
                <span>Home Loan</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
