import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Link, Navigate, Routes } from 'react-router-dom';
import { useAuth } from './components/AuthContext'; // Ensure you import useAuth
import SignInPage from './pages/SignIn'; // Ensure you have a SignInPage component
import Greeting from './components/Greeting';
// Import all other components and pages as before

import { Root, Header, HeaderSideDiv, HeaderDiv } from './styles';
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
import AllNews from './pages/AllNews';
import EditNews from './pages/EditNews';
import AddGalleryImages from './pages/AddGalleryImages';
import EditGalleryImages from './pages/EditGalleryImages';


function App() {
  const { isAuthenticated, logout } = useAuth(); // Use logout from auth context
  const userName = localStorage.getItem('userName');
  const [loggedInName, setLoggedInName] = useState(userName);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setLoggedInName(localStorage.getItem('userName'));
    } else {
      setLoggedInName('');
    }
  }, [isAuthenticated]);

  const logOut = () => {
    logout(); // Call logout from the auth context which should handle state changes
    localStorage.clear(); // Clear local storage
  };

  return (
    <BrowserRouter>
      <Root>
        <Header>
          <HeaderDiv>
            {isAuthenticated && loggedInName && (
              <>
                <p style={{
                  color: '#EAF3E7',
                  fontSize: '15px'
                }}>
                  <Greeting 
                  loggedInName={loggedInName} />
                </p>
                <Link to="/" style={{
                  textDecoration: 'none',
                  width: '60%',
                  fontSize: '4vw',
                  color: '#EAF3E7',
                  textAlign: 'center',
                }}>
                  TENT ADMIN
                </Link>
                <Link
                  onClick={logOut}
                  to="/signin"
                  style={{
                    textDecoration: 'none',
                    fontSize: '10px',
                    color: '#EAF3E7'
                  }}
                >
                  Sign Out
                </Link>
              </>
            )}
          </HeaderDiv>
        </Header>
        <Routes>
          {/* Conditionally render SignInPage or protected routes */}
          {isAuthenticated ? (
            <>
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

              <Route path='/createbooking' element={<ProtectedRoute><CreateBooking /></ProtectedRoute>} />
              <Route path="/allbookings" element={<ProtectedRoute><AllBookings /></ProtectedRoute>} />
              <Route path="/editBooking/:bookingId" element={<ProtectedRoute><BookingEditPage /></ProtectedRoute>} />


              <Route path="/allvolunteers" element={<ProtectedRoute><AllVolunteers /></ProtectedRoute>} />
              <Route path='/addvolunteers' element={<ProtectedRoute><AddVolunteers /></ProtectedRoute>} />
              <Route path="/editVolunteer/:volunteerId" element={<ProtectedRoute><EditVolunteers /></ProtectedRoute>} />


              <Route path="/AvailabilityCalendar" element={<ProtectedRoute><AvailabilityCalendar /></ProtectedRoute>} />


              <Route path='/addNews' element={<ProtectedRoute><AddNews /></ProtectedRoute>} />
              <Route path='/news' element={<ProtectedRoute><AllNews /></ProtectedRoute>} />
              <Route path='/editNews/:newsId' element={<ProtectedRoute><EditNews /></ProtectedRoute>} />

              <Route path='/addGalleryImages' element={<ProtectedRoute><AddGalleryImages /></ProtectedRoute>} />
              <Route path='/editGalleryImages/:imageId' element={<ProtectedRoute><EditGalleryImages /></ProtectedRoute>} />
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
