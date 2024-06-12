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
import { log } from "console";

// Define an interface for the booking object
interface Booking {
  id: any;
  booking_date: string;
  first_name: string;
  surname: string;
  group_name: string;
  contact_number: string;
  email_address: string;
  house_number: string;
  street_name: string;
  city: string;
  postcode: string;
  total_passengers: number;
  wheelchair_users: number;
  smoking: string;
  destination: string;
  lunch_arrangements: string;
  notes: string;
  terms_and_conditions: string;
  group_leader_policy: string;
  paid: number;
  skipper: string;
  crew1: string;
  crew2: string;
  complete: string;
  bookingmonth: string;
}

const AllBookings = () => {
  const [data, setData] = useState<Booking[]>([]); // Initialize data as an empty array

  //initialise the year as current year
  const [year, setYear] = useState<number>(new Date().getFullYear());

  //set the current month for initial render
  const [currentMonth, setCurrentMonth] = useState<string>(
    new Date().toLocaleString("en-UK", { month: "long" })
  );
  //set the target month (this is the one that will be displayed)
  const [targetMonth, setTargetMonth] = useState<string>(currentMonth); // Initialize targetMonth as the current month

  // Function to filter bookings by month
  const getBookingsForMonth = (month: string) => {
    // console.log('month:', month);
    // console.log('data:', data);
    // data.forEach(booking => console.log('booking:', booking));
    return data.filter((booking) => booking.bookingmonth === month);
  };

  // Sort the bookings by the booking_date in ascending order
  const sortedBookings = getBookingsForMonth(targetMonth).sort((a, b) => {
    const dateA = new Date(a.booking_date);
    const dateB = new Date(b.booking_date);
    return dateA.getTime() - dateB.getTime();
  });



  useEffect(() => {
    console.log("fetch all bookings started"); // Log the start of function
    axios
      .get("https://adejord.co.uk/bookings")
      .then((response) => {
        // console.log("API Response:", response.data); // Log the response
        setData(response.data);
        console.log("Data:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        console.error('Error details:', error.response);
      });
  }, [targetMonth]);




  const handlePrevMonth = () => {
    let newTargetMonth;
    let newYear = year;

    // Implement logic to switch to the previous month and update the year if needed
    switch (targetMonth) {
      case "January":
        newTargetMonth = "December";
        newYear -= 1; // Decrement the year when transitioning from January to December
        break;
      case "February":
        newTargetMonth = "January";
        break;
      case "March":
        newTargetMonth = "February";
        break;
      case "April":
        newTargetMonth = "March";
        break;
      case "May":
        newTargetMonth = "April";
        break;
      case "June":
        newTargetMonth = "May";
        break;
      case "July":
        newTargetMonth = "June";
        break;
      case "August":
        newTargetMonth = "July";
        break;
      case "September":
        newTargetMonth = "August";
        break;
      case "October":
        newTargetMonth = "September";
        break;
      case "November":
        newTargetMonth = "October";
        break;
      case "December":
        newTargetMonth = "November";
        break;
      default:
        newTargetMonth = "Invalid Date";
    }

    // Update the state with the new month and year
    setTargetMonth(newTargetMonth);
    setYear(newYear);
  };


  const handleNextMonth = () => {
    let newTargetMonth;
    let newYear = year;

    // Implement logic to switch to the next month and update the year if needed
    switch (targetMonth) {
      case "January":
        newTargetMonth = "February";
        break;
      case "February":
        newTargetMonth = "March";
        break;
      case "March":
        newTargetMonth = "April";
        break;
      case "April":
        newTargetMonth = "May";
        break;
      case "May":
        newTargetMonth = "June";
        break;
      case "June":
        newTargetMonth = "July";
        break;
      case "July":
        newTargetMonth = "August";
        break;
      case "August":
        newTargetMonth = "September";
        break;
      case "September":
        newTargetMonth = "October";
        break;
      case "October":
        newTargetMonth = "November";
        break;
      case "November":
        newTargetMonth = "December";
        break;
      case "December":
        newTargetMonth = "January";
        newYear += 1; // Increment the year when transitioning from December to January
        break;
      default:
        newTargetMonth = "Invalid Date";
    }

    // Update the state with the new month and year
    setTargetMonth(newTargetMonth);
    setYear(newYear);
  };

  return (
    <Root>
      <div style={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
      }}>
        <ButtonContainer>
          <Button onClick={handlePrevMonth}>Prev Month</Button>
        </ButtonContainer>
        <div style={{
          display: "flex",
          flexDirection: "row",
          width: "100vw",
        }}>
          <h1
            style={{
              fontSize: "2rem",
            }}
          >{targetMonth} {year}</h1>
        </div>

        <ButtonContainer>
          <Button onClick={handleNextMonth}>Next Month</Button>
        </ButtonContainer>
      </div>
      <>

        <TableContainer>
          <Table>
            <thead style={{ background: "gray" }}>
              <tr>
                <th>Booking Date</th>
                <th>First Name</th>
                <th>Surname</th>
                <th>Group Name</th>
                <th>Contact Number</th>
                <th>Contact Email</th>
                <th>House Number</th>
                <th>Street</th>
                <th>City</th>
                <th>Postcode</th>
                <th>Passengers</th>
                <th>Wheelchair Users</th>
                <th>Smoking</th>
                <th>Destination</th>
                <th>Lunch Arrangements</th>
                <th>Notes</th>
                <th>Terms and Conditions</th>
                <th>Group Leader Policy</th>
                <th>Skipper</th>
                <th>Crew 1</th>
                <th>Crew 2</th>
                <th>Complete</th>
                <th>LINK TO EDIT!</th>
              </tr>
            </thead>
            <tbody>
              {sortedBookings.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.booking_date).toLocaleDateString('en-GB')}</td>
                  <td>{item.first_name}</td>
                  <td>{item.surname}</td>
                  <td>{item.group_name}</td>
                  <td>{item.contact_number}</td>
                  <td>{item.email_address}</td>
                  <td>{item.house_number}</td>
                  <td>{item.street_name}</td>
                  <td>{item.city}</td>
                  <td>{item.postcode}</td>
                  <td>{item.total_passengers}</td>
                  <td>{item.wheelchair_users}</td>
                  <td>{item.smoking ? 'Yes' : 'No'}</td>
                  <td>{item.destination}</td>
                  <td>{item.lunch_arrangements}</td>
                  <td>{item.notes}</td>
                  <td>{item.terms_and_conditions ? 'Agreed' : 'NOT Agreed'}</td>
                  <td>{item.group_leader_policy ? 'Agreed' : 'NOT Agreed'}</td>
                  <td>{item.skipper}</td>
                  <td>{item.crew1}</td>
                  <td>{item.crew2}</td>
                  <td>{item.complete}</td>
                  <td
                    style={{
                      color: "blue",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    <Link to={`/editBooking/${item.id}`}>
                      EDIT
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
        <button>Export ALL to excel</button>
        <button>Export GDPR compliant list</button>
        <p>Email list GDPR compliant list to all required</p>
      </>
    </Root>
  );
};

export default AllBookings;
