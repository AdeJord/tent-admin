import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DangerModal from '../components/modal/DangerModal';
import Backdrop from '../components/modal/ModalBackdrop';
import { Button } from '../styles';

const SignInPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showDangerModal, setShowDangerModal] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const ModalClickHandler: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();  // Prevent the default action if necessary
    setShowDangerModal(false);
  };

  const handleDangerModalCancel = () => {
    setShowDangerModal(false); // Close the modal
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isBlocked) {
      alert("Too many failed attempts. Please wait 30 seconds before trying again.");
      return;
    }

    try {
      await login(username, password);
      navigate('/'); // Navigate to the homepage or dashboard upon successful login
      setFailedAttempts(0); // Reset failed attempts on successful login
    } catch (error: any) {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      if (newFailedAttempts >= 3) {
        setIsBlocked(true);
        setTimeout(() => {
          setIsBlocked(false); // Unblock after 30 seconds
          setFailedAttempts(0); // Reset attempts after block is lifted
        }, 30000); // 30 seconds
      }

      if (axios.isAxiosError(error)) {
        setShowDangerModal(true);
        console.error("Login failed:", error.response?.data.message || error.message);
      } else {
        console.error("Login failed:", error.message);
      }
    }
  };

  return (
    <div style={{ paddingTop: '40px', textAlign: 'center' }}>
      {showDangerModal && (
        <Backdrop onClick={handleDangerModalCancel}
        >
          <DangerModal
            onClick={handleDangerModalCancel}
            header="Incorrect username or password"
            content="attempts remaining: 3"
            footer={<div
              style={{
                backgroundColor: "#EAF3E7",
                color: "#051101",
                fontSize: "calc(5px + 2vmin)",
                textAlign: "center",
              }}>

              <Button
                onClick={handleDangerModalCancel}
                type="submit"
                style={{
                  backgroundColor: "#EAF3E7",
                  color: "#051101",
                  fontSize: "calc(5px + 2vmin)",
                  textAlign: "center",
                }}
              >OK</Button>
            </div>} onClose={function (): void {
              // throw new Error('Function not implemented.');
            }}          />
        </Backdrop>
      )}
      {isBlocked && (
        <Backdrop onClick={handleDangerModalCancel}>
          <DangerModal
            onClick={handleDangerModalCancel}
            header="Too many failed attempts"
            content="You are locked out for 30 seconds. Please try again later."
            footer={<div
              style={{
                display: "flex",
                flexDirection: "row",
                textAlign: "center",
              }}>

              <Button
                onClick={handleDangerModalCancel}
                type="submit"
                style={{ backgroundColor: "#EAF3E7", color: "#051101", fontSize: "calc(5px + 2vmin)" }}
              >OK</Button>
            </div>} onClose={function (): void {
              throw new Error('Function not implemented.');
            } }          />
        </Backdrop>
      )}
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignInPage;
