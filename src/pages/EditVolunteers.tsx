import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/modal/Modal';
import DangerModal from '../components/modal/DangerModal';
import Backdrop from '../components/modal/ModalBackdrop';
import { Root, FormRoot, FormContainer, Button, ButtonContainer } from '../styles';
import { set } from 'date-fns';

const BASE_URL = 'https://adejord.co.uk'; // Replace with your API base URL

// Define the fetchBookingData function
const fetchVolunteerData = async (volunteerId: any) => {
    try {
        const response = await axios.get(`${BASE_URL}/volunteers/${volunteerId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to update booking data by volunteerId
export const updateVolunteerData = async (VolunteerId: any, formData: any) => {
    try {
        const response = await axios.patch(`${BASE_URL}/updateVolunteer/${VolunteerId}`, formData);
        return response.data;
    } catch (error) {
        console.log('error editing volunteer')
        throw error;
    }
};

// Function to delete booking data by bookingId
const deleteVolunteerData = async (bookingId: any) => {
    try {
        const response = await axios.delete(`${BASE_URL}/deleteVolunteer/${bookingId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const EditVolunteers = () => {
    const { volunteerId } = useParams();
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDangerModal, setShowDangerModal] = useState(false);
    const [showSuccessDeleteModal, setShowSuccessDeleteModal] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        surname: '',
        contact_number: '',
        email_address: '',
        house_number: '',
        street_name: '',
        city: '',
        postcode: '',
        role: '',
        notes: '',

        // Add other fields here
    });

    // Fetch booking data based on bookingId (useEffect to fetch data when the component mounts)
    useEffect(() => {
        if (!volunteerId) {
            console.error('No Volunteer Id provided');
            return;
        }

        fetchVolunteerData(volunteerId)
            .then((fetchedData) => {
                setFormData(fetchedData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [volunteerId]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };



    // Handle form submission (you can customize this part based on your API)
    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        updateVolunteerData(volunteerId, formData)
            .then(() => {
                setShowSuccessModal(true); // Show the success modal on successful update
            })
            .catch((error) => {
                console.error(error);
                setShowDangerModal(true); // Show the danger modal on error
            });
    };

    const handleDangerModalOpen = () => {
        setShowSuccessModal(false); // Ensure success modal is closed
        setShowDangerModal(true);
    };

    const handleDeleteSuccessModalClick = () => {
        setShowSuccessModal(false); // Close the modal
        setShowSuccessDeleteModal(true); // Show the success modal on successful update
        navigate(`/`); // Navigate to the desired page
    };

    const handleDangerModalDeleteClick = () => {
        deleteVolunteerData(volunteerId)
            .then(() => {
                // Delete operation succeeded
                setShowDangerModal(false); // Close the delete modal
                setShowSuccessDeleteModal(true); // Show the success modal
                // Navigate to the desired page if needed
                // alert('Booking has been deleted');
                // navigate(`/`);
            })
            .catch((error) => {
                // Delete operation failed
                console.error(error);
                setShowDangerModal(true); // Show the danger modal on error
            });
    };

    const handleDangerModalCancel = () => {
        setShowDangerModal(false); // Close the modal
    }

    const handleUpdateSuccessModalClick = () => {
        setShowSuccessModal(false); // Close the modal
        navigate(`/`); // Navigate to the desired page
    }

    return (
        <Root>
            <FormRoot>
                {showSuccessModal && (
                    <Backdrop>
                        <Modal
                            header="Update Submitted"
                            content="Record has been updated"
                            footer="Thank you"
                            // Assuming your Modal component can accept an onClick prop
                            onClick={handleUpdateSuccessModalClick}
                        />
                    </Backdrop>
                )}
                {showSuccessDeleteModal && (
                    <Backdrop>
                        <Modal
                            header="DELETED"
                            content="Volunteer has successfully been deleted"
                            footer="Thank you"
                            // Assuming your Modal component can accept an onClick prop
                            onClick={handleDeleteSuccessModalClick}
                        />
                    </Backdrop>
                )}
                {showDangerModal && (
                    <Backdrop>
                        <DangerModal
                            onClick={() => setShowDangerModal(false)} // Close the modal when clicked outside
                            header="Delete Confirmation"
                            content="Are you sure you want to delete this volunteer? (this action cannot be undone)"
                            footer={
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}>

                                    <Button
                                        onClick={handleDangerModalCancel}
                                        type="submit"
                                        style={{ backgroundColor: "#EAF3E7", color: "#051101", fontSize: "calc(5px + 2vmin)" }}
                                    >CANCEL</Button>
                                    <Button
                                        onClick={handleDangerModalDeleteClick}
                                        type="submit"
                                        style={{ backgroundColor: "red", color: "#051101", fontSize: "calc(5px + 2vmin)" }}
                                    >DELETE</Button>
                                </div>
                            }
                        />
                    </Backdrop>
                )}

                <h1>Edit Volunteer</h1>
                <FormContainer>
                    <form
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            paddingTop: "2vh",
                            height: "auto",
                            width: "30vw",
                        }}
                        onSubmit={handleSubmit}>

                        <label>First Name:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                        />
                        <label>Surname:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleInputChange}
                        />
                        <label>Contact Number:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="contact_number"
                            value={formData.contact_number}
                            onChange={handleInputChange}
                        />
                        <label>Email Address:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="email_address"
                            value={formData.email_address}
                            onChange={handleInputChange}
                        />
                        <label>House Number:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="house_number"
                            value={formData.house_number}
                            onChange={handleInputChange}
                        />
                        <label>Street Name:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="street_name"
                            value={formData.street_name}
                            onChange={handleInputChange}
                        />
                        <label>City:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                        />
                        <label>Postcode:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="postcode"
                            value={formData.postcode}
                            onChange={handleInputChange}
                        />
                        <label>Role:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="destination"
                            value={formData.role}
                            onChange={handleInputChange}
                        />
                        <label>Notes:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                        />
                        <br />
                        <div
                            style={{
                                backgroundColor: '#eaf3e7',
                                color: 'white',
                                width: '28vw',
                                height: '5vh',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.5rem',
                            }}>
                            <div
                                style={{
                                    backgroundColor: 'green',
                                    color: 'white',
                                    width: '10vw',
                                    height: '5vh',
                                    borderRadius: '5px',
                                    border: '1px solid black',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: '0.5rem',
                                }}>

                                <Button
                                    style={{
                                        backgroundColor: 'green',
                                        color: 'white',
                                        border: 'none'
                                    }}
                                    type="submit">SAVE CHANGES</Button>
                            </div>
                            <br />
                            <div
                                style={{
                                    backgroundColor: 'red',
                                    color: 'white',
                                    width: '10vw',
                                    height: '5vh',
                                    borderRadius: '5px',
                                    border: '1px solid black',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: '0.5rem',
                                }}>
                                <Button
                                    onClick={() => handleDangerModalOpen()}
                                    style={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                        border: 'none'
                                    }}
                                    type='button'
                                >DELETE </Button>
                            </div>
                        </div>
                        <br />
                    </form>
                </FormContainer>
            </FormRoot>
        </Root>
    );
};

export default EditVolunteers;
