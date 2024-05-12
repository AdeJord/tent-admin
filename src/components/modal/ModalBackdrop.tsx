import React from 'react';
import styled from 'styled-components';

// Define the styled component
const BackdropWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); // Semi-transparent black background
  z-index: 1; // Make sure it's properly layered behind the modal
`;

// Update the interface to include onClick
interface BackdropProps {
  children: React.ReactNode;
  onClick: () => void;  // Add this line
}

// Accept onClick as a prop and apply it to the wrapper
const Backdrop: React.FC<BackdropProps> = ({ children, onClick }) => {
  return <BackdropWrapper onClick={onClick}>{children}</BackdropWrapper>;
};

export default Backdrop;
