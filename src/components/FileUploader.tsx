import React from 'react';
import { message } from 'antd';
import axios from 'axios';

type FileUploaderProps = {
  fileType: 'galleryImages' | 'TCs' | 'boatBrochure' | 'groupLeaderPolicy' | 'riskAssessments' | 'HagPoster' | 'bookingConditions' | 'insuranceCertificate';
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

const BASE_URL = process.env.REACT_APP_API_URL || 'https://adejord.co.uk';

const uploadFile = async (file: Blob, fileType: FileUploaderProps['fileType'], onSuccess?: () => void, onError?: (error: any) => void) => {
  const formData = new FormData();
  formData.append('fileType', fileType); // Append fileType to the FormData object (NEEDS TO BE 1st)
  formData.append('image', file);

  const uploadUrl = `${BASE_URL}/addGalleryImage`;

  console.log('Uploaded File Type:', fileType);

  try {
    const response = await axios.post(uploadUrl, formData, {
      timeout: 120000, // Timeout after 120 seconds
    });
    console.log('Upload successful:', response.data);
    message.success('File uploaded successfully!');
    if (onSuccess) onSuccess(); // Call the success callback if provided
  } catch (error: any) {
    console.error('Upload error:', error);
    message.error('Upload failed: ' + (error.response?.data?.error || 'Server error'));
    if (onError) onError(error); // Call the error callback if provided
  }
};

const FileUploader: React.FC<FileUploaderProps> = ({ fileType, onSuccess, onError }) => {
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate the file type
      if (file.type !== 'application/pdf' || !file.name.match(/\.pdf$/)) {
        message.error('Only PDF files are allowed');
        return; // Do not proceed with the upload
      }

      uploadFile(file, fileType, onSuccess, onError); // Pass the fileType from props and the callbacks
      event.target.value = ''; // Reset the file input after upload
    }
  };

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      marginTop: '1rem',
    }}>
      <input
        style={{
          width: '100%',
          height: 'auto',
          fontSize: '.9rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'wrap',
          flexDirection: 'column',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '5px',
          marginBottom: '1rem',
        }}
        type="file"
        name="file"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploader;
