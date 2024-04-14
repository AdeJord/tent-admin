import React, { useState, useEffect } from 'react';
import { Root } from '../styles';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../calendarStyles.css'; // Ensure your custom styles are defined here
import { useNavigate } from 'react-router-dom';
import { addMonths, format, subMonths } from 'date-fns';

const CustomNavigation: React.FC<{
  activeStartDate: Date;
  view: string;
  onPrev: () => void;
  onNext: () => void;
}> = ({ activeStartDate, view, onPrev, onNext }) => {
  const currentMonth = format(activeStartDate, 'MMMM yyyy');

  return (
    <div className="custom-navigation">
      <button className="nav-button current-month">{currentMonth}</button>
    </div>
  );
};


const AvailabilityCalendar: React.FC = () => {
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState<string[]>(["2024-04-12", "2024-08-08", "2024-04-09"]);
  const navigate = useNavigate();

  const isMonthOutOfRange = (date: Date) => {
    const month = date.getMonth();
    return month < 3 || month > 9; // January is 0, December is 11
  };

  // Handlers to navigate between months
  const handlePrevMonth = () => {
    setActiveStartDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setActiveStartDate(prevDate => addMonths(prevDate, 1));
  };

  useEffect(() => {
    fetch('https://adejord.co.uk/dates')
      .then(response => response.json())
      .then(data => setBookedDates(data))
      .catch(error => console.error('Error fetching data: ', error));
      console.log(bookedDates);
  }, []);



  // This function converts a date to a YYYY-MM-DD string in local time
  function toLocalDateString(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  const handleDayClick = (date: Date) => {
    // Set the hours to zero to avoid the timezone issues when converting to ISO string
    date.setHours(0, 0, 0, 0);
    // Create a new Date object that accounts for the timezone offset
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const dateString = localDate.toISOString().split('T')[0];
  
    console.log(`Date clicked: ${dateString}`);
    console.log(`Booked dates: ${bookedDates}`);
  
    if (!bookedDates.includes(dateString)) {
      console.log('Navigating to CreateBooking');
      navigate(`/CreateBooking?date=${dateString}`);
    } else {
      console.log('This date is booked and cannot be selected.');
    }
  };
  
  return (
    <Root style={{ paddingTop: '10vh' }}>
      {/* <AvailabilityCalendarContainer> */}
      <Calendar

        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate || new Date())}
        className='customCalendar'
        navigationLabel={({ date, view }) => (
          <CustomNavigation
            activeStartDate={date}
            view={view}
            onPrev={handlePrevMonth}
            onNext={handleNextMonth}
          />
        )}
        tileDisabled={({ activeStartDate, date, view }) =>
          view === 'month' && isMonthOutOfRange(date) // Disable dates that are out of the range
        }


        tileClassName={({ date, view }) => {
          if (view === 'month') {
            const dateString = toLocalDateString(date);
        
            if (bookedDates.includes(dateString)) {
              return 'booked'; // Apply the booked class to dates that are booked
            } else if (isMonthOutOfRange(date)) {
              return 'not-operational'; // Apply the not-operational class to dates out of season
            } else {
              return 'free'; // Apply the free class to dates that are not booked
            }
          }
        }}
        

        onClickDay={handleDayClick}


      />
      {/* Key/Legend for the calendar */}
      <div className="calendar-key">
        <div className="key-item">
          <span className="key-color not-operational"></span> Out Of Season
        </div>
        <div className="key-item">
          <span className="key-color free"></span> Available
        </div>
        <div className="key-item">
          <span className="key-color booked"></span> Booked
        </div>

      </div>
      {/* </AvailabilityCalendarContainer> */}
    </Root>
  );
};

export default AvailabilityCalendar;
