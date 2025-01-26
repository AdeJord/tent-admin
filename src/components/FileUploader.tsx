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
 formData.append('fileType', fileType);
 formData.append('image', file);

 const uploadUrl = `${BASE_URL}/addGalleryImage`;

 console.log('Uploaded File Type:', fileType);

 try {
   const response = await axios.post(uploadUrl, formData, {
     timeout: 120000,
   });
   console.log('Upload successful:', response.data);
   message.success('File uploaded successfully!');
   if (onSuccess) onSuccess();
 } catch (error: any) {
   console.error('Upload error:', error);
   message.error('Upload failed: ' + (error.response?.data?.error || 'Server error'));
   if (onError) onError(error);
 }
};

const FileUploader: React.FC<FileUploaderProps> = ({ fileType, onSuccess, onError }) => {
 const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
   const file = event.target.files?.[0];
   if (file) {
     if (fileType === 'galleryImages') {
       // Check for jpg or png
       const validImageTypes = ['image/jpeg', 'image/png'];
       if (!validImageTypes.includes(file.type)) {
         message.error('Only JPG and PNG files are allowed for gallery uploads');
         return;
       }
     } else {
       // Check for PDF
       if (file.type !== 'application/pdf' || !file.name.match(/\.pdf$/)) {
         message.error('Only PDF files are allowed for document uploads');
         return;
       }
     }

     uploadFile(file, fileType, onSuccess, onError);
     event.target.value = '';
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
       accept={fileType === 'galleryImages' ? ".jpg,.jpeg,.png" : ".pdf"}
       name="file"
       onChange={handleFileChange}
     />
   </div>
 );
};

export default FileUploader;