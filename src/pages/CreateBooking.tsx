import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FormRoot,
  FormContainer
} from "../styles";
import axios from "axios";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Modal from "../components/modal/Modal";
import Backdrop from "../components/modal/ModalBackdrop";


interface FormData {
  first_name: string;
  surname: string;
  contact_number: string;
  email_address: string;
  house_number: string;
  street_name: string;
  city: string;
  postcode: string;
  booking_date: string;
  wheelchair_users: number;
  smoking: boolean;
  destination: string;
  lunch_arrangements: string;
  notes?: string | undefined;
  terms_and_conditions: boolean;
  group_leader_policy: boolean;
  total_passengers: number;
  group_name?: string | undefined;
  // Need to add group size
}

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
    console.log('Selected Date:', selectedDate);
    console.log('Booked Dates:', bookedDates);
    const isDateBooked = bookedDates.some((bookedDate: string) => new Date(bookedDate).getTime() === selectedDate.getTime());
    // console.log('Is Date Booked:', isDateBooked);

    return !isDateBooked;
  } catch (error) {
    console.error('Error checking booking availability:', error);
    return false;
  }
};


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
        // Only perform the validation if the date is in the future
        if (value) {
          return await isBookingDateAvailable(value);
        }
        return false; // Skip validation if date is not provided
      },
    }),
  wheelchair_users: yup
    .number()
    .required()
    .oneOf([0, 1, 2], "Maximum of 2 wheelchair users per booking"),
  total_passengers: yup
    .number()
    .required()
    .oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "Maximum of 12 passengers per booking"),
  smoking: yup.boolean().required("Please select Yes or No for smoking"),
  destination: yup.string().required("Please select a destination"),
  lunch_arrangements: yup.string().required("Please select a lunch option"),
  notes: yup.string().notRequired(),
  terms_and_conditions: yup.boolean().oneOf([true], 'Please accept the terms and conditions'),
  group_leader_policy: yup.boolean().oneOf([true], 'Please accept the group leader policy'),
});



type MyResolverType = Resolver<FormData, typeof yupResolver>;

const CreateBooking: React.FC = () => {
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<FormData | null>(null);
  const [selectedDestination, setSelectedDestination] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extracting the date from the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const selectedDate = queryParams.get('date');



  const ModalClickHandler = () => {
    setShowModal(false);
    navigate('/');
  };

  // Helper function to get lunch arrangement description
  const getLunchArrangementDescription = (lunchArrangement: string | undefined) => {
    switch (lunchArrangement) {
      case 'Packed Lunch':
        return ' you will be bringing your own packed lunch.';
      case 'Fish and Chips':
        return ' you will have fish and chips delivered to the boat.';
      case 'Pub Meal':
        return ' where you will be eating at the pub.';
      default:
        return 'where lunch arrangements are not specified.';
    }
  };

  //Helper to get the wheechair users message
  const getWheelchairUsersDescription = (wheelchairUsers: number) => {
    switch (wheelchairUsers) {
      case 0:
        return 'There are no wheelchair users on this trip Please let us know if this changes so we can have the lift ready.';
      case 1:
        return 'There is 1 wheelchair user on this trip. The lift will be ready for you.';
      case 2:
        return 'There are 2 wheelchair users on this trip. The lift will be ready for you.';
      default:
        return 'There are no wheelchair users on this trip. The lift will be ready for you.';
    }
  };

  const modalContent = (
    <>
      <p>Your boat trip for the
        {' '}
        {formData?.booking_date && new Date(formData?.booking_date).toLocaleDateString('en-GB')}
        {' '}
        has been successfully booked.
      </p>
      <p>
        This is a {formData?.smoking ? 'smoking' : 'non-smoking'} trip to
        {' '}
        {formData?.destination} and
        {getLunchArrangementDescription(formData?.lunch_arrangements)}
      </p>
      <p>
        {getWheelchairUsersDescription(formData?.wheelchair_users ?? 0)}
      </p>
      <p>You will receive an email with booking confirmation.</p>
    </>
  );



  // Function to send data to the createBooking endpoint
  const submitBooking: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await axios.post("https://adejord.co.uk/createBooking", data);

      // console.log("Booking created successfully:", response.data);
      setFormData(data);
      console.log(formData)// returns null?
      setShowModal(true);

      // Send email with specific properties
      const {
        email_address,
        first_name,
        surname,
        group_name,
        contact_number,
        house_number,
        street_name,
        city,
        postcode,
        booking_date,
        total_passengers,
        wheelchair_users,
        smoking,
        destination,
        lunch_arrangements,
        notes,
        terms_and_conditions,
        group_leader_policy,

      } = data;
      await axios.post("https://adejord.co.uk/sendBookingConfirmationEmail", {
        email_address,
        first_name,
        surname,
        group_name,
        contact_number,
        house_number,
        street_name,
        city,
        postcode,
        booking_date,
        total_passengers,
        wheelchair_users,
        smoking,
        destination,
        lunch_arrangements,
        notes,
        terms_and_conditions,
        group_leader_policy,
      });

      // You can perform additional actions after a successful booking creation here

    } catch (error) {
      console.error("Error creating booking:", error);
      // Handle error scenarios here
    }
  };


  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,  // Import setValue from useForm
  } = useForm<FormData>({
    resolver: yupResolver(schema) as MyResolverType,
    defaultValues: {
      wheelchair_users: 0,
      booking_date: selectedDate || '', // Set the default value for booking_date
    },
  });

  // Set the booking_date field value if selectedDate is available
  React.useEffect(() => {
    if (selectedDate) {
      setValue('booking_date', selectedDate);
    }
  }, [selectedDate, setValue]);

  return (
    <FormRoot>
      {showModal && (
        <>
          <Backdrop onClick={ModalClickHandler}>
            <Modal
              onClick={ModalClickHandler}
              header="Booking Submitted"
              content={modalContent}
              footer="Thank you for booking with us. We look forward to seeing you!"
            />
          </Backdrop>
        </>
      )}
      <h1>Booking Form</h1>
      <FormContainer>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            paddingTop: "2vh",
            height: "auto",
            width: "30vw",
          }}
          onSubmit={handleSubmit((data: FormData) => {
            submitBooking(data);
            // console.log(data); 
          })}
        >
        <label
        style={{
          textAlign: "center",
        }}
        >Booking Date</label>
        <div style={{
           margin: "10px 0", 
           backgroundColor: "#e2f0dd", 
           borderRadius: "4px", 
           fontSize: "1.2rem",
           textAlign: "center",
           }}>
          {selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB') : 'No date selected'}
          <input
            type="hidden"
            {...register("booking_date")}
            value={selectedDate || ''}
          />
        </div>
        {errors.booking_date && (
          <p style={{ color: "red" }}>{errors.booking_date.message}</p>
        )}
          <br />
          <label>First Name</label>
          <input
            style={{ width: "20vw" }}
            {...register("first_name")}
            autoComplete="given-name" />
          {errors.first_name && (
            <p style={{ color: "red" }}>{errors.first_name.message}</p>
          )}

          <label>Surname</label>
          <input
            style={{ width: "20vw" }}
            {...register("surname")}
            autoComplete="family-name" />
          {errors.surname && (
            <p style={{ color: "red" }}>{errors.surname.message}</p>
          )}
          <label>Group/Organisation name <small>(If applicable)</small></label>
          <input
            style={{ width: "20vw" }}
            {...register("group_name")}
          />
          <label>Contact Number</label>
          <input
            style={{ width: "20vw" }}
            type="string" {...register("contact_number")}
            autoComplete="tel" />
          {errors.contact_number && (
            <p style={{ color: "red" }}>{errors.contact_number.message}</p>
          )}

          <label>Email</label>
          <input
            style={{ width: "20vw" }}
            type="text" {...register("email_address")}
            autoComplete="email" />
          {errors.email_address && (
            <p style={{ color: "red" }}>{errors.email_address.message}</p>
          )}
          <small>Your booking confirmation will be sent to this email address.</small>

          <label>House Number</label>
          <input
            style={{ width: "20vw" }}
            type="string" {...register("house_number")}
            autoComplete="address-line1" />
          {errors.house_number && (
            <p style={{ color: "red" }}>{errors.house_number.message}</p>
          )}

          <label>Street Name</label>
          <input
            style={{ width: "20vw" }}
            type="string" {...register("street_name")}
            autoComplete="address-line2" />
          {errors.street_name && (
            <p style={{ color: "red" }}>{errors.street_name.message}</p>
          )}

          <label>City</label>
          <input
            style={{ width: "20vw" }}
            type="string" {...register("city")}
            autoComplete="address-level2" />
          {errors.city && (
            <p style={{ color: "red" }}>{errors.city.message}</p>
          )}

          <label>Postcode</label>
          <input
            style={{ width: "10vw" }}
            type="string" {...register("postcode")}
            autoComplete="postal-code" />
          {errors.postcode && (
            <p style={{ color: "red" }}>{errors.postcode.message}</p>
          )}
          <br />
          <label>Total Passengers <small>(Max 12)</small></label>
          <input
            style={{
              width: "5vw",
            }} type="number" min={1} max={12} {...register("total_passengers")} />
          {errors.total_passengers && (
            <p style={{ color: "red" }}>{errors.total_passengers.message}</p>
          )}
          <br />
          <label>Wheelchair Users <small>(Max 2)</small></label>
          <input
            style={{
              width: "5vw",
            }} type="number" min={0} max={2} {...register("wheelchair_users")} />
          {errors.wheelchair_users && (
            <p style={{ color: "red" }}>{errors.wheelchair_users.message}</p>
          )}
          <br />
          <div>
            <label>Smoking</label>
            <label>
              <input type="radio"
                value="true"
                {...register("smoking")} />
              Yes
            </label>
            <label>
              <input type="radio"
                value="false"
                {...register("smoking")} />
              No
              {errors.smoking && (
                <p style={{ color: "red" }}>{errors.smoking.message}</p>
              )}
            </label>
          </div>
          <br />
          <div>
            <label>Destination</label>
            <br />
            <label>
              <input
                type="radio"
                value="Autherley"
                {...register("destination")}
                onChange={() => setSelectedDestination("Autherley")}
              />
              Autherley (£130)
            </label>
            <br />
            <label>
              <input
                type="radio"
                value="Coven"
                {...register("destination")}
                onChange={() => setSelectedDestination("Coven")}
              />
              Coven(£100)
              {errors.destination && (
                <p style={{ color: "red" }}>{errors.destination.message}</p>
              )}
              <br />
            </label>
            <label>
              <input
                type="radio"
                value="Penkridge"
                {...register("destination")}
                onChange={() => setSelectedDestination("Penkridge")}
              />
              Penkridge "Have A Go day"(£220)
              {errors.destination && (
                <p style={{ color: "red" }}>{errors.destination.message}</p>
              )}
            </label>
          </div>
          <br />
          <label>Lunch Arrangements</label>
          <label>
            <input
              type="radio"
              value="Packed Lunch"
              {...register("lunch_arrangements")}
            />
            Packed Lunch
          </label>
          <label>
            <input
              type="radio"
              value="Fish and Chips"
              {...register("lunch_arrangements")}
              disabled={selectedDestination === "Penkridge"}
            />
            Fish & Chips
          </label>
          <label>
            <input
              type="radio"
              value="Pub Meal"
              {...register("lunch_arrangements")}
              disabled={selectedDestination === "Autherley" || selectedDestination === "Penkridge"}
            />
            Pub Meal
            {errors.lunch_arrangements && (
              <p style={{ color: "red" }}>{errors.lunch_arrangements.message}</p>
            )}
          </label>
          <br />
          <label>Other Requirements</label>
          <input
            style={{ height: "7vh" }}
            type="string" {...register("notes")} />
          <br />
          <label>
            I have read and agree to the terms and conditions
            <input
              type="checkbox"
              {...register("terms_and_conditions")}
            />
            {errors.terms_and_conditions && (
              <p style={{ color: "red" }}>{errors.terms_and_conditions.message}</p>
            )}
          </label>

          <label>
            I have read and agree to the group leader policy
            <input
              type="checkbox"
              {...register("group_leader_policy")}
            />
            {errors.group_leader_policy && (
              <p style={{ color: "red" }}>{errors.group_leader_policy.message}</p>
            )}
          </label>

          <input type="submit" />
          <br />
        </form>
      </FormContainer>
    </FormRoot>
  );
};

export default CreateBooking;