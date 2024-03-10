import { Root, Header } from './styles';
import AllBookings from './pages/AllBookings';
import AllVolunteers from './pages/AllVolunteers';
import Home from './pages/Home';
import CreateBooking from './pages/CreateBooking';
import AddVolunteers from './pages/AddVolunteers';
import BookingEditPage from './pages/BookingEditPage';
import { BrowserRouter, Route, Link, Navigate, Outlet, Routes } from 'react-router-dom';
import EditVolunteers from './pages/EditVolunteers';
import AvailabilityCalendar from './pages/AvailabilityCalendar';


function App() {
  return (
    <BrowserRouter>
      <Root>
        <Header>
          <Link style={{
            textDecoration: 'none',
            fontSize: '4vw',
            color: '#EAF3E7',
          }} to="/">
            Tent Admin Page
          </Link>
        </Header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/allbookings" element={<AllBookings />} />
          <Route path="/allvolunteers" element={<AllVolunteers />} />
          <Route path="/AvailabilityCalendar" element={<AvailabilityCalendar />} />
          <Route path='/createbooking' element={<CreateBooking />} />
          <Route path='/addvolunteers' element={<AddVolunteers />} />
          <Route path="/editBooking/:bookingId" element={<BookingEditPage />} />
          <Route path="/editVolunteer/:volunteerId" element={<EditVolunteers />} />
        </Routes>
      </Root>
    </BrowserRouter>
  );
}

export default App;
