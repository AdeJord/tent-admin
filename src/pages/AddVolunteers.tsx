import React from "react";
import { useNavigate } from 'react-router-dom';
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
  role: string;
  notes?: string | undefined;
}

const validRoles = ['Skipper', 'Crew1', 'Crew2', 'Admin/other'];

const schema = yup.object().shape({
  first_name: yup.string().required('You must enter a first name'),
  surname: yup.string().required('You must enter a surname'),
  contact_number: yup.string().required('You must enter a contact number'),
  email_address: yup.string().required('You must enter an email address'),
  house_number: yup.string().required('You must enter a house number'),
  street_name: yup.string().required('You must enter a street name'),
  city: yup.string().required('You must enter a city'),
  postcode: yup.string().required('You must enter a postcode'),
  role: yup.string().oneOf(validRoles, 'Invalid role').required("Please let us know what role the volunteer does"),
  notes: yup.string().notRequired(),
});

type MyResolverType = Resolver<FormData, typeof yupResolver>;

const AddVolunteers: React.FC = () => {

  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<FormData | null>(null);
  const [role, setRole] = React.useState<string | null>(null);

  const navigate = useNavigate();

  const ModalClickHandler = () => {
    setShowModal(false);
    navigate('/');
  };

  const modalContent = (
    <>
    {formData?.first_name} {' '} {formData?.surname} {' '} has been added to the system.
    </>
  );

  // Function to send data to the addVolunteer endpoint
  const submitVolunteer: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await axios.post("https://adejord.co.uk/addVolunteers", data);

      setFormData(data);
      setShowModal(true);

    } catch (error) {
      console.error("Error adding volunteer: - ", error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as unknown as MyResolverType,
  });

  return (
    <FormRoot>
      {showModal && (
        <>
          <Backdrop onClick={ModalClickHandler}>
            <Modal
              onClick={ModalClickHandler}
              header="New Volunteer Added"
              content={modalContent}
              footer="The system has been updated"
            />
          </Backdrop>
        </>
      )}
      <h1>Add Volunteer</h1>
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
            submitVolunteer(data);
          })}
        >
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
          <div>
            <label>Role</label>
            <br />
            <label>
              <input
                type="radio"
                value="Skipper"
                {...register("role")}
                onChange={() => setRole("Skipper")}
              />
              Skipper
            </label>
            <br />
            <label>
              <input
                type="radio"
                value="Crew1"
                {...register("role")}
                onChange={() => setRole("Crew1")}
              />
              Crew1
            </label>
            <br />
            <label>
              <input
                type="radio"
                value="Crew2"
                {...register("role")}
                onChange={() => setRole("Crew2")}
              />
              Crew2
            </label>
            <br />
            <label>
              <input
                type="radio"
                value="Admin/other"
                {...register("role")}
                onChange={() => setRole("Admin/other")}
              />
              Admin/other
            </label>
            {errors.role && (
              <p style={{ color: "red" }}>{errors.role.message}</p>
            )}
            <br />
          </div>
          <br />
          <label>Notes</label>
          <input
            style={{ height: "7vh" }}
            type="string" {...register("notes")} />
          <br />
          <input type="submit" />
          <br />
        </form>
      </FormContainer>
    </FormRoot>
  );
};

export default AddVolunteers;
