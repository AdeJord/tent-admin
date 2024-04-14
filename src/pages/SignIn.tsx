// SignInPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignInPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Attempt to login with the entered credentials
    if (login(username, password)) {
      navigate('/'); // Redirect to home page on successful login
    } else {
      alert('Invalid credentials'); // Show an error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
      style={{
        paddingTop: '20vh'
      }}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignInPage;
