import React from 'react';
import styled from 'styled-components';

interface ModalProps {
  header: string;
  content: string;
  footer?: React.ReactNode;
  onClose: () => void;  // Add this line
  onClick?: () => void;
}

const ModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
`;

const DangerModal: React.FC<ModalProps> = ({ header, content, footer, onClose }) => {
  return (
    <ModalWrapper>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <h2>{header}</h2>
      <p>{content}</p>
      {footer}
    </ModalWrapper>
  );
};

export default DangerModal;
