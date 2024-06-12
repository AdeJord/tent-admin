import React, { useEffect, useState } from 'react';
import { Button, Modal, message } from 'antd';
import axios from 'axios';
import styled from 'styled-components';

const BASE_URL = 'https://adejord.co.uk';

interface Image {
  id: number;
  // other properties
}

const ImgContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
`;

const ImgWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin: 16px;

  img {
    max-width: 150px;
    max-height: 150px;
  }

  button {
    position: absolute;
    top: 8px;
    right: 8px;
  }
`;

interface Image {
  id: number;
  file_path: string;
}

const ImageGalleryManager: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);

  const getImages = async () => {
    try {
      const response = await axios.get<Image[]>(`${BASE_URL}/galleryImages`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
      message.error('Failed to load images');
    }
  };

  const deleteImage = async (imageId: number) => {
    if (!Number.isInteger(imageId)) {
        message.error('Invalid image ID');
        console.error('Invalid image ID:', imageId);
        return;
    }

    try {
        console.log(`Deleting image with ID: ${imageId}`);

        const response = await axios.delete(`${BASE_URL}/galleryImages/${imageId}`);
        if (response.status === 200) {
            message.success('Image deleted successfully');
            // Assuming setImages is a state update function in your component
            setImages((prevImages: Image[]) => prevImages.filter(img => img.id !== imageId));
        } else {
            message.error('Failed to delete image');
            console.error(`Unexpected status code: ${response.status}`, response);
        }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (axios.isAxiosError(error) && error.request) {
        console.error('Error request data:', error.request);
      } else {
        const errorMessage = error as Error;
        console.error('Error message:', errorMessage.message);
      }
      message.error('Failed to delete image');
    }
};


  useEffect(() => {
    getImages();
  }, []);

  return (
    <div>
      <h2>Manage Gallery Images</h2>
      <ImgContainer>
        {images.length > 0 ? (
          images.map((img) => (
            <ImgWrapper key={img.id}>
              <img src={img.file_path} alt={`Gallery image ${img.id}`} />
              <Button
                type="primary"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: 'Are you sure you want to delete this image?',
                    onOk: () => deleteImage(img.id),
                  });
                }}
              >
                Delete
              </Button>
            </ImgWrapper>
          ))
        ) : (
          <p>No images available.</p>
        )}
      </ImgContainer>
    </div>
  );
};

export default ImageGalleryManager;
