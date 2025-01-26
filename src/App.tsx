import React from 'react';
import { BrowserRouter, Route, Link, Navigate, Routes } from 'react-router-dom';
import { useAuth } from './components/AuthContext';
import SignInPage from './pages/SignIn';
import Greeting from './components/Greeting';
import { Root, Header, HeaderDiv, StyledGreeting } from './styles';
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
  const { isAuthenticated, logout } = useAuth();
  const userName = localStorage.getItem('userName');

  const logOut = () => {
    logout();
    localStorage.clear();
  };

  return (
    <BrowserRouter>
      <Root>
        <Header>
          <HeaderDiv>
            <Link to="/" style={{
              textDecoration: 'none',
              width: '60%',
              fontSize: '4vw',
              color: '#EAF3E7',
              textAlign: 'center',
            }}>
              TENT ADMIN
            </Link>

            {isAuthenticated && (
              <StyledGreeting>
                <Greeting loggedInName={userName || ''} />
              </StyledGreeting>
            )}
            <Link
              onClick={logOut}
              to="/signin"
              style={{
                textDecoration: 'none',
                fontSize: '10px',
                color: '#EAF3E7',
                visibility: isAuthenticated ? 'visible' : 'hidden'
              }}
            >
              Sign Out
            </Link>
          </HeaderDiv>
        </Header>

        <Routes>
          <Route path="/signin" element={
            isAuthenticated ? <Navigate to="/" replace /> : <SignInPage />
          } />

          {isAuthenticated ? (
            <>
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
              <Route path='/editGalleryImages' element={<ProtectedRoute><EditGalleryImages /></ProtectedRoute>} />
              <Route path='/editGalleryImages/:imageId' element={<ProtectedRoute><EditGalleryImages /></ProtectedRoute>} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/signin" replace />} />
          )}
        </Routes>
      </Root>
    </BrowserRouter>
  );
}

export default App;