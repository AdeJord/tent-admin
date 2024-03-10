// Backdrop.tsx
import React from 'react';
import styled from 'styled-components';

const BackdropWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  z-index: 1; /* Place the backdrop behind the modal */
`;

interface BackdropProps {
    children: React.ReactNode;
}

const Backdrop: React.FC<BackdropProps> = ({ children }) => {
  return <BackdropWrapper>{children}</BackdropWrapper>;
};

export default Backdrop;
