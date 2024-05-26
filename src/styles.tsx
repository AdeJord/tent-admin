import styled from "./styled";

export const Root = styled.div`
  background-color: #eaf3e7;
  height: auto;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 15px;
  color: #051101;
  font-family: "Roboto, Arial, Helvetica, sans-serif";
  padding: 0;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;


export const FormRoot = styled.div`
  background-color: #eaf3e7;
  height: auto;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: calc(10px + 2vmin);
  color: #051101;
  font-family: "Roboto, Arial, Helvetica, sans-serif";
`;

export const FormContainer = styled.div`
  background-color: gray;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
  font-family: 'Roboto, Arial, Helvetica, sans-serif';
  color: #333;
  font-size: 1rem;
  
  @media (max-width: 600px) {
    // padding: 1rem;
    font-size: 0.9rem;
  }

  @media (max-width: 400px) {
    // padding: 0.5rem;
    font-size: 0.8rem;
  }
`;

export const Input = styled.input`
  // width: calc(100% - 1rem);
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    // width: calc(100% - 0.8rem);
    padding: 0.4rem;
  }

  @media (max-width: 400px) {
    // width: calc(100% - 0.6rem);
    padding: 0.3rem;
  }
`;

export const Label = styled.label`
  width: 100%;
  margin-bottom: 0.5rem;
  color: black;
  font-size: 1rem;

  @media (max-width: 600px) {
    font-size: 0.9rem;
  }

  @media (max-width: 400px) {
    font-size: 0.8rem;
  }
`;


export const FormSection = styled.div`
  background-color: #eaf3e7;
  height: 185vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: calc(10px + 2vmin);
  color: #051101;
  font-family: "Roboto, Arial, Helvetica, sans-serif";
`;



export const CalendarContainer = styled.div`
  background-color: #eaf3e7;
  height: 90vh;
  width: 80vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: calc(10px + 2vmin);
  color: #051101;
  font-family: "Roboto, Arial, Helvetica, sans-serif";
`;

export const ButtonContainer = styled.div`
  background-color: #eaf3e7;
  height: 10vh;
  width: 100vw;
  display: flex;
  padding: 0.5rem;
  flex-direction: column;
  align-items: center;
  color: #051101;
  font-family: "Roboto, Arial, Helvetica, sans-serif";
`;





























export const Header = styled.div`
  display: flex;
  flex-direction: row; 
  align-items: center;  
  justify-content: space-between; 
  width: 100%; 
  height: 10vh;
  background-color: #051101;
  color: #eaf3e7;
  font-family: "Roboto, Arial, sans-serif";

  @media (max-width: 768px) {
    height: 8vh;
    flex-direction: column;  // Stack items vertically on smaller screens
  }
`;

export const HeaderDiv = styled.div`
  display: flex;
  flex: 2 0 55%;
  align-items: center;
  background-color: black; /* Ensure the background is black */
  padding: 10px; /* Add padding to avoid content touching the edges */

  @media (max-width: 768px) {
    flex: 1 0 100%;
    justify-content: center;
  }
`;

export const StyledGreeting = styled.p`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 10%
  // background-color: black; /* Match the parent background */
  background-color: red;
  color: #EAF3E7;
  font-size: 15px; /* Default font size */
  padding: 10px 20px;
  margin: 0; /* Remove default margin */
  border-radius: 5px; /* Slight rounding for aesthetics */

  @media (max-width: 768px) {
    font-size: 12px; /* Smaller font size on small devices */
  }
`;


export const HeaderSideDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 0 25%;  // Takes up 25% of the space, no shrinking
  align-items: center;
  justify-content: space-around; 

  @media (max-width: 768px) {
    flex: 1 0 100%;  // Full width on smaller screens
    justify-content: center;
    margin-top: 10px;
  }
`;



























export const Container = styled.div`
  height: 20vh;
  width: 60vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  font-family: "Roboto, Arial, Helvetica, sans-serif";
  padding: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    width: 80vw;
  }

  @media (max-width: 480px) {
    width: 90vw;
  }
`;

export const ContainerRow = styled.div`
  height: 10vh;
  width: 60vw;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  font-family: "Roboto, Arial, Helvetica, sans-serif";
`;

export const ColumnContainer = styled.div`
  height: 100vh;
  width: 60vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Roboto, Arial, Helvetica, sans-serif";
`;

export const ContainerPartition = styled.div`
  border-radius: 10px;
  height: 10vh;
  width: 40vw;
  display: flex;
  flex-direction: column;
  border: 1px solid #051101;
  align-items: center;
  justify-content: center;
  font-family: "Roboto, Arial, Helvetica, sans-serif";
  background-color: white;
  margin-left: 2rem;
  margin-right: 2rem;

  &:hover {
    background-color: #eaf3e7;
    color: green;
  }

  @media (max-width: 768px) {
    width: 80vw;
    margin-left: 1rem;
    margin-right: 1rem;
    height: auto;
    padding: 0.5rem;
  }

  @media (max-width: 480px) {
    width: 90vw;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    height: auto;
    padding: 0.5rem;
  }
`;

export const UploadDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: gray;
  color: #051101;
  font-size: 16px;
  font-family: "Roboto, Arial, Helvetica, sans-serif";
  border: 1px solid #051101;
  border-radius: 5px;
  padding: 1rem;
  margin: 0.5rem;
  width: 10vw;
  height: 10vh;

  &:hover {
    background-color: #eaf3e7;
    color: #051101;
  }

  @media (max-width: 768px) {
    width: 30vw;
    height: 5vh;
  }

  @media (max-width: 480px) {
    width: 40vw;
    height: 10vh;
  }
`;

export const Link = styled.a`
  text-decoration: none;
  color: #051101;
`;

export const LinkDiv = styled(Link)`
  color: white;
  font-size: calc(40px + 2vmin);
  font-family: "Roboto, Arial, Helvetica, sans-serif";
  text-decoration: none;
  &:hover,
  &:focus {
    color: green;
  }

  &:active {
    color: red;
  }
`;

export const Button = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: gray;
  color: #051101;
  font-size: 10px;
  font-family: "Roboto, Arial, Helvetica, sans-serif";
  border: 1px solid #051101;
  border-radius: 5px;
  padding: 0.5rem;
  margin: 0.5rem;
  width: 10vw;
  height: 5vh;
  &:hover {
    background-color: #eaf3e7;
    color: #051101;
  }
`;

export const Table = styled.table`
font-family: "Roboto, Arial, Helvetica, sans-serif";
font-size: calc(2px + 1vmin);
border-collapse: collapse;

th, td {
  border: 1px solid #051101;
  padding: 8px;
  text-align: center;
`;

export const TableCell = styled.td`
  white-space: nowrap;        /* Prevent text wrapping */
  overflow: hidden;           /* Hide overflow content */
  text-overflow: ellipsis;    /* Show ellipsis (...) for truncated text */
`;

export const TableContainer = styled.div`
  background-color: #eaf3e7;
  // box-sizing: border-box;
  height: auto;
  width: calc(100vw - 15px); /* Adjust 15px to the actual scrollbar width if needed */
  overflow-x: auto;
  width: 95vw;
  display: flex;
  flex-direction: column;
  align-items: left;
  color: #051101;
  font-family: "Roboto, Arial, Helvetica, sans-serif";
  -webkit-overflow-scrolling: touch; // Add momentum to scrolling on iOS devices
  overflow-scrolling: touch;
`;

export const ModalRoot = styled.div`
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); 
  z-index: 105;
  width: auto; 
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: calc(8px + 2vmin);
  color: #333;
  font-family: "Roboto, Arial, Helvetica, sans-serif";
  transition: all 0.6s ease;
  border-radius: 10px;
  background-color: #f8f8f8;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  background-color: #a0d2a3; /* Softer shade of green */
  height: 8vh; /* Adjust the header height */
  width: 100%; /* Make header width consistent with modal width */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: #333; /* Softer text color */
  font-family: "Roboto, Arial, Helvetica, sans-serif";
  border-top-left-radius: 10px; /* Rounded corners */
  border-top-right-radius: 10px; /* Rounded corners */
`;

export const ModalContent = styled.div`
  background-color: #f8f8f8; /* Softer background color */
  padding: 20px; /* More padding for better spacing */
  height: auto; /* Auto height to fit content */
  width: auto /* Content width consistent with modal width */
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start; /* Align content to the top */
  font-size: calc(5px + 2vmin);
  color: #333; /* Softer text color */
  font-family: "Roboto, Arial, Helvetica, sans-serif";
`;

export const ModalFooter = styled.div`
  background-color: #a0d2a3; /* Softer shade of green */
  height: 8vh; /* Adjust the footer height */
  width: 100%; /* Make footer width consistent with modal width */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: #333; /* Softer text color */
  font-family: "Roboto, Arial, Helvetica, sans-serif";
  border-bottom-left-radius: 10px; /* Rounded corners */
  border-bottom-right-radius: 10px; /* Rounded corners */
`;

export const DangerModalRoot = styled.div`
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 100;
  max-width: 600px;
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: calc(8px + 2vmin);
  color: white;
  font-family: "Roboto, Arial, Helvetica, sans-serif";
  transition: all 0.3s ease;
  border-radius: 15px;
  background-color: #ffebee;
  position: fixed; /* Changed to fixed to ensure it's always in view */
  top: 50%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Adjust for true centering */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const DangerModalHeader = styled.div`
  background-color: #ef9a9a; // Softer shade of red
  padding: 10px 20px; // Padding inside the header
  width: 100%; // Header takes the full width of the modal
  text-align: center; // Centers the text horizontally
  border-top-left-radius: 15px; // Match DangerModalRoot border radius
  border-top-right-radius: 15px; // Match DangerModalRoot border radius
`;

export const DangerModalContent = styled.div`
  background-color: #ffcdd2; // Lighter red for the content background
  padding: 20px;
  width: 100%; // Content takes the full width of the modal
  text-align: left; // Aligns text to the left
  font-size: calc(8px + 2vmin);
  color: #212121; // Dark grey for better readability
`;

export const DangerModalFooter = styled.div`
  background-color: #ef9a9a; // Softer shade of red for footer
  padding: 10px 20px; // Padding inside the footer
  width: 100%; // Footer takes the full width of the modal
  display: flex;
  justify-content: space-around; // Spaces out buttons on either end
  border-bottom-left-radius: 15px; // Match DangerModalRoot border radius
  border-bottom-right-radius: 15px; // Match DangerModalRoot border radius
`;

export const AvailabilityCalendarContainer = styled.div`
 max-width: 90vw;
 width: 90vw;
 height: 90vh;
 margin: auto;
 margin-top: 20px;
 border-radius: 3px;
 .react-calendar__navigation {
  display: flex;

  .react-calendar__navigation__label {
    font-weight: bold;
  }

  .react-calendar__navigation__arrow {
    flex-grow: 0.333;
  }
}

/* ~~~ label styles ~~~ */
.react-calendar__month-view__weekdays {
  text-align: center;
}

/* ~~~ button styles ~~~ */
button {
  margin: 3px;
  background-color: #6f876f;
  border: 0;
  border-radius: 3px;
  color: white;
  padding: 5px 0;

  &:hover {
    background-color: #556b55;
  }

  &:active {
    background-color: #a5c1a5;
  }
}

/* ~~~ day grid styles ~~~ */
.react-calendar__month-view__days {
  display: grid !important;
  grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%; 

  .react-calendar__tile {
    max-width: initial !important;
  }
}

/* ~~~ neighboring month & weekend styles ~~~ */
.react-calendar__month-view__days__day--neighboringMonth {
  opacity: 0.7;
}
.react-calendar__month-view__days__day--weekend {
  color: #dfdfdf;
}

/* ~~~ other view styles ~~~ */
// .react-calendar__year-view__months, 
// .react-calendar__decade-view__years, 
// .react-calendar__century-view__decades {
//   display: grid !important;
//   grid-template-columns: 20% 20% 20% 20% 20%;

//   &.react-calendar__year-view__months {
//     grid-template-columns: 33.3% 33.3% 33.3%;
//   }

//   .react-calendar__tile {
//     max-width: initial !important;
//   }
// }
`;



export const ErrorMessage = styled.p`
  color: red;
  font-size: 0.8rem;
  margin: 5px 0;
`;

export const FormButton = styled.button`
width: 100%;
padding: 12px 20px;
background-color: #4CAF50;
color: white;
border: none;
border-radius: 4px;
cursor: pointer;
font-size: 1.2rem;
margin-top: 20px;
text-align: center;
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const GroupLabel = styled.p`
  font-weight: bold;
  margin-bottom: 5px; 
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  margin-right: 20px; 
  margin-bottom: 10px;
  font-size: 1rem;
  color: #333;

  input[type="radio"] {
    margin-right: 8px; 
  }
`;

export const NarrowInput = styled(Input)`
  width: 40%;
  margin-top: 8px; 
  margin-bottom: 8px;
`;

