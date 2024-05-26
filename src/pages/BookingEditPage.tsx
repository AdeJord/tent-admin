import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
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
}

interface Volunteer {
    surname: string;
    first_name: string;
    name: string;
    role: string;
}

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
        console.log('Form Data:', formData);
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
});

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

    useEffect(() => {
        if (!bookingId) {
            console.error('No booking Id provided');
            return;
        }

        fetchBookingData(bookingId)
            .then((fetchedData) => {
                console.log('Fetched Data:', fetchedData); // Debug statement
                setFormData(fetchedData);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [bookingId]);

    const handleSubmit = async (values: FormData) => {
        console.log('Form values on submit:', values); // Debug statement
        try {
          await updateBookingData(Number(bookingId), values);
          setShowSuccessModal(true);
          console.log('Booking Data', values);
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error in BookingEditPage:", error.message);
          } else {
            console.error("An unknown error occurred");
          }
          setShowDangerModal(true);
        }
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
                            </div>} onClose={() => setShowDangerModal(false)}
                        />
                    </Backdrop>
                )}

                <h1>Edit Booking</h1>
                <FormContainer>
                    <Formik
                        initialValues={formData}
                        // validationSchema={schema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ values, handleChange }) => (
                            <>
                                {console.log('Rendering Formik form')} {/* Debug statement */}
                                <Form style={{ display: "flex", flexDirection: "column", paddingTop: "2vh", height: "auto", width: "30vw" }}>
                                    <Label>First Name:</Label>
                                    <Field type="text" name="first_name" as={Input} />
                                    <ErrorMessage name="first_name" component="div" />

                                    <Label>Surname:</Label>
                                    <Field type="text" name="surname" as={Input} />
                                    <ErrorMessage name="surname" component="div" />

                                    <Label>Group/Org name:</Label>
                                    <Field type="text" name="group_name" as={Input} />
                                    <ErrorMessage name="group_name" component="div" />

                                    <Label>Contact Number:</Label>
                                    <Field type="text" name="contact_number" as={Input} />
                                    <ErrorMessage name="contact_number" component="div" />

                                    <Label>Email Address:</Label>
                                    <Field type="text" name="email_address" as={Input} />
                                    <ErrorMessage name="email_address" component="div" />

                                    <Label>House Number:</Label>
                                    <Field type="text" name="house_number" as={Input} />
                                    <ErrorMessage name="house_number" component="div" />

                                    <Label>Street Name:</Label>
                                    <Field type="text" name="street_name" as={Input} />
                                    <ErrorMessage name="street_name" component="div" />

                                    <Label>City:</Label>
                                    <Field type="text" name="city" as={Input} />
                                    <ErrorMessage name="city" component="div" />

                                    <Label>Postcode:</Label>
                                    <Field type="text" name="postcode" as={NarrowInput} />
                                    <ErrorMessage name="postcode" component="div" />

                                    <Label>Booking Date:</Label>
                                    <Field type="text" name="booking_date" as={NarrowInput} value={new Date(values.booking_date).toLocaleDateString('en-GB')} onChange={handleChange} />
                                    <ErrorMessage name="booking_date" component="div" />

                                    <Label>Passengers:</Label>
                                    <Field type="text" name="total_passengers" as={NarrowInput} />
                                    <ErrorMessage name="total_passengers" component="div" />

                                    <Label>Wheelchair Users:</Label>
                                    <Field type="text" name="wheelchair_users" as={NarrowInput} />
                                    <ErrorMessage name="wheelchair_users" component="div" />

                                    <Label>Smoking:</Label>
                                    <Field type="text" name="smoking" as={NarrowInput} value={values.smoking ? "Yes" : "No"} onChange={handleChange} />
                                    <ErrorMessage name="smoking" component="div" />

                                    <Label>Destination:</Label>
                                    <Field type="text" name="destination" as={NarrowInput} />
                                    <ErrorMessage name="destination" component="div" />

                                    <Label>Lunch Arrangements:</Label>
                                    <Field type="text" name="lunch_arrangements" as={Input} />
                                    <ErrorMessage name="lunch_arrangements" component="div" />

                                    <Label>Notes:</Label>
                                    <Field type="text" name="notes" as={Input} />
                                    <ErrorMessage name="notes" component="div" />

                                    <Label>Terms and Conditions:</Label>
                                    <Field type="text" name="terms_and_conditions" as={NarrowInput} value={values.terms_and_conditions ? "Agreed" : "Not Agreed"} onChange={handleChange} />
                                    <ErrorMessage name="terms_and_conditions" component="div" />

                                    <Label>Group Leader Policy:</Label>
                                    <Field type="text" name="group_leader_policy" as={NarrowInput} value={values.group_leader_policy ? "Agreed" : "Not Agreed"} onChange={handleChange} />
                                    <ErrorMessage name="group_leader_policy" component="div" />

                                    <br />
                                    <GroupLabel>Assign Crew</GroupLabel>
                                    <GroupLabel>
                                        <Label htmlFor="skipper">Skipper</Label>
                                        <Field as="select" id="skipper" name="skipper">
                                            <option value="">Select a skipper</option>
                                            {skippers.map((skipper, index) => (
                                                <option key={index} value={skipper}>
                                                    {skipper}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="skipper" component="div" />
                                    </GroupLabel>
                                    <GroupLabel>
                                        <Label htmlFor="crew1">1st Crew</Label>
                                        <Field as="select" id="crew1" name="crew1">
                                            <option value="">Select a 1st Crew</option>
                                            {crew1.map((crew, index) => (
                                                <option key={index} value={crew}>
                                                    {crew}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="crew1" component="div" />
                                    </GroupLabel>
                                    <GroupLabel>
                                        <Label htmlFor="crew2">2nd Crew</Label>
                                        <Field as="select" id="crew2" name="crew2">
                                            <option value="">Select a 2nd Crew</option>
                                            {crew2.map((crew, index) => (
                                                <option key={index} value={crew}>
                                                    {crew}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="crew2" component="div" />
                                    </GroupLabel>

                                    <Button type="submit" style={{ backgroundColor: 'green', color: 'white', border: 'none' }}>SAVE CHANGES</Button>
                                    <br />
                                    <div style={{ backgroundColor: 'red', color: 'white', width: '10vw', height: '5vh', borderRadius: '5px', border: '1px solid black', display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0.5rem' }}>
                                        <Button onClick={handleDangerModalOpen} style={{ backgroundColor: 'red', color: 'white', border: 'none' }} type='button'>DELETE</Button>
                                    </div>
                                    <br />
                                </Form>
                            </>
                        )}
                    </Formik>
                </FormContainer>
            </FormRoot>
        </Root>
    );
};

export default BookingEditPage;
