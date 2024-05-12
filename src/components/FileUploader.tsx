import React from 'react';
import { Button, message } from 'antd';
import axios from 'axios';


type FileUploaderProps = {
  fileType: 'galleryImages' | 'TCs' | 'boatBrochure' | 'groupLeaderPolicy' | 'riskAssessments' | 'HagPoster' | 'bookingConditions' | 'insuranceCertificate';
};

const BASE_URL = process.env.REACT_APP_API_URL || 'https://adejord.co.uk';

const uploadFile = async (file: Blob, fileType: FileUploaderProps['fileType']) => {
    
    const formData = new FormData();
    formData.append('fileType', fileType); // Append fileType to the FormData object (NEEDS TO BE 1sT)
    formData.append('file', file);
    formData.append('newsImage', file);
    

    const uploadUrl = `${BASE_URL}/uploadFile`;

    try {
        const response = await axios.post(uploadUrl, formData, {
            timeout: 120000, // Timeout after 120 seconds
          });
        console.log('Upload successful:', response.data);
        message.success('File uploaded successfully!');
    } catch (error: any) {
        console.error('Upload error:', error);
        message.error('Upload failed: ' + error.response?.data?.error || 'Server error');
    }
};

const FileUploader: React.FC<FileUploaderProps> = ({ fileType }) => {
    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadFile(file, fileType);  // Pass the fileType from props
            event.target.value = '';  // Reset the file input after upload
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
            <input style={{
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
            onChange={handleFileChange} />
        </div>
    );
};

export default FileUploader;
