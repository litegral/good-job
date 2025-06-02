import React, { useState } from 'react';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

interface AuthFormProps {
  onAuth: (credentials: any) => void;
  authError: string | null;
  isRegister: boolean;
  isLoading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuth, authError, isRegister, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Only for registration
  const [passwordConfirmation, setPasswordConfirmation] = useState(''); // Only for registration

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const credentials: any = { email, password };
    if (isRegister) {
      credentials.name = name;
      credentials.password_confirmation = passwordConfirmation;
    }
    onAuth(credentials);
  };

  return (
    <div className="card">
      <h2 className="page-title">{isRegister ? 'Create an Employer Account' : 'Login to Your Account'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="form-group">
            <label htmlFor="name" className="form-label">Company Name</label>
            <div className="input-icon-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                id="name"
                className="form-input with-icon"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your company name"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <div className="input-icon-wrapper">
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              id="email"
              className="form-input with-icon"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="input-icon-wrapper">
            <Lock size={18} className="input-icon" />
            <input
              type="password"
              id="password"
              className="form-input with-icon"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        {isRegister && (
          <div className="form-group">
            <label htmlFor="passwordConfirmation" className="form-label">Confirm Password</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                id="passwordConfirmation"
                className="form-input with-icon"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        )}
        {authError && <p className="error-message">{authError}</p>}
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="icon loading-spinner" />
              {isRegister ? 'Registering...' : 'Logging in...'}
            </>
          ) : (
            isRegister ? 'Register' : 'Login'
          )}
        </button>
      </form>
    </div>
  );
};

export default AuthForm; 