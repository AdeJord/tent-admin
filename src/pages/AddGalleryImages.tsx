import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import FileUploader from '../components/FileUploader';

const AddGalleryImages: React.FC = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    Modal.success({ content: 'Image uploaded successfully!' });
    navigate('/'); // Navigate to the homepage or another route as needed
  };

  const handleUploadError = (error: any) => {
    console.error('Error during form submission:', error);
    Modal.error({ title: 'Upload Error', content: 'Failed to upload image. Please try again.' });
  };

  return (
    <div style={{ padding: '20px', width: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Upload Gallery Images</h2>
      <div
            style={{
                width: '20%',
                maxWidth: '400px',
                minWidth: '200px',
              }}
              >
      <FileUploader 
      fileType="galleryImages" 
      onSuccess={handleUploadSuccess} 
      onError={handleUploadError} />
    </div>
    </div>
  );
};

export default AddGalleryImages;
