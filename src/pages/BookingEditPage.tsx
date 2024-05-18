import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/modal/Modal';
import DangerModal from '../components/modal/DangerModal';
import Backdrop from '../components/modal/ModalBackdrop';
import {
    Root,
    FormRoot,
    FormContainer,
    Button,
    GroupLabel,
} from '../styles';
import { set } from 'date-fns';
import Select from 'react-select';
import { Resolver, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';

interface FormData {
    first_name: string;
    surname: string;
    group_name?: string;
    contact_number: string;
    email_address: string;
    house_number: string;
    street_name: string;
    city: string;
    postcode: string;
    booking_date: string;
    total_passengers: number;
    wheelchair_users: number;
    smoking: boolean;
    destination: string;
    lunch_arrangements: string;
    notes?: string;
    terms_and_conditions: boolean;
    group_leader_policy: boolean;
    skipper?: string;
    crew1?: string;
    crew2?: string;
};

interface Volunteer {
    surname: string;
    first_name: string;
    name: string;
    role: string;
};




const BASE_URL = 'https://adejord.co.uk'; // Replace with your API base URL

//NEED TO make sure you cant book in past, allow mariel to assign skippers and creww to bookings

// Define the fetchBookingData function DOES NOT SEEM TO BE WORKING
const fetchBookingData = async (bookingId: any) => {

    try {

        if (isNaN(bookingId)) {
            console.log('Invalid booking ID:', bookingId);
            return;
        }

        // Parse bookingId to integer if your database expects an integer
        const id = parseInt(bookingId, 10);
        const response = await axios.get(`${BASE_URL}/getBookingById/${id}`);
        console.log('response:', response.data);
        console.log('Booking ID:', id);
        return response.data;
    } catch (error) {
        console.log('Error fetching booking data:', error);
        throw error;
    }
};


const isBookingDateAvailable = async (date: string) => {
    try {
        const currentDate = new Date();
        const selectedDate = new Date(date);

        if (selectedDate <= currentDate) {
            return false;
        }

        //Get booked dates from the API
        const response = await axios.get(`https://adejord.co.uk/dates?date=${date}`);
        const bookedDates = response.data;
        // console.log('Selected Date:', selectedDate);
        // console.log('Booked Dates:', bookedDates);
        const isDateBooked = bookedDates.some((bookedDate: string) => new Date(bookedDate).getTime() === selectedDate.getTime());
        // console.log('Is Date Booked:', isDateBooked);

        return !isDateBooked;
    } catch (error) {
        console.error('Error checking booking availability:', error);
        return false;
    }
};



// Function to update booking data by bookingId
export const updateBookingData = async (bookingId: number, formData: any) => {
    try {
        const response = await axios.patch(`${BASE_URL}/updateBooking/${bookingId}`, formData);
        return response.data;
    } catch (error) {
        console.log('error editing booking')
        throw error;
    }
};



// Function to delete booking data by bookingId
const deleteBookingData = async (bookingId: any) => {
    try {
        const response = await axios.delete(`${BASE_URL}/deleteBooking/${bookingId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Define the schema for form validation
const schema = yup.object().shape({
    first_name: yup.string().required('You must enter a first name'),
    surname: yup.string().required('You must enter a surname'),
    group_name: yup.string().notRequired(),
    contact_number: yup.string().required('You must enter a contact number'),
    email_address: yup.string().required('You must enter an email address'),
    house_number: yup.string().required('You must enter a house number'),
    street_name: yup.string().required('You must enter a street name'),
    city: yup.string().required('You must enter a city'),
    postcode: yup.string().required('You must enter a postcode'),
    booking_date: yup
        .string()
        .required('You must select a date')
        .test({
            name: 'is-future-date',
            message: 'We can travel the canals but, unfortunately, not through time. Please select a date that is in the future!',
            test: function (value) {
                const currentDate = new Date();
                const selectedDate = new Date(value);

                return selectedDate > currentDate;
            },
        })
        .test({
            name: 'is-booking-date-available',
            message: 'There is already a booking on this date, please choose another',
            test: async function (value) {
                if (value) {
                    return await isBookingDateAvailable(value);
                }
                return false;
            },
        }),
    total_passengers: yup
        .number()
        .transform((value, originalValue) => {
            return (originalValue === '' || originalValue === null || originalValue === undefined) ? null : value;
        })
        .required('Total passengers is required')
        .oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "Maximum of 12 passengers per booking"),
    wheelchair_users: yup
        .number()
        .transform((value, originalValue) => {
            return (originalValue === '' || originalValue === null || originalValue === undefined) ? null : value;
        })
        .required('Wheelchair user count is required')
        .oneOf([0, 1, 2], "Maximum of 2 wheelchair users per booking"),
    smoking: yup.boolean().required("Please select Yes or No for smoking"),
    destination: yup.string().required("Please select a destination"),
    lunch_arrangements: yup.string().required("Please select a lunch option"),
    notes: yup.string().notRequired(),
    terms_and_conditions: yup.boolean().oneOf([true], 'Please accept the terms and conditions'),
    group_leader_policy: yup.boolean().oneOf([true], 'Please accept the group leader policy'),
    skipper: yup.string().notRequired(),
    crew1: yup.string().notRequired(),
    crew2: yup.string().notRequired(),
    adminOther: yup.string().notRequired(),
});



type MyResolverType = Resolver<FormData, typeof yupResolver>;

const BookingEditPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDangerModal, setShowDangerModal] = useState(false);
    const [showSuccessDeleteModal, setShowSuccessDeleteModal] = useState(false);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [skippers, setSkippers] = useState<string[]>([]);
    const [crew1, setCrew1] = useState<string[]>([]);
    const [crew2, setCrew2] = useState<string[]>([]);
    const [adminOther, setAdminOther] = useState<string[]>([]);

    // fetch list of volunteers from adejord.co.uk/volunteers
    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const response = await axios.get("https://adejord.co.uk/volunteers");
                console.log("API Response:", response.data); // Log to confirm the response data
                setVolunteers(response.data);
            } catch (error) {
                console.error("Error fetching volunteers:", error);
            }
        };
        fetchVolunteers();
    }, []);

    // filter skippers, crew1 and crew2 from volunteers for asigning crew dropdowns
    useEffect(() => {
        console.log("Volunteers for filtering:", volunteers); // Log to check volunteers before filtering

        const filteredSkippers = volunteers
            .filter(volunteer => {
                if (volunteer.role) {
                    const role = volunteer.role.trim().toLowerCase();
                    // console.log("Checking volunteer role (trimmed and lowercased):", role); // Log each volunteer's role
                    return role === 'skipper';
                } else {
                    console.log("Volunteer with no role or null role:", volunteer);
                    return false;
                }
            })
            .map(volunteer => `${volunteer.first_name} ${volunteer.surname}`);
        // console.log("Filtered Skippers:", filteredSkippers); // Log the filtered result
        setSkippers(filteredSkippers);

        const filteredCrew1 = volunteers
            .filter(volunteer => {
                if (volunteer.role) {
                    const role = volunteer.role.trim().toLowerCase();
                    return role === 'crew1';
                } else {
                    return false;
                }
            })
            .map(volunteer => `${volunteer.first_name} ${volunteer.surname}`);
        setCrew1(filteredCrew1);

        const filteredCrew2 = volunteers
            .filter(volunteer => {
                if (volunteer.role) {
                    const role = volunteer.role.trim().toLowerCase();
                    return role === 'crew2';
                } else {
                    return false;
                }
            })
            .map(volunteer => `${volunteer.first_name} ${volunteer.surname}`);
        setCrew2(filteredCrew2);

        const filteredAdminOther = volunteers
            .filter(volunteer => {
                if (volunteer.role) {
                    const role = volunteer.role.trim().toLowerCase();
                    return role === 'admin/other';
                } else {
                    return false;
                }
            })
            .map(volunteer => `${volunteer.first_name} ${volunteer.surname}`);
        setAdminOther(filteredAdminOther);
    }, [volunteers]);

    const [formData, setFormData] = useState({
        first_name: "",
        surname: "",
        group_name: "",
        contact_number: "",
        email_address: "",
        house_number: "",
        street_name: "",
        city: "",
        postcode: "",
        booking_date: "",
        total_passengers: "",
        wheelchair_users: "",
        smoking: "",
        destination: "",
        lunch_arrangements: "",
        notes: "",
        terms_and_conditions: "",
        group_leader_policy: "",
        bookingMonth: "",
    });

    // Fetch booking data based on bookingId (useEffect to fetch data when the component mounts)
    useEffect(() => {
        if (!bookingId) {
            console.error('No booking Id provided');
            return;
        }

        fetchBookingData(bookingId)
            .then((fetchedData) => {
                setFormData(fetchedData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [bookingId]);

    console.log('formData:', formData);

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
        updateBookingData(Number(bookingId), formData)
            .then(() => {
                setShowSuccessModal(true); // Show the success modal on successful update
            })
            .catch((error) => {
                console.error("Error in BookingEditPage:", error.message);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error("Response data:", error.response.data);
                    console.error("Response status:", error.response.status);
                    console.error("Response headers:", error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error("No response received:", error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error("Error message:", error.message);
                }
                setShowDangerModal(true); // Show the danger modal on error
            });
    };

    const handleDangerModalOpen = () => {
        setShowSuccessModal(false); // Ensure success modal is closed
        setShowDangerModal(true);
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false); // Close the modal
    };

    const handleDeleteSuccessModalClick = () => {
        setShowSuccessModal(false); // Close the modal
        setShowSuccessDeleteModal(true); // Show the success modal on successful update
        navigate(`/`); // Navigate to the desired page
    }

    const handleCloseDeleteSuccessModal = () => {
        setShowSuccessDeleteModal(false); // Close the modal
    }



    const handleDangerModalDeleteClick = () => {
        deleteBookingData(bookingId)

            .then(() => {
                console.log('Booking delete started')
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

    const {
        register,
        formState: { errors },
        setValue,  // Import setValue from useForm
    } = useForm<FormData>({
        resolver: yupResolver(schema) as unknown as MyResolverType,
    });

    return (
        <Root>
            <FormRoot>
                {showSuccessModal && (
                    <Backdrop onClick={handleCloseSuccessModal}> {/* Add this onClick */}
                        <Modal
                            header="Update Submitted"
                            content="Booking has been updated"
                            footer="Thank you"
                            onClick={handleUpdateSuccessModalClick}
                        />
                    </Backdrop>
                )}
                {showSuccessDeleteModal && (
                    <Backdrop onClick={handleCloseDeleteSuccessModal}> {/* Add this onClick */}
                        <Modal
                            header="DELETED"
                            content="Booking has successfully been deleted"
                            footer="Thank you"
                            onClick={handleDeleteSuccessModalClick}
                        />
                    </Backdrop>
                )}
                {showDangerModal && (
                    <Backdrop onClick={handleCloseSuccessModal}>
                        <DangerModal
                            header="Delete Confirmation"
                            content="Are you sure you want to delete this booking? (This cannot be undone)"
                            footer={<div
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
                            </div>} onClose={function (): void {
                                throw new Error('Function not implemented.');
                            }} />
                    </Backdrop>
                )}

                <h1>Edit Booking</h1>
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
                        <label>Group/Org name:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="group_name"
                            value={formData.group_name}
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
                        <label>Booking Date:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="booking_date"
                            value={new Date(formData.booking_date).toLocaleDateString('en-GB')}
                            onChange={handleInputChange}
                        />
                        <label>Passengers:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="total_passengers"
                            value={formData.total_passengers}
                            onChange={handleInputChange}
                        />
                        <label>Wheelchair Users:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="wheelchair_users"
                            value={formData.wheelchair_users}
                            onChange={handleInputChange}
                        />
                        <label>Smoking:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="smoking"
                            value={formData.smoking ? "Yes" : "No"}
                            onChange={handleInputChange}
                        />
                        <label>Destination:</label>
                        <input
                            style={{ width: "20vw" }}
                            type="text"
                            name="destination"
                            value={formData.destination}
                            onChange={handleInputChange}
                        />
                        <label>Lunch Arrangements:</label>
                        <input
                            style={{ width: "10vw" }}
                            type="text"
                            name="lunch_arrangements"
                            value={formData.lunch_arrangements}
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
                        <label>Terms and Conditions:</label>
                        <input
                            style={{ width: "10vw" }}
                            type="text"
                            name="terms_and_conditions"
                            value={formData.terms_and_conditions ? "Agreed" : "Not Agreed"}
                            onChange={handleInputChange}
                        />
                        <label>Group Leader Policy:</label>
                        <input
                            style={{ width: "10vw" }}
                            type="text"
                            name="group_leader_policy"
                            value={formData.group_leader_policy ? "Agreed" : "Not Agreed"}
                            onChange={handleInputChange}
                        />
                        <hr />
                        <br />
                        <GroupLabel>
                            Assign Crew
                        </GroupLabel>
                        <GroupLabel>
                            <label htmlFor="skipper">Skipper</label>
                            <select id="skipper" {...register("skipper")}>
                                <option value="">Select a skipper</option>
                                {skippers.map((skipper, index) => (
                                    <option key={index} value={skipper}>
                                        {skipper}
                                    </option>
                                ))}
                            </select>
                        </GroupLabel>
                        <GroupLabel>
                            <label htmlFor="crew1">1st Crew</label>
                            <select id="crew1" {...register("crew1")}>
                                <option value="">Select a 1st Crew</option>
                                {crew1.map((crew1, index) => (
                                    <option key={index} value={crew1}>
                                        {crew1}
                                    </option>
                                ))}
                            </select>
                        </GroupLabel>
                        <GroupLabel>
                            <label htmlFor="crew2">2nd Crew</label>
                            <select id="crew2" {...register("crew2")}>
                                <option value="">Select a 2nd Crew</option>
                                {crew2.map((crew2, index) => (
                                    <option key={index} value={crew2}>
                                        {crew2}
                                    </option>
                                ))}
                            </select>
                        </GroupLabel>
                        <GroupLabel>
                            <label htmlFor="paid">Paid - </label>
                        </GroupLabel>

                        <GroupLabel>
                            <label htmlFor="completed">Completed? - </label>
                        </GroupLabel>

                        <Button
                            style={{
                                backgroundColor: 'green',
                                color: 'white',
                                border: 'none'
                            }}
                            type="submit">SAVE CHANGES</Button>
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
                        <br />
                    </form>
                </FormContainer>
            </FormRoot>
        </Root>
    );
};

export default BookingEditPage;
