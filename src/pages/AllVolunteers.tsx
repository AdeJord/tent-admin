import React, { useEffect, useState } from "react";
import {
  Root,
  Table,
  TableCell,
  Button,
  ButtonContainer,
  TableContainer
} from "../styles";
import axios from "axios";
import { Link } from "react-router-dom";

// Define an interface for the booking object
interface Booking {
  id: any;
  first_name: string;
  surname: string;
  contact_number: string;
  email_address: string;
  house_number: string;
  street_name: string;
  city: string;
  postcode: string;
  role: string;
  notes: string;
}

const AllVolunteers = () => {
  const [data, setData] = useState<Booking[]>([]); // Initialize data as an empty array

  useEffect(() => {
    // console.log("fetch started"); // Log the start of function
    axios
      .get("https://adejord.co.uk/volunteers")
      .then((response) => {
        // console.log("API Response:", response.data); // Log the response
        setData(response.data);

        // console.log("Data:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        console.error('Error details:', error.response);
      });
    // { console.log(getBookingsForMonth(targetMonth)) }
  }, []);

  return (
    <Root>
      <>
        <h1>All Volunteers</h1>
        <TableContainer>
          <Table>
            <thead style={{ background: "gray" }}>
              <tr>
                <th>First Name</th>
                <th>Surname</th>
                <th>Contact Number</th>
                <th>Contact Email</th>
                <th>House Number</th>
                <th>Street</th>
                <th>City</th>
                <th>Postcode</th>
                <th>Role</th>
                <th>Notes</th>
                <th>LINK TO EDIT!</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.first_name}</td>
                  <td>{item.surname}</td>
                  <td>{item.contact_number}</td>
                  <td>{item.email_address}</td>
                  <td>{item.house_number}</td>
                  <td>{item.street_name}</td>
                  <td>{item.city}</td>
                  <td>{item.postcode}</td>
                  <td>{item.role}</td>
                  <td>{item.notes}</td>
                  <td
                    style={{
                      color: "blue",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    <Link to={`/editVolunteer/${item.id}`}>
                      EDIT
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </>
    </Root>
  );
};

export default AllVolunteers;
