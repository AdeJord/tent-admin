import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    Input,
    Label,
    NarrowInput,
} from '../styles';
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

const BASE_URL = 'https://adejord.co.uk';

const fetchBookingData = async (bookingId: any) => {
    try {
        const id = parseInt(bookingId, 10);
        const response = await axios.get(`${BASE_URL}/getBookingById/${id}`);
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

        const response = await axios.get(`${BASE_URL}/dates?date=${date}`);
        const bookedDates = response.data;
        const isDateBooked = bookedDates.some((bookedDate: string) => new Date(bookedDate).getTime() === selectedDate.getTime());

        return !isDateBooked;
    } catch (error) {
        console.error('Error checking booking availability:', error);
        return false;
    }
};

const updateBookingData = async (bookingId: number, formData: any) => {
    try {
        const response = await axios.patch(`${BASE_URL}/updateBooking/${bookingId}`, formData);
        console.log('Form Data:', formData)
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.log('Error editing booking:', error);
        throw error;
    }
};

const deleteBookingData = async (bookingId: any) => {
    try {
        const response = await axios.delete(`${BASE_URL}/deleteBooking/${bookingId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

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
            message: 'Please select a future date!',
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
    total_passengers: yup.number().required('Total passengers is required').oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "Maximum of 12 passengers per booking"),
    wheelchair_users: yup.number().required('Wheelchair user count is required').oneOf([0, 1, 2], "Maximum of 2 wheelchair users per booking"),
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

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/volunteers`);
                setVolunteers(response.data);
            } catch (error) {
                console.error("Error fetching volunteers:", error);
            }
        };
        fetchVolunteers();
    }, []);

    useEffect(() => {
        const filteredSkippers = volunteers.filter(volunteer => volunteer.role.trim().toLowerCase() === 'skipper').map(volunteer => `${volunteer.first_name} ${volunteer.surname}`);
        setSkippers(filteredSkippers);

        const filteredCrew1 = volunteers.filter(volunteer => volunteer.role.trim().toLowerCase() === 'crew1').map(volunteer => `${volunteer.first_name} ${volunteer.surname}`);
        setCrew1(filteredCrew1);

        const filteredCrew2 = volunteers.filter(volunteer => volunteer.role.trim().toLowerCase() === 'crew2').map(volunteer => `${volunteer.first_name} ${volunteer.surname}`);
        setCrew2(filteredCrew2);

        const filteredAdminOther = volunteers.filter(volunteer => volunteer.role.trim().toLowerCase() === 'admin/other').map(volunteer => `${volunteer.first_name} ${volunteer.surname}`);
        setAdminOther(filteredAdminOther);
    }, [volunteers]);

    const [formData, setFormData] = useState<FormData>({
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
        total_passengers: 1,
        wheelchair_users: 0,
        smoking: false,
        destination: "",
        lunch_arrangements: "",
        notes: "",
        terms_and_conditions: false,
        group_leader_policy: false,
        skipper: "",
        crew1: "",
        crew2: "",
    });


//NOT UPDATING THE FORM DATA
// SENDING EMPTY ARRAY
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        updateBookingData(Number(bookingId), formData)
            .then(() => {
                setShowSuccessModal(true);
                console.log('Booking Data', formData)
            })
            .catch((error) => {
                console.error("Error in BookingEditPage:", error.message);
                setShowDangerModal(true);
            });
    };

    const handleDangerModalOpen = () => {
        setShowSuccessModal(false);
        setShowDangerModal(true);
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const handleDeleteSuccessModalClick = () => {
        setShowSuccessModal(false);
        setShowSuccessDeleteModal(true);
        navigate(`/`);
        window.scrollTo(0, 0);
    }

    const handleCloseDeleteSuccessModal = () => {
        setShowSuccessDeleteModal(false);
    }

    const handleDangerModalDeleteClick = () => {
        deleteBookingData(bookingId)
            .then(() => {
                setShowDangerModal(false);
                setShowSuccessDeleteModal(true);
            })
            .catch((error) => {
                console.error(error);
                setShowDangerModal(true);
            });
    };

    const handleDangerModalCancel = () => {
        setShowDangerModal(false);
    }

    const { register, formState: { errors }, setValue } = useForm<FormData>({
        resolver: yupResolver(schema) as unknown as MyResolverType,
    });

    useEffect(() => {
        if (!bookingId) {
            console.error('No booking Id provided');
            return;
        }

        fetchBookingData(bookingId)
            .then((fetchedData) => {
                setFormData(fetchedData);
                // Set default skipper, crew1, and crew2 values in the form
                setValue('skipper', fetchedData.skipper);
                setValue('crew1', fetchedData.crew1);
                setValue('crew2', fetchedData.crew2);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [bookingId, setValue]);

    return (
        <Root>
            <FormRoot>
                {showSuccessModal && (
                    <Backdrop onClick={handleCloseSuccessModal}>
                        <Modal
                            header="Update Submitted"
                            content="Booking has been updated"
                            footer="Thank you"
                            onClick={handleDeleteSuccessModalClick}
                        />
                    </Backdrop>
                )}
                {showSuccessDeleteModal && (
                    <Backdrop onClick={handleCloseDeleteSuccessModal}>
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
                                <Button onClick={handleDangerModalCancel} type="submit" style={{ backgroundColor: "#EAF3E7", color: "#051101", fontSize: "calc(5px + 2vmin)" }}>CANCEL</Button>
                                <Button onClick={handleDangerModalDeleteClick} type="submit" style={{ backgroundColor: "red", color: "#051101", fontSize: "calc(5px + 2vmin)" }}>DELETE</Button>
                            </div>} onClose={function (): void {
                                throw new Error('Function not implemented.');
                            } }                        />
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

                        <Label>First Name:</Label>
                        <Input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} />
                        <Label>Surname:</Label>
                        <Input type="text" name="surname" value={formData.surname} onChange={handleInputChange} />
                        <Label>Group/Org name:</Label>
                        <Input type="text" name="group_name" value={formData.group_name} onChange={handleInputChange} />
                        <Label>Contact Number:</Label>
                        <Input type="text" name="contact_number" value={formData.contact_number} onChange={handleInputChange} />
                        <Label>Email Address:</Label>
                        <Input type="text" name="email_address" value={formData.email_address} onChange={handleInputChange} />
                        <Label>House Number:</Label>
                        <Input type="text" name="house_number" value={formData.house_number} onChange={handleInputChange} />
                        <Label>Street Name:</Label>
                        <Input type="text" name="street_name" value={formData.street_name} onChange={handleInputChange} />
                        <Label>City:</Label>
                        <Input type="text" name="city" value={formData.city} onChange={handleInputChange} />
                        <Label>Postcode:</Label>
                        <NarrowInput type="text" name="postcode" value={formData.postcode} onChange={handleInputChange} />
                        <Label>Booking Date:</Label>
                        <NarrowInput type="text" name="booking_date" value={new Date(formData.booking_date).toLocaleDateString('en-GB')} onChange={handleInputChange} />
                        <Label>Passengers:</Label>
                        <NarrowInput type="text" name="total_passengers" value={formData.total_passengers} onChange={handleInputChange} />
                        <Label>Wheelchair Users:</Label>
                        <NarrowInput type="text" name="wheelchair_users" value={formData.wheelchair_users} onChange={handleInputChange} />
                        <Label>Smoking:</Label>
                        <NarrowInput type="text" name="smoking" value={formData.smoking ? "Yes" : "No"} onChange={handleInputChange} />
                        <Label>Destination:</Label>
                        <NarrowInput type="text" name="destination" value={formData.destination} onChange={handleInputChange} />
                        <Label>Lunch Arrangements:</Label>
                        <Input type="text" name="lunch_arrangements" value={formData.lunch_arrangements} onChange={handleInputChange} />
                        <Label>Notes:</Label>
                        <Input type="text" name="notes" value={formData.notes} onChange={handleInputChange} />
                        <Label>Terms and Conditions:</Label>
                        <NarrowInput type="text" name="terms_and_conditions" value={formData.terms_and_conditions ? "Agreed" : "Not Agreed"} onChange={handleInputChange} />
                        <Label>Group Leader Policy:</Label>
                        <NarrowInput type="text" name="group_leader_policy" value={formData.group_leader_policy ? "Agreed" : "Not Agreed"} onChange={handleInputChange} />

                        <br />
                        <GroupLabel>Assign Crew</GroupLabel>
                        <GroupLabel>
                            <Label htmlFor="skipper">Skipper</Label>
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
                            <Label htmlFor="crew1">1st Crew</Label>
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
                            <Label htmlFor="crew2">2nd Crew</Label>
                            <select id="crew2" {...register("crew2")}>
                                <option value="">Select a 2nd Crew</option>
                                {crew2.map((crew2, index) => (
                                    <option key={index} value={crew2}>
                                        {crew2}
                                    </option>
                                ))}
                            </select>
                        </GroupLabel>
                        <Button style={{ backgroundColor: 'green', color: 'white', border: 'none' }} type="submit">SAVE CHANGES</Button>
                        <br />
                        <div style={{ backgroundColor: 'red', color: 'white', width: '10vw', height: '5vh', borderRadius: '5px', border: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0.5rem', }}>
                            <Button onClick={() => handleDangerModalOpen()} style={{ backgroundColor: 'red', color: 'white', border: 'none' }} type='button'>DELETE</Button>
                        </div>
                        <br />
                    </form>
                </FormContainer>
            </FormRoot>
        </Root>
    );
};

export default BookingEditPage;
