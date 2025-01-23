import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DangerModal from '../components/modal/DangerModal';
import Backdrop from '../components/modal/ModalBackdrop';
import { Button } from '../styles';

// Configure axios globally
axios.defaults.withCredentials = true;

const SignInPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showDangerModal, setShowDangerModal] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [modalContent, setModalContent] = useState<string>('');

  const navigate = useNavigate();

  // Function to reset failed attempts after blocking
  const unblockUser = () => {
    setIsBlocked(false);
    setFailedAttempts(0);
  };

  // Handle login logic
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
   
    if (isBlocked) {
      setModalContent("Too many failed attempts. Please wait 30 seconds before trying again.");
      setShowDangerModal(true);
      return;
    }
   
    try {
      const response = await axios.post('https://adejord.co.uk/login', {
        username,
        password,
      });
   
      // Store token and set default header
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
   
      console.log('Login successful:', response.data);
      navigate('/');
      setFailedAttempts(0);
    } catch (error: any) {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
   
      if (newFailedAttempts >= 3) {
        setIsBlocked(true);
        setModalContent("You are locked out for 30 seconds. Please try again later.");
        setTimeout(unblockUser, 30000);
      } else {
        setModalContent("Incorrect username or password. Attempts remaining: " + (3 - newFailedAttempts));
      }
   
      setShowDangerModal(true);
      console.error("Login failed:", error.response?.data?.error || error.message);
    }
   };

  // Close modal handler
  const handleModalClose = () => setShowDangerModal(false);

  return (
    <div style={{ paddingTop: '40px', textAlign: 'center' }}>
      {/* Danger Modal for Errors */}
      {showDangerModal && (
        <Backdrop onClick={handleModalClose}>
          <DangerModal
            onClick={handleModalClose}
            header={isBlocked ? "Blocked" : "Login Error"}
            content={modalContent}
            footer={
              <div style={{ textAlign: "center" }}>
                <Button
                  onClick={handleModalClose}
                  style={{ backgroundColor: "#EAF3E7", color: "#051101", fontSize: "calc(5px + 2vmin)" }}
                >
                  OK
                </Button>
              </div>
            }
            onClose={handleModalClose}
          />
        </Backdrop>
      )}

      {/* Sign In Form */}
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ margin: '10px' }}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ margin: '10px' }}
          />
        </label>
        <br />
        <button type="submit" style={{ marginTop: '10px', padding: '10px 20px' }}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
