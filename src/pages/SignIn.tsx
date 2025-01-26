import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DangerModal from '../components/modal/DangerModal';
import Backdrop from '../components/modal/ModalBackdrop';
import { Button } from '../styles';
import { useAuth } from '../components/AuthContext';

const SignInPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showDangerModal, setShowDangerModal] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [modalContent, setModalContent] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const unblockUser = () => {
    setIsBlocked(false);
    setFailedAttempts(0);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
   
    if (isBlocked) {
      setModalContent("Too many failed attempts. Please wait 30 seconds before trying again.");
      setShowDangerModal(true);
      return;
    }
   
    try {
      await login(username, password);
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
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
    }
  };

  const handleModalClose = () => setShowDangerModal(false);

  return (
    <div style={{ paddingTop: '40px', textAlign: 'center' }}>
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