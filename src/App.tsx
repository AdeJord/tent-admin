import React from 'react';
import { BrowserRouter, Route, Link, Navigate, Routes } from 'react-router-dom';
import { useAuth } from './components/AuthContext'; // Ensure you import useAuth
import SignInPage from './pages/SignIn'; // Ensure you have a SignInPage component
// Import all other components and pages as before

import { Root, Header } from './styles';
import AllBookings from './pages/AllBookings';
import AllVolunteers from './pages/AllVolunteers';
import Home from './pages/Home';
import CreateBooking from './pages/CreateBooking';
import AddVolunteers from './pages/AddVolunteers';
import BookingEditPage from './pages/BookingEditPage';
import EditVolunteers from './pages/EditVolunteers';
import AvailabilityCalendar from './pages/AvailabilityCalendar';
import ProtectedRoute from './components/ProtectedRoute';
import AddNews from './pages/AddNews';




function App() {
  const { isAuthenticated } = useAuth(); // Use the authentication state

  return (
    <BrowserRouter>
      <Root>
        <Header>
          <Link to="/" style={{ textDecoration: 'none', fontSize: '4vw', color: '#EAF3E7' }}>
            Tent Admin Page
          </Link>
        </Header>
        <Routes>
          {/* Conditionally render SignInPage or protected routes */}
          {isAuthenticated ? (
            <>
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/allbookings" element={<ProtectedRoute><AllBookings /></ProtectedRoute>} />
              <Route path="/allvolunteers" element={<ProtectedRoute><AllVolunteers /></ProtectedRoute>} />
              <Route path="/AvailabilityCalendar" element={<ProtectedRoute><AvailabilityCalendar /></ProtectedRoute>} />
              <Route path='/createbooking' element={<ProtectedRoute><CreateBooking /></ProtectedRoute>} />
              <Route path='/addvolunteers' element={<ProtectedRoute><AddVolunteers /></ProtectedRoute>} />
              <Route path="/editBooking/:bookingId" element={<ProtectedRoute><BookingEditPage /></ProtectedRoute>} />
              <Route path="/editVolunteer/:volunteerId" element={<ProtectedRoute><EditVolunteers /></ProtectedRoute>} />
              <Route path='/addnews' element={<ProtectedRoute><AddNews /></ProtectedRoute>} />
              {/* Add more routes here as needed */}

              {/* Redirect to Home if no route matches */}
            </>
          ) : (
            <>
              {/* Redirect all routes to SignInPage if not authenticated */}
              <Route path="/signin" element={<SignInPage />} />
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </>
          )}
        </Routes>
      </Root>
    </BrowserRouter>
  );
}

export default App;
