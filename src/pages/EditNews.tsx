import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/modal/Modal';
import DangerModal from '../components/modal/DangerModal';
import Backdrop from '../components/modal/ModalBackdrop';
import { Root, FormRoot, FormContainer, Button } from '../styles';

const BASE_URL = 'https://adejord.co.uk'; // Replace with your API base URL

const fetchNewsData = async (newsId: string) => {
    try {
        // Ensure BASE_URL is defined correctly, typically something like 'https://adejord.co.uk'
        const response = await axios.get(`${BASE_URL}/news/${newsId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching news data', error);
        throw error;
    }
};


//ISSUE IS HERE
const updateNewsData = async (newsId: string | undefined, formData: { title: string; content: string; image_path: string; date: string; }) => {
    try {
        console.log(`News id = ${BASE_URL}/updateNews/${newsId}`)

        const response = await axios.patch(`${BASE_URL}/updateNews/${newsId}`, formData);
        return response.data;
    } catch (error) {
        console.error('Error editing news', error);
        throw error;
    }
};

const deleteNewsData = async (newsId: string | undefined) => {
    try {
        console.log(`News id = ${BASE_URL}/updateNews/${newsId}`)

        const response = await axios.delete(`${BASE_URL}/news/${newsId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting news', error);
        throw error;
    }
}

const EditNews = () => {
    const { newsId } = useParams();
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDangerModal, setShowDangerModal] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image_path: '',
        date: ''
    });

    useEffect(() => {
        if (!newsId) {
            console.error('No News Id provided');
            return;
        }

        fetchNewsData(newsId)
            .then((fetchedData) => {
                const formattedData = {
                    ...fetchedData,
                    date: fetchedData.date.split('T')[0] // Assumes the date is in ISO format
                };
                setFormData(formattedData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [newsId]);


    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        updateNewsData(newsId, formData)
            .then(() => {
                setShowSuccessModal(true);
            })
            .catch((error) => {
                console.error('Error updating news', error);
                setShowDangerModal(true);
            });
    };

    const handleDelete = () => {
        deleteNewsData(newsId)
            .then(() => {
                navigate(`/`);
            })
            .catch((error) => {
                console.error('Error deleting news', error);
                setShowDangerModal(true);
            });
    };

    const handleCancel = () => {    
        setShowDangerModal(false);
    };

    // Function to convert file system path to web URL path
    function toWebPath(internalPath: string) {
        if (!internalPath) return '';
        return internalPath.replace('/var/www', '');
    }


    return (
        <Root>
            <FormRoot
                style={{
                    paddingTop: '20px',
                }}>
                {showSuccessModal && (
                    <Backdrop>
                        <Modal
                            header="Update Submitted"
                            content="News item has been updated."
                            onClick={() => navigate(`/`)} footer={undefined} />
                    </Backdrop>
                )}
                {showDangerModal && (
                    <Backdrop>
                        <DangerModal
                            header="Delete Confirmation"
                            content="Are you sure you want to delete this news item? This action cannot be undone."
                            footer={
                                <div>
                                    <Button onClick={handleDelete}>DELETE</Button>
                                    <Button onClick={handleCancel}>CANCEL</Button>

                                </div>
                            }

                            // footer={<Button onClick={handleDelete}>DELETE</Button>}

                            onClick={() => setShowDangerModal(false)}
                        />

                    </Backdrop>
                )}
                <FormContainer
                    style={{
                        padding: '10px',
                        paddingTop: '20px',

                    }}>
                    <form
                        style={{
                            padding: '10px',
                            width: '80%',
                        }}
                        onSubmit={handleSubmit}>
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                        <br />
                        <br />

                        <label>Content:</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            style={{
                                height: '100px',
                                width: '100%',
                            }}
                        />
                        <br />
                        <div>
                            {formData.image_path && (
                                <img
                                    src={`https://adejord.co.uk${toWebPath(formData.image_path)}`}
                                    alt="news"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                />
                            )}
                        </div>
                        <br />
                        <label>Date:</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                        />
                        <Button type="submit">Save Changes</Button>
                        <Button type="button" onClick={() => setShowDangerModal(true)}>Delete</Button>
                    </form>
                </FormContainer>
            </FormRoot>
        </Root>
    );
};

export default EditNews;
