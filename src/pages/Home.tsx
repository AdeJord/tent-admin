import { Root, Container, ContainerPartition, Header } from '../styles';
import AllBookings from './AllBookings'
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <Root>
            <Container>
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to="./AllBookings">View/Edit Bookings</Link>
                </ContainerPartition>
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to="./AllVolunteers">View/Edit Volunteers</Link>
                </ContainerPartition>
            </Container>
            <Container>
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to="/AvailabilityCalendar">Create Booking</Link>
                </ContainerPartition>
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to='/AddVolunteers'>Add A Volunteer</Link>
                </ContainerPartition>
            </Container>
            <Container>
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to="/AvailabilityCalendar">Edit News</Link>
                </ContainerPartition>
                <ContainerPartition>
                    <Link style={{ textDecoration: 'none' }} to='/AddNews'>Add News</Link>
                </ContainerPartition>
            </Container>
        </Root>
    );
}

export default Home