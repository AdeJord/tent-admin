import React from 'react'

//THIS WILL BE IN THE FORM OF A MODAL WHICH SHOWS WHEN EDIT BUTTON IS CLICKED ON A BOOKINGimport React from "react";
import { Root, FormRoot, FormContainer } from "../styles";
import { format } from 'date-fns';
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

//ADD POTSAL ADDRESS TO FORM

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
  notes: string;
  terms_and_conditions: boolean;
  group_leader_policy: boolean;
  // bookingMonth: string;
}


const schema = yup.object().shape({
  first_name: yup.string().required(),
  surname: yup.string().required(),
  contact_number: yup.string().required(),
  email_address: yup.string().required(),
  house_number: yup.string().required(),
  street_name: yup.string().required(),
  city: yup.string().required(),
  postcode: yup.string().required(),
  booking_date: yup.string().required(),
  wheelchair_users: yup
    .number()
    .required()
    .oneOf([0, 1, 2], "Maximum of 2 wheelchair users per booking"),
  smoking: yup.boolean().required("Please select Yes or No for smoking"),
  destination: yup.string().required("Please select a destination"),
  lunch_arrangements: yup.string().required("Please select a lunch option"),
  notes: yup.string().required(),
  terms_and_conditions: yup.boolean().required('Please accept the terms and conditions'),
  group_leader_policy: yup.boolean().required('Please accept the group leader policy'),
  // bookingMonth: yup.string().required(),
  // paid_status: yup.string().required(),
  // skipper: yup.string().required(),
  // crew1: yup.string().required(),
  // crew2: yup.string().required(),
  // complete: yup.string().required(),

});


const editBooking: React.FC = () => {

  // Function to send data to the createBooking endpoint
  const submitBooking: SubmitHandler<FormData> = async (data) => {
    // Format the date to 'DD-MM-YYYY'
    // const formattedDate = format(new Date(data.booking_date), 'dd-MM-yyyy');
    // data.booking_date = formattedDate;

    try {
      const response = await axios.post("https://adejord.co.ukcreateBooking", data);

      console.log("Booking created successfully:", response.data);
      // You can perform additional actions after a successful booking creation here
    } catch (error) {
      console.error("Error creating booking:", error);
      // Handle error scenarios here
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema), // yup, joi and even your own.
    defaultValues: { wheelchair_users: 0 }, // Set default value for wheelchairUsers
  });


  return (
    <FormRoot>
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
          <label>First Name</label>
          <input 
          style={{ width: "20vw" }} 
          {...register("first_name")} 
          autoComplete="given-name" />

          <label>Surname</label>
          <input 
          style={{ width: "20vw" }} 
          {...register("surname")} 
          autoComplete="family-name" />

          <label>Contact Number</label>
          <input 
          style={{ width: "20vw" }} 
          type="string" {...register("contact_number")} 
          autoComplete="tel" />

          <label>Email</label>
          <input 
          style={{ width: "20vw" }} 
          type="string" {...register("email_address")} 
          autoComplete="email" />

          <label>House Number</label>
          <input
            style={{ width: "20vw" }}
            type="string" {...register("house_number")} 
            autoComplete="address-line1" />

          <label>Steet Name</label>
          <input
            style={{ width: "20vw" }}
            type="string" {...register("street_name")} 
            autoComplete="address-line2" />

          <label>City</label>
          <input
            style={{ width: "20vw" }}
            type="string" {...register("city")} 
            autoComplete="address-level2" />

          <label>Postcode</label>
          <input
            style={{ width: "10vw" }}
            type="string" {...register("postcode")} 
            autoComplete="postal-code" />
          <br />
          <label>Booking Date</label>
          <input
            style={{ width: "10vw" }}
            type="date" {...register("booking_date")} />
          <br />
          <label>Wheelchair Users</label>
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
            {/* NEED TO CHANGE THIS TO A STRING FOR YES AND NO HERE AND IN BACKEND? (EASIER THAN USING BOOLEAN) */}
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
              />
              Autherley (£130)
            </label>
            <br />
            <label>
              <input type="radio" value="Coven" {...register("destination")} />
              Coven( £100)
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
              {...register("lunch_arrangements")} />
            Fish & Chips
          </label>
          <label>
            <input
              type="radio"
              value="Pub Meal"
              {...register("lunch_arrangements")} />
            Pub Meal
          </label>
          <br />
          <label>Other Requirements</label>
          <input
            style={{ height: "7vh" }}
            type="string" {...register("notes")} />
          <br />
          <label>
            I have read and agree to the terms and conditions
          </label>
          <input
            type="checkbox"
            {...register("terms_and_conditions")}
          />
          <label>
            I have read and agree to the group leader policy
          </label>
          <input
            type="checkbox"
            {...register("group_leader_policy")}
          />

          <input type="submit" />
        </form>
      </FormContainer>
    </FormRoot>
  );
};

export default editBooking;
